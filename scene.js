import { scene } from "./main.js";
import {createRoadSegment, ROAD_WIDTH, createCurvedRoad, createIntersection, addRoadMarkings} from "./setup_scene.js"

// Build the road network
const roadNetwork = new THREE.Group();

// Main straight roads
const mainRoad1 = createRoadSegment(ROAD_WIDTH, 100, 0, 0, 0);
const mainRoad2 = createRoadSegment(ROAD_WIDTH, 100, 0, 0, Math.PI/2);
roadNetwork.add(mainRoad1, mainRoad2);

// Secondary roads
const secondaryRoad1 = createRoadSegment(ROAD_WIDTH, 50, 40, 0, 0);
const secondaryRoad2 = createRoadSegment(ROAD_WIDTH, 50, -40, 0, 0);
const secondaryRoad3 = createRoadSegment(ROAD_WIDTH, 50, 0, 40, Math.PI/2);
const secondaryRoad4 = createRoadSegment(ROAD_WIDTH, 50, 0, -40, Math.PI/2);
roadNetwork.add(secondaryRoad1, secondaryRoad2, secondaryRoad3, secondaryRoad4);

// Intersections
const mainIntersection = createIntersection(16, 0, 0);
const intersection1 = createIntersection(12, 40, 0);
const intersection2 = createIntersection(12, -40, 0);
const intersection3 = createIntersection(12, 0, 40);
const intersection4 = createIntersection(12, 0, -40);
roadNetwork.add(mainIntersection, intersection1, intersection2, intersection3, intersection4);

// Curved roads for smoother connections
const curve1 = createCurvedRoad(20, 0, Math.PI/2, 20, 20);
const curve2 = createCurvedRoad(20, Math.PI/2, Math.PI, -20, 20);
const curve3 = createCurvedRoad(20, Math.PI, 3*Math.PI/2, -20, -20);
const curve4 = createCurvedRoad(20, 3*Math.PI/2, 2*Math.PI, 20, -20);
roadNetwork.add(curve1, curve2, curve3, curve4);

scene.add(roadNetwork);

// Add road markings
// Center lines for main roads
addRoadMarkings(-50, 0, 50, 0, true, true); // Main horizontal road center line
addRoadMarkings(0, -50, 0, 50, true, true); // Main vertical road center line

// Lane dividers for secondary roads
addRoadMarkings(10, 0, 70, 0, true); // Secondary road 1
addRoadMarkings(-10, 0, -70, 0, true); // Secondary road 2
addRoadMarkings(0, 10, 0, 70, true); // Secondary road 3
addRoadMarkings(0, -10, 0, -70, true); // Secondary road 4

// Edge lines
addRoadMarkings(-50, 4, 50, 4, false); // Top edge of main horizontal road
addRoadMarkings(-50, -4, 50, -4, false); // Bottom edge of main horizontal road
addRoadMarkings(-4, -50, -4, 50, false); // Left edge of main vertical road
addRoadMarkings(4, -50, 4, 50, false); // Right edge of main vertical road

// Add some street elements
function addStreetLight(x, z) {
    const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 6);
    const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.set(x, 2, z);
    pole.castShadow = true;
    
    const lightGeometry = new THREE.SphereGeometry(0.5);
    const lightMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffaa,
        emissive: 0x221100 
    });
    const light = new THREE.Mesh(lightGeometry, lightMaterial);
    light.position.set(x, 5.5, z);
    
    scene.add(pole, light);
}

// Add street lights at intersections
addStreetLight(8, 8);
addStreetLight(-8, 8);
addStreetLight(8, -8);
addStreetLight(-8, -8);
addStreetLight(48, 8);
addStreetLight(48, -8);
addStreetLight(-48, 8);
addStreetLight(-48, -8);

// Add traffic signs
function addStopSign(x, z, rotation = 0) {
    const signPoleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2.5);
    const signPoleMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
    const signPole = new THREE.Mesh(signPoleGeometry, signPoleMaterial);
    signPole.position.set(x, 0.25, z);
    
    const signGeometry = new THREE.OctahedronGeometry(0.8, 0);
    const signMaterial = new THREE.MeshStandardMaterial({ color: 0xcc0000 });
    const sign = new THREE.Mesh(signGeometry, signMaterial);
    sign.position.set(x, 2, z);
    sign.rotation.z = Math.PI / 8;
    sign.rotation.y = rotation;
    
    scene.add(signPole, sign);
}

// Add stop signs at intersections
addStopSign(6, 6, Math.PI/4);
addStopSign(-6, -6, -3*Math.PI/4);
addStopSign(6, -6, -Math.PI/4);
addStopSign(-6, 6, 3*Math.PI/4);


// Secondary Road
