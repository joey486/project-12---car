import * as THREE from 'three';

export const asphaltMaterial = new THREE.MeshStandardMaterial({
  color: 0x2c2c2c,
  roughness: 0.8,
  metalness: 0.1,
});

export const lineMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: 0x111111,
});

export const yellowLineMaterial = new THREE.MeshStandardMaterial({
  color: 0xffff00,
  emissive: 0x222200,
});

export const sidewalkMaterial = new THREE.MeshStandardMaterial({
  color: 0x888888,
  roughness: 0.9,
});
