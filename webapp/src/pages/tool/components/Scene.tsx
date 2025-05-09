import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useAppDispatch, useAppSelector } from "../../../slices/store";
import { alpha, Grid, Slider, Stack, Typography } from "@mui/material";
import { calculateCentroid, getGradientColor } from "../../../utils/utils";

import {
  updateBuildingArea,
  setSelectedBuildingArea,
} from "../../../slices/solar-slice";
import DataTable from "./Table";
import BasicInfo from "./BasicInfo";
var SunCalc = require("suncalc");

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
  objectId,
  isSelected,
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
  objectId: number;
  isSelected: String;
}) => {
  const dispatch = useAppDispatch();

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

    // Ensure shape is closed
    if (
      points.length > 1 &&
      (points[0][0] !== points[points.length - 1][0] ||
        points[0][1] !== points[points.length - 1][1])
    ) {
      points.push([...points[0]]);
    }
    if (points.length < 3) {
      console.warn(
        `Insufficient points in segmentation for object ${objectId}`
      );
      return [];
    }
    return points;
  }, [segmentation, objectId]);

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
  const canopyHeight = (height * treeCanopyHeightFactor) / SCALE_FACTOR;

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

  const rooftopAreaRef = useRef<number>(0);
  const { scene } = useThree();

  function getShapeArea(shape: THREE.Shape): number {
    const points = shape.getPoints(); // Returns an array of Vector2

    let area = 0;
    const n = points.length;

    for (let i = 0; i < n; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % n];

      area += p1.x * p2.y - p2.x * p1.y;
    }

    return Math.abs(area / 2);
  }

  useEffect(() => {
    if (topGeometry) {
      // Use topGeometry here
      let topFaceArea = 0;

      // Iterate through faces of topGeometry (ShapeGeometry is triangles)
      for (let i = 0; i < topGeometry.index!.count / 3; i++) {
        const faceIndex = i;
        const face = {
          a: topGeometry.index!.getX(faceIndex * 3),
          b: topGeometry.index!.getX(faceIndex * 3 + 1),
          c: topGeometry.index!.getX(faceIndex * 3 + 2),
        };

        const vA = new THREE.Vector3().fromBufferAttribute(
          topGeometry.attributes.position,
          face.a
        );
        const vB = new THREE.Vector3().fromBufferAttribute(
          topGeometry.attributes.position,
          face.b
        );
        const vC = new THREE.Vector3().fromBufferAttribute(
          topGeometry.attributes.position,
          face.c
        );

        const faceArea = new THREE.Triangle(vA, vB, vC).getArea();
        topFaceArea += faceArea;
      }

      rooftopAreaRef.current = topFaceArea * SCALE_FACTOR * SCALE_FACTOR; // Store in ref

      dispatch(
        updateBuildingArea({
          objectId: objectId,
          totalRooftopArea: rooftopAreaRef.current,
          sunLitPrecentage: sunlitAreaRef.current,
        })
      );

      console.log(
        `Object ID: ${objectId}, Total Rooftop Area:`,
        rooftopAreaRef.current,
        " square meters (approx"
      ); // Log total area

      const rooftopArea = getShapeArea(shape) * SCALE_FACTOR * SCALE_FACTOR;
      console.log("Rooftop area:", rooftopArea, "square meters");
    }
  }, [topGeometry, categoryId]); // Recalculate when topGeometry or categoryId changes

  //-----------------------------------Shadow Simulation-----------------------//

  const meshRef = useRef<THREE.Group>(null);
  const sunlitAreaRef = useRef<number>(0);

  useEffect(() => {
    if (!meshRef.current || !meshRef.current?.parent) {
      console.log("Mesh parent not found");
      return;
    }

    const raycaster = new THREE.Raycaster();
    const rayDirection = new THREE.Vector3();
    let totalArea = 0; // Total area of the rooftop shape
    let sunlitArea = 0; // Area exposed to the sun
    let shadowedArea = 0; // Area covered by shadow

    // Iterate through all meshes inside meshRef
    meshRef.current.children.forEach((child) => {
      const mesh = child as THREE.Mesh;
      const geometry = mesh.geometry;
      const positionAttribute = geometry.attributes.position;
      const numVertices = positionAttribute.count;

      const shadowIntensities: number[] = [];
      const isShadowedArray: boolean[] = [];

      geometry.computeVertexNormals();

      for (let i = 0; i < numVertices; i++) {
        const vertex = new THREE.Vector3().fromBufferAttribute(
          positionAttribute,
          i
        );
        mesh.localToWorld(vertex); // Transform the vertex to world space
        rayDirection.subVectors(lightPositions, vertex).normalize(); // Calculate ray direction from vertex to light source
        raycaster.set(vertex, rayDirection);

        const intersectTargets: THREE.Object3D[] = [];
        scene.traverse((obj) => {
          if (obj instanceof THREE.Mesh && obj !== mesh) {
            intersectTargets.push(obj);
          }
        });

        const intersects = raycaster.intersectObjects(intersectTargets, true);

        const occluded =
          intersects.length > 0 &&
          intersects[0].object !== mesh &&
          intersects[0].distance < vertex.distanceTo(lightPositions);

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

        // Accumulate shadowed area based on intensity
        if (isShadowed) {
          shadowedArea += 1; // Shadowed vertex
        } else {
          sunlitArea += 1; // Sunlit vertex
        }
      }

      // Calculate the total area of the rooftop
      totalArea = getShapeArea(shape);

      // Now calculate the sunlit and shadowed areas based on shadowed and sunlit vertices
      const sunlitPercentage = (sunlitArea / (sunlitArea + shadowedArea)) * 100;
      sunlitAreaRef.current = sunlitPercentage;

      dispatch(
        updateBuildingArea({
          objectId: objectId,
          totalRooftopArea: rooftopAreaRef.current,
          sunLitPrecentage: sunlitAreaRef.current,
        })
      );

      if (isSelected == "true") {
        dispatch(
          setSelectedBuildingArea({
            objectId: objectId,
            totalRooftopArea: rooftopAreaRef.current,
            sunLitPrecentage: sunlitAreaRef.current,
          })
        );
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
  }, [lightPositions]);

  return (
    <group
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[-2.3, 0, -1.6]}
      scale={[1, -1, 1]}
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
            <meshStandardMaterial color={"lime"} side={THREE.DoubleSide} />
          </mesh>
        </>
      ) : (
        <>
          <mesh geometry={basedGeometry} castShadow receiveShadow>
            <meshStandardMaterial
              color={isSelected == "false" ? "yellow" : "purple"}
              side={THREE.DoubleSide}
            />
          </mesh>

          <mesh
            geometry={topGeometry}
            castShadow
            receiveShadow
            position={[0, 0, height / SCALE_FACTOR + 0.01]}
          >
            <meshStandardMaterial vertexColors={true} side={THREE.DoubleSide} />{" "}
          </mesh>
        </>
      )}
    </group>
  );
};

function Floor({ imageUrl }: { imageUrl: string | null }) {
  const texture = useLoader(THREE.TextureLoader, imageUrl || "");
  const coco3DJSON = useAppSelector((state) => state.solar.coco3DJSON);
  const imageData = coco3DJSON?.coco_output?.images[0];

  // Default dimensions if imageData is not available
  const planeWidth = imageData ? imageData.width / SCALE_FACTOR : 10;
  const planeHeight = imageData ? imageData.height / SCALE_FACTOR : 10;

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]} receiveShadow>
      {" "}
      {/* Lowered slightly */}
      <planeGeometry args={[planeWidth, planeHeight]} />
      <meshStandardMaterial
        map={texture}
        color="#ffffff"
        side={THREE.DoubleSide}
      />
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
              objectId={item.id}
              isSelected={item.selectedBuilding}
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
  const [lightPositions, setLightPositions] = React.useState([25, 100, 45]);
  const image = useAppSelector((state) => state.solar.image);
  const [imageURL, setImageURL] = useState<string | null>(null);
  // Check if coco3DJSON and coco_output arTHREE.e defined before accessing annotations
  const annotations = coco3DJSON?.coco_output?.annotations;

  // Load image into the annotator
  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageURL(e.target?.result as string);
      };
      reader.readAsDataURL(image);
    } else {
      setImageURL(null);
    }
  }, [image]);

  const getSunPositionVector = (
    date: Date,
    latitude: number,
    longitude: number,
    radius = 100 // distance of the light source
  ): [number, number, number] => {
    const sunPos = SunCalc.getPosition(date, latitude, longitude);

    const azimuth = sunPos.azimuth; // Radians from south (-π to π)
    const altitude = sunPos.altitude; // Radians from horizon

    // Convert spherical coordinates to cartesian for Three.js
    const x = radius * Math.cos(altitude) * Math.sin(azimuth);
    const y = radius * Math.sin(altitude);
    const z = radius * Math.cos(altitude) * Math.cos(azimuth);

    return [x, y, z];
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        justifyItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          width: "100%",
          height: "70vh",
          marginTop: 20,
        }}
      >
        <div
          style={{
            height: "100%",
            flex: 4,
            borderRadius: 15,
            border: "1px solid #ccc",
            background: "#8ACCD5",
          }}
        >
          {annotations ? (
            <Suspense fallback={<div>Loading...</div>}>
              <Canvas
                camera={{
                  position: [0, 4, 4],
                  fov: 60,
                  near: 2,
                  far: 10000,
                }}
                shadows
              >
                <directionalLight
                  name="directionalLight"
                  position={
                    new THREE.Vector3(
                      lightPositions[0],
                      lightPositions[1],
                      lightPositions[2]
                    )
                  }
                  castShadow
                  intensity={10}
                />
                <ambientLight intensity={0.7} position={[0, 0, 0]} />
                <mesh
                  position={
                    new THREE.Vector3(
                      lightPositions[0] / 25,
                      lightPositions[1] / 25,
                      lightPositions[2] / 25
                    )
                  }
                  castShadow={false}
                  receiveShadow={false}
                >
                  <sphereGeometry args={[0.2, 32, 32]} />
                  <meshBasicMaterial color="yellow" />
                </mesh>
                <Floor imageUrl={imageURL} />

                <Scene
                  annotations={annotations}
                  lightPositions={
                    new THREE.Vector3(
                      lightPositions[0],
                      lightPositions[1],
                      lightPositions[2]
                    )
                  }
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
          <Slider
            aria-label="Small steps"
            onChange={(event, value) => {
              const hour = value as number;

              const date = new Date("2025-04-16");
              date.setHours(hour, 0, 0);

              const latitude = 7.8731;
              const longitude = 80.7718;

              const sunVec = getSunPositionVector(date, latitude, longitude);
              setLightPositions(sunVec);
            }}
            step={1}
            marks={[
              { value: 0, label: "0h" },
              { value: 6, label: "6h" },
              { value: 12, label: "12h" },
              { value: 18, label: "18h" },
              { value: 24, label: "24h" },
            ]}
            min={0}
            max={24}
            valueLabelDisplay="auto"
          />
        </div>
        <BasicInfo />
      </div>
      <DataTable />
    </div>
  );
};

export default Visualizer1;
