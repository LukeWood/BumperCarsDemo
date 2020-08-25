import React from 'react';
import { usePlane } from 'use-cannon';

export function Floor(props) {
  const [ref] = usePlane(() => ({ mass: 0, material:{friction: 0.9, restitution: 0}, ...props }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[10, 10]} />
      <meshLambertMaterial attach="material" color="#0AAAAA" />
    </mesh>
  )
}
