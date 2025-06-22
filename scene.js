import { scene } from "./main.js";

// Set the sky background
const textureLoader = new THREE.TextureLoader();
const skyTexture = textureLoader.load('./images/sky.jpg');
scene.background = skyTexture;

// Add lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
scene.add(ambientLight);

const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(50, 100, 50);
sun.castShadow = true;
sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;
sun.shadow.camera.near = 0.5;
sun.shadow.camera.far = 500;
scene.add(sun);

// Load textures for the ground
const grassTexture = textureLoader.load('./images/grass.jpeg');
const grassBumpMap = textureLoader.load('./images/grass bump.jpeg');

const grassMaterial = new THREE.MeshStandardMaterial({
    map: grassTexture,
    bumpMap: grassBumpMap,
    bumpScale: 0.2,
    side: THREE.DoubleSide
});

// Add a large terrain floor
const floorGeometry = new THREE.PlaneGeometry(1000, 1000);
const floor = new THREE.Mesh(floorGeometry, grassMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
floor.receiveShadow = true;
scene.add(floor);

// Road system configuration
const ROAD_WIDTH = 8;
const LANE_WIDTH = ROAD_WIDTH / 2;
const SIDEWALK_WIDTH = 2;
const ROAD_HEIGHT = 0.05;

// Materials
const asphaltMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x2c2c2c,
    roughness: 0.8,
    metalness: 0.1
});

const lineMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xFFFFFF,
    emissive: 0x111111
});

const yellowLineMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xFFFF00,
    emissive: 0x222200
});

const sidewalkMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    roughness: 0.9
});

// Road construction helper functions
function createRoadSegment(width, length, x = 0, z = 0, rotationY = 0) {
    const roadGroup = new THREE.Group();
    
    // Main road surface
    const roadGeometry = new THREE.BoxGeometry(width, ROAD_HEIGHT, length);
    const road = new THREE.Mesh(roadGeometry, asphaltMaterial);
    road.position.y = -0.95;
    road.castShadow = true;
    road.receiveShadow = true;
    roadGroup.add(road);
    
    // Sidewalks
    const sidewalkGeometry = new THREE.BoxGeometry(SIDEWALK_WIDTH, ROAD_HEIGHT + 0.1, length);
    
    const leftSidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
    leftSidewalk.position.set(-width/2 - SIDEWALK_WIDTH/2, -0.85, 0);
    roadGroup.add(leftSidewalk);
    
    const rightSidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
    rightSidewalk.position.set(width/2 + SIDEWALK_WIDTH/2, -0.85, 0);
    roadGroup.add(rightSidewalk);
    
    roadGroup.position.set(x, 0, z);
    roadGroup.rotation.y = rotationY;
    
    return roadGroup;
}

function createIntersection(size, x = 0, z = 0) {
    const intersectionGroup = new THREE.Group();
    
    // Main intersection surface
    const intersectionGeometry = new THREE.BoxGeometry(size, ROAD_HEIGHT, size);
    const intersection = new THREE.Mesh(intersectionGeometry, asphaltMaterial);
    intersection.position.y = -0.95;
    intersection.castShadow = true;
    intersection.receiveShadow = true;
    intersectionGroup.add(intersection);
    
    // Corner sidewalks
    const cornerSize = SIDEWALK_WIDTH;
    const cornerGeometry = new THREE.BoxGeometry(cornerSize, ROAD_HEIGHT + 0.1, cornerSize);
    
    const corners = [
        [-size/2 - cornerSize/2, -size/2 - cornerSize/2],
        [size/2 + cornerSize/2, -size/2 - cornerSize/2],
        [-size/2 - cornerSize/2, size/2 + cornerSize/2],
        [size/2 + cornerSize/2, size/2 + cornerSize/2]
    ];
    
    corners.forEach(([x, z]) => {
        const corner = new THREE.Mesh(cornerGeometry, sidewalkMaterial);
        corner.position.set(x, -0.85, z);
        intersectionGroup.add(corner);
    });
    
    intersectionGroup.position.set(x, 0, z);
    return intersectionGroup;
}

function createCurvedRoad(radius, startAngle, endAngle, x = 0, z = 0) {
    const curveGroup = new THREE.Group();
    const segments = 40;
    const angleStep = (endAngle - startAngle) / segments ;
    
    for (let i = 0; i < segments; i++) {
        const angle1 = startAngle + i * angleStep;
        const angle2 = startAngle + (i + 1) * angleStep;
        
        const x1 = Math.cos(angle1) * radius;
        const z1 = Math.sin(angle1) * radius;
        const x2 = Math.cos(angle2) * radius;
        const z2 = Math.sin(angle2) * radius;

        const segmentLength = Math.sqrt((x2-x1)**2 + (z2-z1)**2) * 2; // The *2 is for smoothening the curve
        const segmentAngle = Math.atan2(x2-x1 , z2-z1 );
        
        const segment = createRoadSegment(ROAD_WIDTH, segmentLength, 
            (x1 + x2) / 2, (z1 + z2) / 2, segmentAngle);
        curveGroup.add(segment);
    }
    
    curveGroup.position.set(x, 0, z);
    return curveGroup;
}

function addRoadMarkings(startX, startZ, endX, endZ, isDashed = false, isYellow = false) {
    const length = Math.sqrt((endX - startX)**2 + (endZ - startZ)**2);
    const angle = Math.atan2(endZ - startZ, endX - startX);
    const material = isYellow ? yellowLineMaterial : lineMaterial;
    
    if (!isDashed) {
        // Solid line
        const lineGeometry = new THREE.BoxGeometry(length, 0.01, 0.15);
        const line = new THREE.Mesh(lineGeometry, material);
        line.position.set((startX + endX) / 2, -0.89, (startZ + endZ) / 2);
        line.rotation.y = angle;
        scene.add(line);
    } else {
        // Dashed line
        const dashLength = 3;
        const gapLength = 2;
        const totalPattern = dashLength + gapLength;
        const numDashes = Math.floor(length / totalPattern);
        
        for (let i = 0; i < numDashes; i++) {
            const dashGeometry = new THREE.BoxGeometry(dashLength, 0.01, 0.15);
            const dash = new THREE.Mesh(dashGeometry, material);
            
            const t = (i * totalPattern + dashLength/2) / length;
            const x = startX + t * (endX - startX);
            const z = startZ + t * (endZ - startZ);
            
            dash.position.set(x, -0.89, z);
            dash.rotation.y = angle;
            scene.add(dash);
        }
    }
}

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