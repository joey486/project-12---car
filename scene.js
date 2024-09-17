import { scene } from "./main.js";

const textureLoader = new THREE.TextureLoader();
const skyTexture = textureLoader.load('./images/sky.jpg'); // Replace with your sky image path
scene.background = skyTexture;

// Lighting (Directional light)
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);

const sun = new THREE.DirectionalLight(0xffffff,1);
sun.position.set(50, 100, 50);
sun.castShadow = true;
scene.add(sun);

// Adding a floor (Plane Geometry - Grass)
const floorGeometry = new THREE.PlaneGeometry(800, 800);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x00FF00, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = Math.PI / 2; // Rotate to make it horizontal
floor.position.y = -1.1; // Position it below the model
scene.add(floor);

// Adding a road (Plane Geometry)
const roadGeometry = new THREE.PlaneGeometry(10, 800);
const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, side: THREE.DoubleSide });
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = Math.PI / 2; // Rotate to make it horizontal
road.position.y = -1; // Slightly above the grass
scene.add(road);

// Function to add dashed stripe in the middle of the road
function addDashedStripe() {
    const stripeLength = 2;  // Length of each dash
    const stripeSpacing = 1.5; // Spacing between dashes
    const stripeWidth = 0.3;  // Width of the stripe
    const numberOfStripes = 300; // Adjust based on road length

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
