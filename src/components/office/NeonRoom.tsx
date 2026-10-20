// opencode enciende el taller
"use client"

import { useMemo, useRef } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { Grid } from "@react-three/drei"

/**
 * La sala: suelo reflectante, rejilla de neon, paredes y tiras de luz
 * que se encienden cuando el taller tiene corriente.
 */
export function NeonRoom({ powered }: { powered: boolean }) {
  const stripRefs = useRef<THREE.Mesh[]>([])
  const glowRef = useRef<THREE.Mesh>(null)
  const intensity = useRef(0)

  // La iluminacion se enciende progresivamente
  useFrame((_, delta) => {
    const target = powered ? 1 : 0
    intensity.current = THREE.MathUtils.damp(intensity.current, target, 1.6, delta)

    const v = intensity.current
    stripRefs.current.forEach((mesh) => {
      const mat = mesh?.material as THREE.MeshBasicMaterial | undefined
      if (mat) mat.opacity = 0.15 + v * 0.85
    })
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = v * 0.16
    }
  })

  const stripPositions = useMemo(
    () => [-16, -8, 0, 8, 16],
    []
  )

  return (
    <group>
      {/* Suelo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[70, 60]} />
        <meshStandardMaterial
          color="#05060e"
          roughness={0.35}
          metalness={0.75}
          envMapIntensity={0.6}
        />
      </mesh>

      {/* Rejilla de neon en el suelo */}
      <Grid
        position={[0, 0.01, 0]}
        args={[60, 50]}
        cellSize={1.6}
        cellThickness={0.6}
        cellColor="#1e3a8a"
        sectionSize={8}
        sectionThickness={1.2}
        sectionColor="#22d3ee"
        fadeDistance={45}
        fadeStrength={1.4}
        followCamera={false}
        infiniteGrid={false}
      />

      {/* Halo central en el suelo */}
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[14, 48]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Pared del fondo */}
      <mesh position={[0, 5, -13]} receiveShadow>
        <boxGeometry args={[60, 10, 0.4]} />
        <meshStandardMaterial color="#080a18" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Paredes laterales */}
      <mesh position={[-19, 5, 0]} receiveShadow>
        <boxGeometry args={[0.4, 10, 26]} />
        <meshStandardMaterial color="#080a18" roughness={0.8} metalness={0.2} />
      </mesh>
      <mesh position={[19, 5, 0]} receiveShadow>
        <boxGeometry args={[0.4, 10, 26]} />
        <meshStandardMaterial color="#080a18" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Tiras de neon horizontales en la pared del fondo */}
      {stripPositions.map((x) => (
        <mesh key={x} position={[x, 4.6, -12.7]}>
          <boxGeometry args={[5.5, 0.09, 0.09]} />
          <meshBasicMaterial
            ref={(mat) => {
              if (mat) stripRefs.current.push(mat as unknown as THREE.Mesh)
            }}
            color="#22d3ee"
            transparent
            opacity={0.15}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Tiras verticales en las paredes laterales */}
      {[-6, 0, 6].map((z) => (
        <mesh key={`l${z}`} position={[-18.7, 4.4, z]}>
          <boxGeometry args={[0.09, 7.5, 0.09]} />
          <meshBasicMaterial color="#e879f9" transparent opacity={0.3} toneMapped={false} />
        </mesh>
      ))}
      {[-6, 0, 6].map((z) => (
        <mesh key={`r${z}`} position={[18.7, 4.4, z]}>
          <boxGeometry args={[0.09, 7.5, 0.09]} />
          <meshBasicMaterial color="#e879f9" transparent opacity={0.3} toneMapped={false} />
        </mesh>
      ))}

      {/* Luces de techo */}
      {[-12, -4, 4, 12].map((x) => (
        <group key={`ceil${x}`} position={[x, 8.4, -4]}>
          <mesh>
            <boxGeometry args={[6, 0.12, 0.5]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#dbeafe"
              emissiveIntensity={powered ? 2.4 : 0.05}
              toneMapped={false}
            />
          </mesh>
          <pointLight
            position={[0, -0.6, 0]}
            intensity={powered ? 26 : 0}
            distance={16}
            decay={2}
            color="#c7d2fe"
          />
        </group>
      ))}

      {/* Escalera / gradas laterales */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`step${i}`} position={[-16.5 + i * 0.9, 0.12 + i * 0.24, 10.5]}>
          <boxGeometry args={[0.9, 0.24, 3]} />
          <meshStandardMaterial
            color="#0d1024"
            emissive="#312e81"
            emissiveIntensity={powered ? 0.5 : 0.05}
            roughness={0.6}
          />
        </mesh>
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`step-r${i}`} position={[16.5 - i * 0.9, 0.12 + i * 0.24, 10.5]}>
          <boxGeometry args={[0.9, 0.24, 3]} />
          <meshStandardMaterial
            color="#0d1024"
            emissive="#312e81"
            emissiveIntensity={powered ? 0.5 : 0.05}
            roughness={0.6}
          />
        </mesh>
      ))}
    </group>
  )
}
