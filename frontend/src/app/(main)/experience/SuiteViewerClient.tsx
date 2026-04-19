"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// Procedural Standard Airplane Seat based on reference image
function AirplaneSeat() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= delta * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1}>
        {/* Seat Cushion */}
        <mesh position={[0, -0.2, 0.2]}>
          <boxGeometry args={[1.2, 0.25, 1.2]} />
          <meshStandardMaterial color="#2d4b8e" metalness={0.1} roughness={0.9} />
        </mesh>

        {/* Backrest Cushion */}
        <mesh position={[0, 0.9, -0.5]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[1.2, 2.0, 0.2]} />
          <meshStandardMaterial color="#2d4b8e" metalness={0.1} roughness={0.9} />
        </mesh>

        {/* Headrest Main */}
        <mesh position={[0, 2.05, -0.6]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[1.2, 0.4, 0.25]} />
          <meshStandardMaterial color="#2d4b8e" metalness={0.1} roughness={0.9} />
        </mesh>

        {/* Headrest White Triangle Patch */}
        <mesh position={[0, 2.05, -0.45]} rotation={[0.1, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.1, 0.3, 3]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.1} roughness={0.8} />
        </mesh>
        
        {/* Left Armrest Base */}
        <mesh position={[-0.7, 0.2, 0]}>
          <boxGeometry args={[0.15, 0.6, 1.0]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.4} roughness={0.6} />
        </mesh>

        {/* Left Armrest Pad */}
        <mesh position={[-0.7, 0.55, 0]}>
          <boxGeometry args={[0.16, 0.05, 1.0]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.2} roughness={0.8} />
        </mesh>

        {/* Right Armrest Base */}
        <mesh position={[0.7, 0.2, 0]}>
          <boxGeometry args={[0.15, 0.6, 1.0]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.4} roughness={0.6} />
        </mesh>

        {/* Right Armrest Pad */}
        <mesh position={[0.7, 0.55, 0]}>
          <boxGeometry args={[0.16, 0.05, 1.0]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.2} roughness={0.8} />
        </mesh>

        {/* Seatbelt Left */}
        <mesh position={[-0.3, -0.05, 0.2]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.6, 0.05, 0.1]} />
          <meshStandardMaterial color="#cc0000" metalness={0.1} roughness={0.8} />
        </mesh>

        {/* Seatbelt Right */}
        <mesh position={[0.3, -0.05, 0.2]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.6, 0.05, 0.1]} />
          <meshStandardMaterial color="#cc0000" metalness={0.1} roughness={0.8} />
        </mesh>

        {/* Seatbelt Buckle */}
        <mesh position={[0, -0.05, 0.22]}>
          <boxGeometry args={[0.15, 0.08, 0.15]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Legs / Frame */}
        <mesh position={[-0.5, -0.8, -0.2]}>
          <boxGeometry args={[0.05, 1.0, 0.05]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0.5, -0.8, -0.2]}>
          <boxGeometry args={[0.05, 1.0, 0.05]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
        </mesh>
        
        {/* Foot support bar */}
        <mesh position={[0, -1.2, 0]}>
          <boxGeometry args={[1.0, 0.05, 0.05]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[-0.5, -1.0, -0.1]} rotation={[-0.5, 0, 0]}>
          <boxGeometry args={[0.05, 0.5, 0.05]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0.5, -1.0, -0.1]} rotation={[-0.5, 0, 0]}>
          <boxGeometry args={[0.05, 0.5, 0.05]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
        </mesh>
      </Float>
    </group>
  );
}

export default function SuiteViewerClient() {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [5, 3, 6], fov: 45 }}>
        {/* Premium Studio Lighting (Internal, no external fetches) */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <directionalLight position={[-10, 5, -5]} intensity={0.5} />
        <pointLight position={[-3, 2, -1]} intensity={1} color="#00d4ff" />
        
        {/* The Procedural 3D Object with Suspense to prevent crashing */}
        <React.Suspense fallback={null}>
           <AirplaneSeat />
           {/* Soft shadow underneath */}
           <ContactShadows position={[0, -1.8, 0]} opacity={0.6} scale={12} blur={2.5} far={4} color="#000000" />
        </React.Suspense>

        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={4}
          maxDistance={15}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
