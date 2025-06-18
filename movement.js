import { renderer, controls, carModel, scene, camera } from './main.js';

// Variables to store the movement direction
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let followCar = true; // Boolean to track if the camera is following the car

// Variables for acceleration and velocity
export let velocity = new THREE.Vector3(0, 0, 0); // Export velocity
const acceleration = 0.03;
const deceleration = 0.95;
const maxSpeed = 100;
const rotationAngle = 0.015;
const rotationAcceleration = acceleration * 1.2;
const rotationSpeed = acceleration / 10;
const turnSpeed = 0.005;

window.addEventListener('keydown', function (event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
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

window.addEventListener('keydown', function (event) {
    if (event.code === 'KeyF') {
        followCar = !followCar;
        controls.enabled = !followCar;
    }
});

function animate() {
    requestAnimationFrame(animate);

    if (carModel) {
        const forward = new THREE.Vector3(0, 0, 1);
        const right = new THREE.Vector3(1, 0, 0);

        forward.applyQuaternion(carModel.quaternion);
        right.applyQuaternion(carModel.quaternion);

        if (moveForward && !moveLeft && !moveRight) {
            velocity.add(forward.multiplyScalar(acceleration));
        } else if (moveBackward && !moveLeft && !moveRight) {
            velocity.add(forward.multiplyScalar(-acceleration));
        } else if (moveLeft && !moveForward && velocity.length() > 0) {
            velocity.multiplyScalar(deceleration);
            velocity.add(right.multiplyScalar(acceleration));
            carModel.rotation.y += rotationAngle;
        } else if (moveRight && !moveForward && velocity.length() > 0) {
            velocity.multiplyScalar(deceleration);
            velocity.add(right.multiplyScalar(-acceleration));
            carModel.rotation.y -= rotationAngle;
        } else if (moveLeft && moveForward) {
            velocity.add(forward.multiplyScalar(rotationAcceleration));
            velocity.add(right.multiplyScalar(turnSpeed));
            carModel.rotation.y += rotationAngle;
        } else if (moveRight && moveForward) {
            velocity.add(forward.multiplyScalar(rotationAcceleration));
            velocity.add(right.multiplyScalar(-turnSpeed));
            carModel.rotation.y -= rotationAngle;
        } else if (moveLeft && moveBackward) {
            velocity.add(forward.multiplyScalar(-rotationAcceleration));
            velocity.add(right.multiplyScalar(-rotationSpeed));
            carModel.rotation.y += rotationAngle;
        } else if (moveRight && moveBackward) {
            velocity.add(forward.multiplyScalar(-rotationAcceleration));
            velocity.add(right.multiplyScalar(rotationSpeed));
            carModel.rotation.y -= rotationAngle;
        }

        velocity.multiplyScalar(deceleration);
        velocity.clampLength(0, maxSpeed);
        carModel.position.add(velocity);
        
        // Export updated velocity
        velocity = velocity;
    }

    if (followCar && carModel) {
        const followDistance = 10;
        const cameraOffset = new THREE.Vector3(0, 5, -followDistance);

        cameraOffset.applyQuaternion(carModel.quaternion);
        camera.position.copy(carModel.position).add(cameraOffset);
        camera.lookAt(carModel.position);
    }

    renderer.render(scene, camera);
}

animate();
