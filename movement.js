import { renderer, controls, carModel, scene, camera } from './main.js'

// Variables to store the movement direction
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let followCar = false; // Boolean to track if the camera is following the car

// Event listeners for keyboard controls
window.addEventListener('keydown', function (event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW': // Move forward
            moveForward = true;
            break;
        case 'ArrowDown':
        case 'KeyS': // Move backward
            moveBackward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA': // Move left
            moveLeft = true;
            break;
        case 'ArrowRight':
        case 'KeyD': // Move right
            moveRight = true;
            break;
    }
});

window.addEventListener('keyup', function (event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;
    }
});

// Event listener for 'F' key to toggle follow mode
window.addEventListener('keydown', function (event) {
    if (event.code === 'KeyF') {
        followCar = !followCar; // Toggle follow mode on/off
        controls.enabled = !followCar; // Disable controls when following the car
    }
});

// Speed of movement
const speed = 0.1;

// Extend animation loop to include car movement
function animate() {
    requestAnimationFrame(animate);

    // Move the car based on the keypress
    if (carModel) {
        if (moveForward) carModel.translateZ(speed);  // Move forward based on car's direction
        if (moveBackward) carModel.translateZ(-speed);  // Move backward (reverse) based on car's direction
        if (moveLeft) carModel.rotation.y += 0.05;     // Rotate the car left
        if (moveRight) carModel.rotation.y -= 0.05;    // Rotate the car right
    }

    // If followCar is true, adjust the camera position to follow the car
    if (followCar && carModel) {
        const followDistance = 10; // Distance behind the car
        const cameraOffset = new THREE.Vector3(0, 5, -followDistance); // Slightly above and behind the car

        // Apply the car's rotation to the camera's offset
        cameraOffset.applyQuaternion(carModel.quaternion);

        // Position the camera relative to the car
        camera.position.copy(carModel.position).add(cameraOffset);

        // Make the camera look at the car
        camera.lookAt(carModel.position);
    }

    renderer.render(scene, camera);
}

animate();
