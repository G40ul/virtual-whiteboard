// Initialize the canvas
const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
let drawing = false;

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Adjust for canvas offset
function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect(); // Get the canvas position on the page
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

// Set drawing configurations
function startDrawing(e) {
    drawing = true;
    const pos = getMousePos(canvas, e);
    ctx.moveTo(pos.x, pos.y);  // Start drawing at the mouse position
}

function endDrawing() {
    drawing = false;
    ctx.beginPath();  // Reset the path after the drawing ends
}

function draw(e) {
    if (!drawing) return;

    const pos = getMousePos(canvas, e);
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';

    ctx.lineTo(pos.x, pos.y);  // Draw to the new mouse position
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);  // Update the start point for the next drawing
}

// Clear the whiteboard
document.getElementById('clear-board').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Recognize handwriting using Tesseract.js
document.getElementById('recognize-handwriting').addEventListener('click', () => {
    const dataURL = canvas.toDataURL();  // Convert canvas content to image format

    Tesseract.recognize(
        dataURL,
        'eng',  // Language setting
        {
            logger: (m) => console.log(m),  // Progress logger
        }
    ).then(({ data: { text } }) => {
        console.log('Recognized text:', text);
        // Clear the canvas and display recognized text
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '30px Arial';
        ctx.fillText(text, 50, 50);
    });
});

// Event listeners for mouse inputs
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('mousemove', draw);
