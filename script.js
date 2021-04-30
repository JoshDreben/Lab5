// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const canvas = document.getElementById("user-image");
const context = canvas.getContext("2d");
const input = document.getElementById("image-input");
const form = document.getElementById("generate-meme");

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener("load", () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "black";
  context.rect(0, 0, canvas.width, canvas.height);
  context.fill();
  var dim = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  context.drawImage(img, dim.startX, dim.startY, dim.width, dim.height);
  generateBtn.disabled = false;
  clearBtn.disabled = true;
  readTextBtn.disabled = true;
  // TODO
  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

const generateBtn = document.querySelector("button[type=submit]");
const clearBtn = document.querySelector("button[type=reset]");
const readTextBtn = document.querySelector("button[type=button]");

const slider = document.querySelector("input[type=range]");

var speakThis = new SpeechSynthesisUtterance(
  document.getElementById("text-top").value +
    " " +
    document.getElementById("text-bottom").value
);

slider.addEventListener("input", () => {
  speakThis.volume = slider.value;
  const icon = document
    .getElementById("volume-group")
    .getElementsByTagName("img")[0];

  var currVol = slider.value;

  if (currVol == 0) {
    icon.src = "icons/volume-level-0.svg";
  } else if (currVol < 34) {
    icon.src = "icons/volume-level-1.svg";
  } else if (currVol < 67) {
    icon.src = "icons/volume-level-2.svg";
  } else if (currVol < 101) {
    icon.src = "icons/volume-level-3.svg";
  }
});

readTextBtn.addEventListener("click", (e) => {
  e.preventDefault();
  var selectedOption = voiceSelect.selectedOptions[0].getAttribute("data-name");
  for (var i = 0; i < voices.length; i++) {
    if (voices[i].name === selectedOption) {
      speakThis.voice = voices[i];
    }
  }
  speakThis.volume = slider.value;
  synth.speak(speakThis);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const textTop = document.getElementById("text-top").value;
  const textBot = document.getElementById("text-bottom").value;
  context.font = "bold 48px sans-serif";
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.fillStyle = "white";
  var topTextDim = context.measureText(textTop);
  var botTextDim = context.measureText(textBot);
  context.lineWidth = 2;
  context.fillText(textTop.toUpperCase(), canvas.width / 2, 30);
  context.strokeText(textTop.toUpperCase(), canvas.width / 2, 30);
  context.fillText(textBot.toUpperCase(), canvas.width / 2, canvas.height - 35);
  context.strokeText(
    textBot.toUpperCase(),
    canvas.width / 2,
    canvas.height - 35
  );

  generateBtn.disabled = true;
  clearBtn.disabled = false;
  readTextBtn.disabled = false;
});

clearBtn.addEventListener("click", (e) => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  generateBtn.disabled = false;
  clearBtn.disabled = true;
  readTextBtn.disabled = true;
});

input.addEventListener("change", (e) => {
  img.src = URL.createObjectURL(input.files[0]);
  let split = e.target.value.split("\\");
  img.alt = split[split.length - 1];
});

var synth = window.speechSynthesis;
var voiceSelect = document.getElementById("voice-selection");
var voices = [];
voiceSelect.disabled = false;

function populateVoiceList() {
  voices = synth.getVoices();

  voiceSelect.removeChild(document.getElementsByTagName("option")[0]);
  for (var i = 0; i < voices.length; i++) {
    var option = document.createElement("option");
    option.textContent = voices[i].name + " (" + voices[i].lang + ")";

    if (voices[i].default) {
      option.textContent += " -- DEFAULT";
    }

    option.setAttribute("data-lang", voices[i].lang);
    option.setAttribute("data-name", voices[i].name);
    voiceSelect.appendChild(option);
  }
}

populateVoiceList();
/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { width: width, height: height, startX: startX, startY: startY };
}
