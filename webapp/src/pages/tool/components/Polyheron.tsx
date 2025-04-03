import { JSX, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Polyhedron(props: JSX.IntrinsicElements["mesh"]) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += 0.2 * delta;
      ref.current.rotation.y += 0.05 * delta;
    }
  });

  return (
    <mesh {...props} ref={ref} castShadow receiveShadow>
      <icosahedronGeometry args={[1, 1]} />
    </mesh>
  );
}
