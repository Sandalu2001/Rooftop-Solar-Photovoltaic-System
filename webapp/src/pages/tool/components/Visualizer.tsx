import React, { Suspense, useEffect } from "react";
import { Html, OrbitControls, useProgress } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import {
  Box3,
  MeshBasicMaterial,
  MeshNormalMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  Vector3,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Lights from "./Lights";
import * as THREE from "three";
import Polyhedron from "./Polyheron";
import { object } from "yup";
import shadows from "@mui/material/styles/shadows";
import { type } from "os";

function Loader() {
  const { progress } = useProgress();
  console.log(progress);
  return <Html center>{progress} % loaded</Html>;
}

function Floor() {
  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <circleGeometry args={[10]} />
      <meshStandardMaterial color="#aaa" /> {/* Light gray ground */}
    </mesh>
  );
}

const Model = ({ url }: { url: string }) => {
  const gltf = useLoader(GLTFLoader, url);

  // useEffect(() => {
  //   const box = new Box3().setFromObject(gltf.scene);
  //   const center = new Vector3();
  //   box.getCenter(center);
  //   // gltf.scene.position.sub(center); // Center the model at [0, 0, 0]
  //   // const size = new Vector3();
  //   // box.getSize(size);
  //   // const minY = box.min.z;
  //   // gltf.scene.position.z = minY;
  //   // // Adjust the camera distance dynamically
  //   // const cameraDistance = maxDim * 2;
  //   // gltf.scene.userData.cameraDistance = cameraDistance;
  // }, [gltf]);

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true; // Enable shadow casting for each mesh
        child.receiveShadow = true; // Enable shadow receiving (optional)
      }
    });
  }, [gltf]);

  return (
    <primitive
      object={gltf.scene}
      castShadow
      receiveShadow
      scale={[0.002, 0.002, 0.002]}
    />
  );
};

const Visualizer: React.FC = () => {
  return (
    <div style={{ width: "100%", height: "100vh", background: "red" }}>
      <Suspense fallback={<Loader />}>
        <Canvas
          camera={{
            position: [4, 4, 1.5], // Zoomed out a bit more
            fov: 60,
            near: 0.2,
            far: 10000,
          }}
          shadows={{ type: THREE.PCFSoftShadowMap }}
        >
          <Lights />
          <Polyhedron
            name="meshNormalMaterial"
            position={[2.3, 1, 3]}
            material={new THREE.MeshNormalMaterial({ flatShading: true })}
          />
          <Polyhedron
            name="meshPhongMaterial"
            position={[0, 2, 0]}
            material={
              new THREE.MeshPhongMaterial({ color: "lime", flatShading: true })
            }
          />
          <Polyhedron
            name="meshStandardMaterial"
            position={[1, 0, 0]}
            material={
              new THREE.MeshStandardMaterial({
                color: 0xff0033,
                flatShading: true,
              })
            }
          />
          <Model url="/tree_1.glb" />
          <Model url="/3d_model.glb" />
          <OrbitControls target={[0, 0, 0]} />
          <axesHelper args={[100]} />
          <Floor />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default Visualizer;
