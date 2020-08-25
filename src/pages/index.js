import React, { Suspense } from "react"
import { Canvas } from "react-three-fiber"
import { Stars } from "drei"
import { Physics } from 'use-cannon';

import { Floor } from '../entities/floor';
import { Player } from '../entities/player';
import { Camera } from '../entities/camera';

import { EffectComposer, Noise } from 'react-postprocessing'

import "./style.css"

export default () => {
  return (
    <>
      <Canvas
        shadowMap camera={{ position: [0, 1, 2.5], fov: 50 }}
      >
        <hemisphereLight intensity={0.35} />
        <spotLight
          castShadow
          shadow-mapSize-width={256}
          shadow-mapSize-height={256}
          position={[5, 5, 5]}
          angle={0.3}
        />
        <Suspense fallback={null}>
          <Physics
            iterations={20}
            tolerance={0.0001}
            allowSleep={false}
            gravity={[0, -1, 0]}
            defaultContactMaterial={{
              friction: 0.9,
              restitution: 0.7,
              contactEquationStiffness: 1e7,
              contactEquationRelaxation: 1,
              frictionEquationStiffness: 1e7,
              frictionEquationRelaxation: 2,
            }}
          >
            <Stars />
            <Floor rotation={[-Math.PI / 2, 0, 0]} />
            <Player follow />
          </Physics>
        </Suspense>
        <EffectComposer>
          <Noise opacity={0.02} />
        </EffectComposer>
      </Canvas>
    </>
  )
}
