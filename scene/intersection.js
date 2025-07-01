import * as THREE from 'three';
import { asphaltMaterial, sidewalkMaterial } from '../materials.js';
import { SIDEWALK_WIDTH, ROAD_HEIGHT } from './constants.js';

export function createIntersection(size, x = 0, z = 0) {
  const group = new THREE.Group();

  const intersection = new THREE.Mesh(
    new THREE.BoxGeometry(size, ROAD_HEIGHT, size),
    asphaltMaterial
  );
  intersection.position.y = -0.95;
  intersection.castShadow = true;
  intersection.receiveShadow = true;
  group.add(intersection);

  const cornerGeometry = new THREE.BoxGeometry(SIDEWALK_WIDTH, ROAD_HEIGHT + 0.1, SIDEWALK_WIDTH);
  const positions = [
    [-size/2 - SIDEWALK_WIDTH/2, -size/2 - SIDEWALK_WIDTH/2],
    [ size/2 + SIDEWALK_WIDTH/2, -size/2 - SIDEWALK_WIDTH/2],
    [-size/2 - SIDEWALK_WIDTH/2,  size/2 + SIDEWALK_WIDTH/2],
    [ size/2 + SIDEWALK_WIDTH/2,  size/2 + SIDEWALK_WIDTH/2],
  ];

  for (const [cx, cz] of positions) {
    const corner = new THREE.Mesh(cornerGeometry, sidewalkMaterial);
    corner.position.set(cx, -0.85, cz);
    group.add(corner);
  }

  group.position.set(x, 0, z);
  return group;
}
