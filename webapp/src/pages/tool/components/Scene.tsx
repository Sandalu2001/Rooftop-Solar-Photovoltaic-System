import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import Lights from "./Lights";
import * as THREE from "three";
import { useAppSelector } from "../../../slices/store";
import { Typography } from "@mui/material";
import shadows from "@mui/material/styles/shadows";

// Green - Y
// Blue - Z
// Red - X

const SCALE_FACTOR = 500; // Shrinking factor

//-------- Calculate Centroid Function -----------//
const calculateCentroid = (points: number[][]) => {
  let area = 0;
  let centroidX = 0;
  let centroidY = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % n]; // Next point, wrap around

    const term = p1[0] * p2[1] - p2[0] * p1[1];
    area += term;
    centroidX += (p1[0] + p2[0]) * term;
    centroidY += (p1[1] + p2[1]) * term;
  }

  area = 0.5 * area;
  centroidX = centroidX / (6 * area);
  centroidY = centroidY / (6 * area);

  return { x: centroidX, y: centroidY };
};
//---------------------------------------------//

const Object = ({
  segmentation,
  height,
  categoryId,
  treeTrunkRadiusFactor = 0.2,
  treeCanopyRadiusFactor = 0.6,
  treeCanopyHeightFactor = 0.6,
  treeTrunkHeightFactor = 0.4,
  debug = true,
}: {
  segmentation: number[][];
  height: number;
  categoryId: number;
  treeTrunkRadiusFactor?: number;
  treeCanopyRadiusFactor?: number;
  treeCanopyHeightFactor?: number;
  treeTrunkHeightFactor?: number;
  debug?: boolean;
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
    steps: 100,
  };

  const basedGeometry = useMemo(
    () => new THREE.ExtrudeGeometry(shape, baseSettings),
    [shape]
  );
  //-----------------------------------------//
  const topGeometry = useMemo(() => new THREE.ShapeGeometry(shape), [shape]);

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
    Math.min(polygonWidth, polygonDepth) * treeTrunkRadiusFactor; // Trunk radius based on smaller polygon dimension
  const trunkHeight = (height * treeTrunkHeightFactor) / SCALE_FACTOR;
  const trunkGeometry = useMemo(
    () => new THREE.CylinderGeometry(trunkRadius, trunkRadius, trunkHeight, 32),
    [trunkRadius, trunkHeight]
  );
  //--------------------------------------//

  //---------------Tree Canopy (Cone)---------------//
  const canopyRadius =
    Math.max(polygonWidth, polygonDepth) * treeCanopyRadiusFactor; // Canopy radius based on larger polygon dimension
  const canopyHeight = (height * treeCanopyHeightFactor) / SCALE_FACTOR;
  const canopyGeometry = useMemo(
    () => new THREE.ConeGeometry(canopyRadius, canopyHeight, 32),
    [canopyRadius, canopyHeight]
  );
  //-----------------------------------------//

  // Calculate Centroid
  const centroid = useMemo(() => {
    if (scaledSegmentationPoints.length < 3) return { x: 0, y: 0 }; // Centroid needs at least 3 points
    return calculateCentroid(scaledSegmentationPoints);
  }, [scaledSegmentationPoints]);

  //-----------Debug Visualizations------------//
  const polygonWireframeGeometry = useMemo(() => {
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
    return new THREE.WireframeGeometry(new THREE.ShapeGeometry(wireframeShape));
  }, [scaledSegmentationPoints]);
  //------------------------------------------//

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[-2, 0, 1.6]}>
      {categoryId === 3 ? (
        <group rotateZ={Math.PI / 2}>
          {" "}
          {/* ADD GROUP AND ROTATE Z HERE */}
          {/* Trunk */}
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
            geometry={canopyGeometry}
            position={[centroid.x, centroid.y, trunkHeight + canopyHeight / 2]}
            castShadow
            rotation={[Math.PI / 2, -2, 0]}
            receiveShadow
          >
            <meshStandardMaterial color={"lime"} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ) : (
        <>
          <mesh geometry={basedGeometry} castShadow receiveShadow>
            <meshStandardMaterial
              color={categoryId === 1 ? "yellow" : "lime"}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Top face positioned at the object's top */}
          <mesh
            geometry={topGeometry}
            position={[0, 0, height / SCALE_FACTOR]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              color={categoryId === 1 ? "yellow" : "lime"}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}

      {/* -------- DEBUG VISUALIZATIONS --------- */}
      {debug && (
        <>
          {/* Polygon Wireframe */}
          <lineSegments geometry={polygonWireframeGeometry}>
            <lineBasicMaterial color="blue" />
          </lineSegments>
        </>
      )}
      {/* ------------------------------------- */}
    </group>
  );
};

function Floor() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
      <circleGeometry args={[4]} />
      <meshStandardMaterial color="#fff" />
    </mesh>
  );
}

const Scene = ({ annotations }: { annotations: any[] }) => {
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

  // Check if coco3DJSON and coco_output are defined before accessing annotations
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
            <Lights />
            <Floor />
            <Scene annotations={annotations} />
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
