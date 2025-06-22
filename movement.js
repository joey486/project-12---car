import { renderer, controls, carModel, scene, camera } from './main.js';
import { Vector3 } from 'https://unpkg.com/three@0.160.0/build/three.module.js';



let moveForward = false,
    moveBackward = false,
    moveLeft = false,
    moveRight = false;

let cameraFollowCar = true;
let camMoveForward = false,
    camMoveBackward = false,
    camMoveLeft = false,
    camMoveRight = false,
    camMoveUP = false,
    camMoveDown = false;

const cameraDirection = new Vector3();
const cameraSpeed = 0.5;

export let velocity = new Vector3(0, 0, 0); // Export velocity
const acceleration = 0.03;
const deceleration = 0.95;
const maxSpeed = 100;
const rotationAngle = 0.015;

window.addEventListener('keydown', function (event) {
    if (!cameraFollowCar) {
        switch (event.code) {
            case 'KeyW': camMoveForward = true; break;
            case 'KeyS': camMoveBackward = true; break;
            case 'KeyA': camMoveLeft = true; break;
            case 'KeyD': camMoveRight = true; break;
            case 'ShiftLeft':
            case 'ShiftRight': camMoveDown = true; break;
            case 'Space' : camMoveUP = true; break
        }
    } else {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                moveForward = true; break;
            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true; break;
            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = true; break;
            case 'ArrowRight':
            case 'KeyD':
                moveRight = true; break;
        }
    }


    if (event.code === 'KeyF') {
        cameraFollowCar = !cameraFollowCar;
        if (controls) controls.enabled = !cameraFollowCar;
    }
});

window.addEventListener('keyup', function (event) {
    if (!cameraFollowCar) {
        switch (event.code) {
            case 'KeyW': camMoveForward = false; break;
            case 'KeyS': camMoveBackward = false; break;
            case 'KeyA': camMoveLeft = false; break;
            case 'KeyD': camMoveRight = false; break;
            case 'ShiftLeft':
            case 'ShiftRight': camMoveDown = false; break;
            case 'Space' : camMoveUP = false; break
        }
    } else {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                moveForward = false; break;
            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false; break;
            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = false; break;
            case 'ArrowRight':
            case 'KeyD':
                moveRight = false; break;
        }
    }
});

function animate() {
    requestAnimationFrame(animate);

    if (carModel) {
        const forward = new Vector3(0, 0, 1).applyQuaternion(carModel.quaternion);

        // Velocity 
        if (moveForward) {
            velocity.add(forward.clone().multiplyScalar(acceleration));
        }
        if (moveBackward) {
            velocity.add(forward.clone().multiplyScalar(-acceleration));
        }

        if (velocity.length() > maxSpeed) {
            velocity.setLength(maxSpeed);
        }

        velocity.multiplyScalar(deceleration);

        // Position
        carModel.position.add(velocity);

        // Rotation
        if (moveLeft && velocity.length() > 0.001) {

            carModel.rotation.y += rotationAngle;
        }
        if (moveRight && velocity.length() > 0.001) {
            carModel.rotation.y -= rotationAngle;
        }

        // Camera
        if (cameraFollowCar && carModel) {
            const followDistance = 10;
            const cameraOffset = new Vector3(0, 5, -followDistance);

            cameraOffset.applyQuaternion(carModel.quaternion);
            camera.position.copy(carModel.position).add(cameraOffset);
            camera.lookAt(carModel.position);
        } else {
            cameraDirection.set(0, 0, 0);

            // Forward/backward
            if (camMoveForward) cameraDirection.z -= 1;
            if (camMoveBackward) cameraDirection.z += 1;

            // Left/right
            if (camMoveLeft) cameraDirection.x -= 1;
            if (camMoveRight) cameraDirection.x += 1;

            if (camMoveDown) cameraDirection.y -= 1;
            if (camMoveUP) cameraDirection.y += 1;

            // Normalize for diagonal movement
            if (cameraDirection.length() > 0) {
                cameraDirection.normalize();
                // Apply camera rotation
                cameraDirection.applyQuaternion(camera.quaternion);
                // Add to camera position
                camera.position.addScaledVector(cameraDirection, cameraSpeed);
            }
        }

        if (!cameraFollowCar && controls) {
            controls.target.copy(camera.position.clone().add(camera.getWorldDirection(new Vector3())));
            controls.update(); // required for damping
        }

    }

    renderer.render(scene, camera);
}

animate();
