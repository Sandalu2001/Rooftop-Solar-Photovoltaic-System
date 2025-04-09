import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const AnimatedLight = () => {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const { clock } = useThree();

  useFrame(() => {
    if (directionalLightRef.current) {
      const time = clock.getElapsedTime();
      const radius = 2; // Radius of the sun's orbit (adjust as needed)
      const speed = 0.2; // Speed of the sun's movement (adjust as needed)
      const height = 1; // Height of the sun's orbit (adjust as needed)
      directionalLightRef.current.position.x = Math.cos(time * speed) * radius;
      directionalLightRef.current.position.z = Math.sin(time * speed) * radius;
      directionalLightRef.current.position.y = height; // Keep sun at a reasonable height, adjust for sun angle
    }
  });

  return (
    <>
      <directionalLight
        name="directionalLight"
        ref={directionalLightRef}
        position={[3.3, 1.0, 4.4]} // Initial position (can be adjusted)
        castShadow={true}
        intensity={10}
      />
      <ambientLight intensity={1} position={[0, 0, 0]} />
    </>
  );
};

export default AnimatedLight;
