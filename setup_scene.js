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
export const ROAD_WIDTH = 8;
export const ROAD_RADIUS = 20;
export const LANE_WIDTH = ROAD_WIDTH / 2;
const SIDEWALK_WIDTH = 2;
export const ROAD_HEIGHT = 0.05;

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
export function createRoadSegment(width, length, x = 0, z = 0, rotationY = 0) {
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

export function createIntersection(size, x = 0, z = 0) {
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

export function createCurvedRoad(radius, startAngle, endAngle, x = 0, z = 0) {
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

        const segmentLength = Math.sqrt((x2-x1)**2 + (z2-z1)**2) * 2; // The * 2 is for smoothening the curve
        const segmentAngle = Math.atan2(x2-x1 , z2-z1 );
        
        const segment = createRoadSegment(ROAD_WIDTH, segmentLength, 
            (x1 + x2) / 2, (z1 + z2) / 2, segmentAngle);
        curveGroup.add(segment);
    }
    
    curveGroup.position.set(x, 0, z);
    return curveGroup;
}

export function addRoadMarkings(startX, startZ, endX, endZ, isDashed = false, isYellow = false) {
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