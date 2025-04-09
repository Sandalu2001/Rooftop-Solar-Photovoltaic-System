import React, { memo, Suspense, useEffect, useState } from "react";
import { Html, OrbitControls, useProgress } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Lights from "./Lights";
import * as THREE from "three";
import Polyhedron from "./Polyheron";
import { useAppSelector } from "../../../slices/store";
import { Typography } from "@mui/material";
import { StepperInterface } from "../../../types/componentInterfaces";
import { log } from "console";
import { object } from "yup";
import { url } from "inspector";

function Loader() {
  const { progress } = useProgress();
  console.log(progress);
  return <Html center>{progress} % loaded</Html>;
}

function Floor() {
  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <circleGeometry args={[10]} />
      <meshStandardMaterial color="#aaa" />
    </mesh>
  );
}

const ModelComponent = ({ url }: { url: string }) => {
  // Rename to ModelComponent temporarily
  const gltf = useLoader(GLTFLoader, url);

  console.log("Model Component Rendered - URL:", url); // Add log to track renders

  return (
    <primitive
      object={gltf.scene}
      castShadow
      receiveShadow
      scale={[0.002, 0.002, 0.002]}
    />
  );
};

const Model = memo(ModelComponent, (prevProps, nextProps) => {
  return prevProps.url === nextProps.url; // Memoize based on url prop
});

const Visualizer = ({ setActiveStep }: StepperInterface) => {
  const image = useAppSelector((state) => state.solar.Image3D);
  const [imageURL, setImageURL] = useState<string | null>(null);

  // Load image into the annotator
  useEffect(() => {
    console.log("Visualizer useEffect - Image from Redux:", image); // Log image from Redux

    if (image instanceof File) {
      const newURL = URL.createObjectURL(image);
      console.log("Creating new imageURL:", newURL); // Log when new URL is created

      setImageURL(newURL);

      return () => {
        URL.revokeObjectURL(newURL);
      };
    } else if (typeof image === "string") {
      setImageURL(image);
    } else {
      setImageURL(null);
    }
  }, [image]);

  return (
    <div style={{ width: "100%", height: "100vh", background: "red" }}>
      {imageURL ? (
        <Suspense fallback={<Loader />}>
          <Canvas
            camera={{
              position: [4, 4, 1.5],
              fov: 60,
              near: 0.2,
              far: 10000,
            }}
            shadows={{ type: THREE.PCFSoftShadowMap }}
          >
            <Model url={imageURL} />
            <OrbitControls target={[0, 0, 0]} />
            <OrbitControls target={[0, 0, 0]} />
            <axesHelper args={[100]} />
            <Floor />
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

export default Visualizer;
