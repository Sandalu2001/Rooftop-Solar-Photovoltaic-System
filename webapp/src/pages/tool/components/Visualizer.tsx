import React, { Suspense, useEffect } from "react";
import { Html, OrbitControls, useProgress } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { Box3, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function Loader() {
  const { progress } = useProgress();
  console.log(progress);
  return <Html center>{progress} % loaded</Html>;
}

const Model = ({ url }: { url: string }) => {
  const gltf = useLoader(GLTFLoader, url);

  useEffect(() => {
    const box = new Box3().setFromObject(gltf.scene);
    const center = new Vector3();
    box.getCenter(center);
    gltf.scene.position.sub(center); // Center the model at [0, 0, 0]

    const size = new Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);

    // Adjust the camera distance dynamically
    const cameraDistance = maxDim * 2;
    gltf.scene.userData.cameraDistance = cameraDistance;
  }, [gltf]);

  return <primitive object={gltf.scene} />;
};

const Visualizer: React.FC = () => {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "red" }}>
      <Suspense fallback={<Loader />}>
        <Canvas
          camera={{
            position: [0, 50, 150], // Zoomed out a bit more
            fov: 60,
            near: 0.2,
            far: 10000,
          }}
        >
          <directionalLight position={[10, 10, 10]} castShadow intensity={1} />
          <Model url="/3d_model.glb" />
          <ambientLight intensity={0.5} />
          <mesh
            receiveShadow
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -10, 0]}
          ></mesh>
          <OrbitControls
            target={[0, 0, 0]} // Ensure it's rotating around the center
            minDistance={1000} // Prevent zooming too close
            maxDistance={2500} // Prevent zooming too far
          />
          <axesHelper args={[5]} />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default Visualizer;
