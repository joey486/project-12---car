import * as THREE from 'three';
import { asphaltMaterial, sidewalkMaterial } from '../materials.js';
import { SIDEWALK_WIDTH, ROAD_HEIGHT } from './constants.js';

export function createRoadSegment(width, length, x = 0, z = 0, rotationY = 0) {
  const roadGroup = new THREE.Group();
  const road = new THREE.Mesh(
    new THREE.BoxGeometry(width, ROAD_HEIGHT, length),
    asphaltMaterial
  );
  road.position.y = -0.95;
  road.castShadow = true;
  road.receiveShadow = true;
  roadGroup.add(road);

  const sidewalkGeometry = new THREE.BoxGeometry(SIDEWALK_WIDTH, ROAD_HEIGHT + 0.1, length);

  const left = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
  left.position.set(-width / 2 - SIDEWALK_WIDTH / 2, -0.85, 0);
  roadGroup.add(left);

  const right = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
  right.position.set(width / 2 + SIDEWALK_WIDTH / 2, -0.85, 0);
  roadGroup.add(right);

  roadGroup.position.set(x, 0, z);
  roadGroup.rotation.y = rotationY;

  return roadGroup;
}
