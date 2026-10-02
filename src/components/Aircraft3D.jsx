import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

/**
 * Stylized low-poly aircraft built from primitives — no external model needed.
 * Slowly orbits + bobs. Optimized: single mesh group, no shadows on body.
 */
function Aircraft() {
  const group = useRef(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.35;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
  });

  const body = "hsl(195, 30%, 92%)";
  const accent = "hsl(187, 94%, 55%)";
  const dark = "hsl(220, 30%, 15%)";

  return (
    <group ref={group} scale={0.9}>
      {/* Fuselage */}
      <mesh castShadow>
        <capsuleGeometry args={[0.35, 2.2, 8, 16]} />
        <meshStandardMaterial color={body} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Nose cone */}
      <mesh position={[0, 1.35, 0]}>
        <coneGeometry args={[0.35, 0.5, 16]} />
        <meshStandardMaterial color={body} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Tail cone */}
      <mesh position={[0, -1.35, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.35, 0.5, 16]} />
        <meshStandardMaterial color={body} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Cockpit window */}
      <mesh position={[0, 0.85, 0.3]} rotation={[Math.PI / 2.4, 0, 0]}>
        <sphereGeometry args={[0.25, 16, 16, 0, Math.PI]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Main wings */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.2, 0.08, 0.7]} />
        <meshStandardMaterial color={body} metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Wing accent stripes */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[3.21, 0.02, 0.15]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} />
      </mesh>
      {/* Tail fin (vertical) */}
      <mesh position={[0, -1.05, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.06, 0.5, 0.6]} />
        <meshStandardMaterial color={body} metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Tail wings (horizontal) */}
      <mesh position={[0, -1.05, 0]}>
        <boxGeometry args={[1.2, 0.06, 0.35]} />
        <meshStandardMaterial color={body} metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Engines under wings */}
      {[-1.0, 1.0].map((x) => (
        <group key={x} position={[x, -0.05, -0.05]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.55, 16]} />
            <meshStandardMaterial color={dark} metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.3]}>
            <ringGeometry args={[0.08, 0.16, 16]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

const Aircraft3D = () => {
  return (
    <div className="w-full h-[260px] sm:h-[320px] relative">
      <Canvas
        camera={{ position: [3.5, 1.5, 4.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-3, 2, -2]} intensity={1.2} color="hsl(187, 94%, 55%)" />
        <pointLight position={[3, -2, 2]} intensity={0.6} color="hsl(217, 91%, 60%)" />
        <Suspense fallback={null}>
          <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
            <Aircraft />
          </Float>
          <ContactShadows position={[0, -1.6, 0]} opacity={0.35} scale={6} blur={2.5} far={2} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
      {/* HUD overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-between px-4 pb-3 text-[10px] font-mono text-primary/70 uppercase tracking-widest">
        <span>● Live · Fleet Telemetry</span>
        <span>ALT 35,000 ft</span>
      </div>
    </div>
  );
};

export default Aircraft3D;
