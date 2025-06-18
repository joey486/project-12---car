import { scene } from "./main.js";

// Set the sky background
const textureLoader = new THREE.TextureLoader();
const skyTexture = textureLoader.load('./images/sky.jpg'); // Replace with your sky image path
scene.background = skyTexture;

// Add lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);

const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(50, 100, 50);
sun.castShadow = true;
scene.add(sun);

// Load textures for the ground
const grassTexture = textureLoader.load('./images/grass.jpeg');  // Replace with your grass texture
const grassBumpMap = textureLoader.load('./images/grass bump.jpeg');  // Replace with your bump map texture
const grassTexture2 = textureLoader.load('./images/grass variation.jpeg');  // Optional second grass texture

// Add variation to the floor by mixing two textures
const grassMaterial = new THREE.MeshStandardMaterial({
    map: grassTexture,
    bumpMap: grassBumpMap,
    bumpScale: 0.2,
    side: THREE.DoubleSide
});

// Add a larger floor (Grass)
const floorGeometry = new THREE.PlaneGeometry(2000, 2000);
const floor = new THREE.Mesh(floorGeometry, grassMaterial);
floor.rotation.x = Math.PI / 2;
floor.position.y = -1.1;
scene.add(floor);


// Road settings 
const roadWidth = 5; 
const roadLength = 10; 
const segments = 10; // Number of segments to create the curve 

// Material for the road 
const roadMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x333333, // Dark grey road 
    side: THREE.DoubleSide 
}); 

// Helper function to create a straight road segment 
function createRoadSegment(width, length) { 
    const roadGeometry = new THREE.PlaneGeometry(width, length); 
    const roadMesh = new THREE.Mesh(roadGeometry, roadMaterial); 
    roadMesh.rotation.x = -Math.PI / 2; // Rotate to lay flat 
    return roadMesh; 
} 

// Add a straight road segment 
const straightRoad = createRoadSegment(roadWidth, roadLength); 
straightRoad.position.set(0, -1, 0); // Position the first segment 
scene.add(straightRoad); // Add the curved road segments 
let curveRadius = 15; // Radius of the curve 
let angleStep = Math.PI / (2 * segments); // Angle step for each segment (90 degrees curve) 

for (let i = 1; i <= segments; i++) { 
    const roadSegment = createRoadSegment(roadWidth, roadLength); // Calculate the angle for this segment 
    const angle = i * angleStep; // Position the road segment in a circular arc 
    const x = Math.cos(angle) * curveRadius; 
    const z = Math.sin(angle) * curveRadius; 
    roadSegment.position.set(x, 0, -z); // Rotate the segment to face the correct direction 
    roadSegment.rotation.z = -angle; // Add to the scene 
    scene.add(roadSegment); 
}  

// Function to add dashed stripe in the middle of the road
function addDashedStripe() {
    const stripeLength = 2;  // Length of each dash
    const stripeSpacing = 1.5; // Spacing between dashes
    const stripeWidth = 0.3;  // Width of the stripe
    const numberOfStripes = 600; // Adjust based on road length

    const stripeGeometry = new THREE.PlaneGeometry(stripeWidth, stripeLength);
    const stripeMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });

    for (let i = 0; i < numberOfStripes; i++) {
        const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        stripe.rotation.x = Math.PI / 2; // Rotate to lie flat on the road
        stripe.position.y = -0.99; // Slightly above the road
        stripe.position.z = i * (stripeLength + stripeSpacing) - (numberOfStripes / 2) * (stripeLength + stripeSpacing); // Position along the road
        scene.add(stripe);
    }
}

// Call the function to add the dashed stripe
addDashedStripe();
