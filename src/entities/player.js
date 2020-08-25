import React, { useMemo, useState, useEffect } from 'react';
import { Quaternion, Vector3 } from 'three';
import { useFrame } from 'react-three-fiber';
import { useSphere } from 'use-cannon';
import useEventListener from '@use-it/event-listener';

import niceColors from 'nice-color-palettes';

const colorSet = niceColors[6];
const IMPULSE = 5;

export function Player(props) {
  const follow = props.follow;
  // Make the ball a physics object with a low mass

  const scale = 0.2;

  const color = useMemo(() => {
    const index = Math.floor(Math.random() * (colorSet.length - 1))
    return colorSet[index];
  }, [])

  const [ref, api] = useSphere(() => ({ mass: 0.3, args: scale, angularDamping: true, position: [0, 1, 0], material: { friction: 0.1, restitution: 0.5 } }))

  useEventListener("keydown", (e) => {
    const key = (e.key || e.which).toLowerCase();
    switch (key) {
      case "w":
        movement.z = -IMPULSE;
        break;
      case "s":
        movement.z = IMPULSE;
        break;
      case "a":
        movement.x = -IMPULSE;
        break;
      case "d":
        movement.x = IMPULSE;
        break;
    }
  });

  const movement = new Vector3(0, 0, 0);

  useEventListener("keyup", (e) => {
    const key = (e.key || e.which).toLowerCase();
    switch (key) {
      case "w":
        movement.z = 0;
        break;
      case "s":
        movement.z = -0;
        break;
      case "a":
        movement.x = -0;
        break;
      case "d":
        movement.x = 0;
        break;
    }
  });

  useFrame(({ camera }) => {
    if (!ref.current) {
      return
    }
    if (!follow) {
      return;
    }
    camera.lookAt(ref.current.position);
  });

  useFrame((state) => {
    if (!ref.current) {
      return;
    }
    const current = ref.current;

    const t = state.clock.getElapsedTime();

    const rot = new Quaternion();
    rot.setFromEuler(state.camera.rotation);

    const motion = movement.clone();
    motion.applyQuaternion(rot);
    motion.y = 0;
    motion.normalize()
    motion.multiplyScalar(IMPULSE);
    motion.multiplyScalar(t / 1000);
    api.applyLocalImpulse(motion.toArray(), [0, 0, 0]);
  });

  return (
    <mesh castShadow ref={ref}>
      <sphereGeometry attach="geometry" args={[scale, 64, 64]} />
      <meshPhongMaterial attach="material" color={color} />
    </mesh>
  )
}
