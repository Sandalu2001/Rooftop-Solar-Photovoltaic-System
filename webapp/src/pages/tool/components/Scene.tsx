import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useAppSelector } from "../../../slices/store";
import { alpha, Grid, Slider, Stack, Typography } from "@mui/material";
import { calculateCentroid, getGradientColor } from "../../../utils/utils";
import FactCard from "../../../components/common/FactCard";
import CustomFormField from "../../../components/common/CustomFormField";
import dayjs from "dayjs";
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

  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useThree();

  console.log("Light Position ", lightPositions);

  useEffect(() => {
    if (!meshRef.current || !meshRef.current?.parent) {
      console.log("Mesh parent not found");
      return;
    }
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
        rayDirection.subVectors(lightPositions, vertex).normalize();
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
        </>
      )}
    </group>
  );
};

function Floor({ imageUrl }: { imageUrl: string | null }) {
  const texture = useLoader(THREE.TextureLoader, imageUrl || "");
  const coco3DJSON = useAppSelector((state) => state.solar.coco3DJSON);
  const imageData = coco3DJSON?.coco_output?.images[0];

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[imageData.width / 500, imageData.height / 500]} />
      <meshStandardMaterial map={texture} color="#fff" />
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        height: "70vh",
        marginTop: 20,
      }}
    >
      <div
        style={{
          height: "100%",
          flex: 4,
          background: "#0F6A58",
          borderRadius: 30,
        }}
      >
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
                position={new THREE.Vector3(...lightPositions)}
                castShadow
                intensity={10}
              />
              <ambientLight intensity={0.7} position={[0, 0, 0]} />
              <Floor imageUrl={imageURL} />

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
        <Slider
          aria-label="Small steps"
          onChange={(event, value) => {
            const hour = value as number;

            const date = new Date();
            date.setHours(hour, 0, 0);

            const latitude = 6.938861;
            const longitude = 79.854201;

            const sunVec = getSunPositionVector(date, latitude, longitude);
            setLightPositions(sunVec);
          }}
          step={1}
          marks
          min={0}
          max={24}
          valueLabelDisplay="auto"
        />
      </div>

      <div style={{ flex: 1, height: "100%" }}>
        <Stack
          flex={1}
          sx={{
            gap: 2,
            maxWidth: 400,
            p: 2,
            borderRadius: 5,
            background: (theme) => alpha(theme.palette.primary.main, 0.1),
            height: "100%",
          }}
        >
          <Stack sx={{ gap: 1 }}>
            <Typography
              variant="h5"
              color={"GrayText"}
              sx={{ fontWeight: 600 }}
            >
              Basic Info
            </Typography>
            <Grid
              container
              spacing={2}
              sx={{
                background: (theme) => alpha(theme.palette.primary.main, 0.1),
                p: 2,
                borderRadius: 4,
              }}
            >
              <CustomFormField
                name={"latitude"}
                label={"Latitude"}
                onChange={() => {}}
                value={343434.34}
                type={"text"}
                disabled
              />
              <CustomFormField
                name={"longtitude"}
                label={"Lontitude"}
                onChange={() => {}}
                value={343434.34}
                type={"text"}
                disabled
              />
              <CustomFormField
                name={"Date"}
                label={"Date"}
                onChange={() => {}}
                value={dayjs().format("YYYY-MM-DD")}
                type={"text"}
                disabled
              />
            </Grid>
          </Stack>
        </Stack>
      </div>
    </div>
  );
};

export default Visualizer1;
