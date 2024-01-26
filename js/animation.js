const startAnimationButton = document.getElementById("startAnimationButton");
const stopAnimationButton = document.getElementById("stopAnimationButton");

let animationInterval;

/**
 * Starts map animation
 */
function startAnimation() {
    // Start the animation loop
    stopAnimation();
    animationInterval = setInterval(animateCircles, 500); // Adjust the interval as needed
}

/**
 * Stops map animation
 */
function stopAnimation() {
    // Stop the animation loop
    clearInterval(animationInterval);
}

/**
 * Handles map animation, runs on loop
 */
async function animateCircles() {
    // Increment the date for the next animation frame
    currentDate.setHours(currentDate.getHours() + 1);
    if (currentDate > new Date("2022-01-31T23:00:00")) {
        currentDate = new Date("2022-01-01T00:00:00");
    }

    // Update circles based on the current date
    setDateTime(currentDate);
}