// Create a scene
export const scene = new THREE.Scene();

// Set up the camera
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const coordsDisplay = document.getElementById('coords');

// WebGL Renderer
export const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Variable to store the car model
export let carModel;

// Loading the glTF/GLB 3D model (car.glb)
const loader = new THREE.GLTFLoader();
loader.load('./module/scene.gltf', function(gltf) {
    carModel = gltf.scene;

    // Position the car on the road
    carModel.position.set(0, 0, 0);

    // Rotate the car by 180 degrees along the Y axis
    carModel.rotation.y = Math.PI;

    scene.add(carModel);
}, undefined, function(error) {
    console.error(error);
});


// Set the camera position
camera.position.z = 15;
camera.position.y = 5;

// Add OrbitControls
export const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

// Adjust camera aspect ratio and renderer size on window resize
window.addEventListener('resize', function() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

function updateCoords() {
    if (!carModel) return;
    const pos = carModel.position;
    coordsDisplay.textContent = `X: ${pos.x.toFixed(2)} Y: ${pos.y.toFixed(2)} Z: ${pos.z.toFixed(2)}`;
}



// Animation loop (basic)
export function animate() {
    requestAnimationFrame(animate);
    updateCoords(); 
    controls.update(); // Required for damping to work
    renderer.render(scene, camera);
}


animate();
