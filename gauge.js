import { velocity } from './movement.js';

document.addEventListener('DOMContentLoaded', () => {
    const gaugeElement = document.getElementById('speed');

    function updateGauge() {
        // Calculate speed in KPH
        const speedKPH = velocity.length() * 60.0; 
        gaugeElement.innerText = speedKPH.toFixed(0);

        requestAnimationFrame(updateGauge); // Keep updating the gauge
    }

    updateGauge();
});
