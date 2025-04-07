import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import Lights from "./Lights";
import * as THREE from "three";
import { useAppSelector } from "../../../slices/store";
import { Typography } from "@mui/material";
import { calculateCentroid, getGradientColor } from "../../../utils/utils";
import { current } from "@reduxjs/toolkit";
import { ref } from "yup";

// Green - Y
// Blue - Z
// Red - X

const SCALE_FACTOR = 500; // Shrinking factor

const Object = ({
  segmentation,
  height,
  categoryId,
  treeTrunkRadiusFactor = 0.1,
  treeCanopyRadiusFactor = 0.3,
  treeCanopyHeightFactor = 0.6,
  treeTrunkHeightFactor = 0.4,
  debug = true,
  lightPositions,
}: {
  segmentation: number[][];
  height: number;
  categoryId: number;
  treeTrunkRadiusFactor?: number;
  treeCanopyRadiusFactor?: number;
  treeCanopyHeightFactor?: number;
  treeTrunkHeightFactor?: number;
  debug?: boolean;
  lightPositions: THREE.Vector3;
}) => {
  // Scale segmentation points for centroid calculation
  const scaledSegmentationPoints = useMemo(() => {
    if (
      !segmentation ||
      segmentation.length === 0 ||
      segmentation[0].length < 2
    )
      return [];
    const points = [];
    const segPoints = segmentation[0];
    for (let i = 0; i < segPoints.length; i += 2) {
      points.push([
        segPoints[i] / SCALE_FACTOR,
        segPoints[i + 1] / SCALE_FACTOR,
      ]);
    }
    return points;
  }, [segmentation]);

  const shape = useMemo(() => {
    const wireframeShape = new THREE.Shape();
    if (scaledSegmentationPoints.length >= 2) {
      wireframeShape.moveTo(
        scaledSegmentationPoints[0][0],
        scaledSegmentationPoints[0][1]
      );
      for (let i = 1; i < scaledSegmentationPoints.length; i++) {
        wireframeShape.lineTo(
          scaledSegmentationPoints[i][0],
          scaledSegmentationPoints[i][1]
        );
      }
      wireframeShape.closePath();
    }
    return wireframeShape;
  }, [segmentation]);
  //------------------------------------------//

  //--------- Extrude the shape into 3D----------//
  const baseSettings = {
    depth: height / SCALE_FACTOR,
    bevelEnabled: false,
    steps: 1,
    cap: true,
  };

  const basedGeometry = useMemo(
    () => new THREE.ExtrudeGeometry(shape, baseSettings),
    [shape]
  );

  //-----------------------------------------//

  //-------- Tree Trunk Cylinder ------------//
  const polygonBounds = useMemo(() => {
    if (
      !segmentation ||
      segmentation.length === 0 ||
      segmentation[0].length < 2
    ) {
      return { width: 0, depth: 0 };
    }
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;
    const points = segmentation[0];
    for (let i = 0; i < points.length; i += 2) {
      const x = points[i] / SCALE_FACTOR;
      const y = points[i + 1] / SCALE_FACTOR;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    return { width: maxX - minX, depth: maxY - minY };
  }, [segmentation]);

  const polygonWidth = polygonBounds.width;
  const polygonDepth = polygonBounds.depth;

  const trunkRadius =
    Math.min(polygonWidth, polygonDepth) * treeTrunkRadiusFactor;
  const trunkHeight = (height * treeTrunkHeightFactor) / SCALE_FACTOR;
  const trunkGeometry = useMemo(
    () => new THREE.CylinderGeometry(trunkRadius, trunkRadius, trunkHeight, 32),
    [trunkRadius, trunkHeight]
  );
  //--------------------------------------//

  //---------------Tree Canopy (Cone)---------------//
  const canopyRadius =
    Math.max(polygonWidth, polygonDepth) * treeCanopyRadiusFactor;
  const canopyHeight = (height * treeCanopyHeightFactor) / SCALE_FACTOR;
  const canopyGeometry = useMemo(
    () => new THREE.ConeGeometry(canopyRadius, canopyHeight, 32),
    [canopyRadius, canopyHeight]
  );

  const canopyExtrudeSettings = {
    depth: canopyHeight,
    bevelEnabled: false,
    steps: 2,
  };

  const canopyBasedGeometry = useMemo(
    () => new THREE.ExtrudeGeometry(shape, canopyExtrudeSettings),
    [shape]
  );
  //-----------------------------------------//

  // Calculate Centroid
  const centroid = useMemo(() => {
    if (scaledSegmentationPoints.length < 3) return { x: 0, y: 0 }; // Centroid needs at least 3 points
    return calculateCentroid(scaledSegmentationPoints);
  }, [scaledSegmentationPoints]);

  const topGeometry = useMemo(() => {
    const geom = new THREE.ShapeGeometry(shape);
    geom.computeVertexNormals(); // Ensure normals are computed for raycasting
    return geom;
  }, [shape]);

  //-----------------------------------Shadow Simulation-----------------------//

  const lightPosition = useRef<THREE.Vector3>(lightPositions); // Ref to get light position
  const meshRef = useRef<THREE.Group>(null); // Ref for the group mesh
  const { scene } = useThree(); // Access the scene for raycasting

  useEffect(() => {
    if (!meshRef.current || !meshRef.current?.parent) {
      console.log("Mesh parent not found");
      return;
    }

    // const directionalLight = scene.getObjectByName(
    //   "directionalLight"
    // ) as THREE.DirectionalLight;
    // if (directionalLight) {
    //   lightPosition.current.copy(directionalLight.position);
    // }

    const raycaster = new THREE.Raycaster();
    const rayDirection = new THREE.Vector3();

    // Iterate through all meshes inside meshRef
    meshRef.current.children.forEach((child) => {
      const mesh = child as THREE.Mesh;
      const geometry = mesh.geometry;
      const positionAttribute = geometry.attributes.position;
      const numVertices = positionAttribute.count;

      const shadowIntensities: number[] = [];
      const isShadowedArray = [];

      geometry.computeVertexNormals();

      for (let i = 0; i < numVertices; i++) {
        const vertex = new THREE.Vector3().fromBufferAttribute(
          positionAttribute,
          i
        );
        mesh.localToWorld(vertex);

        console.log(mesh.children);

        rayDirection.subVectors(lightPosition.current, vertex).normalize();
        raycaster.set(vertex, rayDirection);

        const intersectTargets: THREE.Object3D[] = [];
        scene.traverse((obj) => {
          if (obj && obj !== mesh) {
            intersectTargets.push(obj);
          }
        });

        const intersects = raycaster.intersectObjects(intersectTargets, true);

        const occluded =
          intersects.length > 0 &&
          intersects[0].object !== mesh &&
          intersects[0].distance < vertex.distanceTo(lightPosition.current);

        let intensity = 1;
        let isShadowed = false;

        if (occluded) {
          isShadowed = true;
        } else {
          const normal = new THREE.Vector3();
          geometry.computeVertexNormals(); // Ensure normals are computed
          normal.fromBufferAttribute(geometry.attributes.normal, i);
          normal.transformDirection(mesh.matrixWorld); // Transform normal to world space

          const lightDir = new THREE.Vector3().copy(rayDirection).negate(); // Direction from vertex to light
          intensity = Math.max(0, normal.dot(lightDir)); // Dot product, clamped to 0-1
        }

        shadowIntensities.push(intensity);
        isShadowedArray.push(isShadowed);
      }

      const colors = new Float32Array(numVertices * 3);
      for (let i = 0; i < numVertices; i++) {
        const color = getGradientColor(
          shadowIntensities[i],
          isShadowedArray[i]
        );
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }

      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.attributes.color.needsUpdate = true;
    });
  }, [lightPosition]);

  return (
    <group
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[-2, 0, 1.6]}
    >
      {categoryId === 3 ? (
        <>
          <mesh
            geometry={trunkGeometry}
            position={[centroid.x, centroid.y, trunkHeight / 2]}
            rotation={[Math.PI / 2, -2, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color={"brown"} side={THREE.DoubleSide} />
          </mesh>
          {/* Canopy (Cone) */}
          <mesh
            geometry={canopyBasedGeometry}
            castShadow
            receiveShadow
            position={[0, 0, trunkHeight]}
          >
            <meshStandardMaterial color={"lime"} side={THREE.DoubleSide} />
          </mesh>
          <mesh
            geometry={topGeometry}
            position={[0, 0, trunkHeight]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color={"lime"} side={THREE.DoubleSide} />
          </mesh>
          <mesh
            geometry={topGeometry}
            position={[0, 0, height / SCALE_FACTOR]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial vertexColors={true} side={THREE.DoubleSide} />
          </mesh>
        </>
      ) : (
        <>
          <mesh geometry={basedGeometry} castShadow receiveShadow>
            <meshStandardMaterial color={"yellow"} side={THREE.DoubleSide} />
          </mesh>

          <mesh
            geometry={topGeometry}
            castShadow
            receiveShadow
            position={[0, 0, height / SCALE_FACTOR + 0.01]}
          >
            <meshStandardMaterial vertexColors={true} side={THREE.DoubleSide} />{" "}
          </mesh>

          <mesh
            geometry={new THREE.BoxGeometry(0.2, 0.2, 0.2)}
            castShadow
            receiveShadow
            position={[0.5, Math.random() * 2, Math.random() * 2]}
          >
            <meshStandardMaterial vertexColors={true} side={THREE.DoubleSide} />
          </mesh>
        </>
      )}
    </group>
  );
};

function Floor() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
      <circleGeometry args={[50]} />
      <meshStandardMaterial color="#fff" />
    </mesh>
  );
}

const Scene = ({
  annotations,
  lightPositions,
}: {
  annotations: any[];
  lightPositions: THREE.Vector3;
}) => {
  return (
    <group position={[0, 0, 0]}>
      {annotations.map((item) => {
        if (item.category_id === 1 || item.category_id === 3) {
          return (
            <Object
              key={item.id}
              segmentation={item.segmentation}
              height={item.object_height}
              categoryId={item.category_id}
              lightPositions={lightPositions}
            />
          );
        }
        return null;
      })}
    </group>
  );
};

const Visualizer1 = () => {
  const coco3DJSON = useAppSelector((state) => state.solar.coco3DJSON);
  const [lightPositions, setLightPositions] = React.useState([110, 100, 40]);

  // Check if coco3DJSON and coco_output arTHREE.e defined before accessing annotations
  const annotations = coco3DJSON?.coco_output?.annotations;

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {annotations ? (
        <Suspense fallback={<div>Loading...</div>}>
          <Canvas
            camera={{
              position: [0, 4, 4], // Zoomed out a bit more
              fov: 60,
              near: 2,
              far: 10000,
            }}
            shadows
          >
            <directionalLight
              name="directionalLight"
              position={new THREE.Vector3(...lightPositions)} // Initial position (can be adjusted)
              castShadow
              intensity={1}
            />
            <ambientLight intensity={1} position={[0, 0, 0]} />
            <Floor />
            <Scene
              annotations={annotations}
              lightPositions={new THREE.Vector3(...lightPositions)}
            />
            <OrbitControls target={[0, 0, 0]} />
            <axesHelper args={[2]} />
          </Canvas>
        </Suspense>
      ) : (
        <Typography
          variant="h6"
          style={{
            color: "white",
            padding: "2rem",
          }}
        >
          No image found. Please upload a 3D model.
        </Typography>
      )}
    </div>
  );
};

export default Visualizer1;
