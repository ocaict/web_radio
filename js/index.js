/* Oca WebTech */
import streams from "./streams.js";

// Define initial variables
let selected = streams[0];
let isPlaying = false;
let selectedImage = null;
const waveGif = "../images/wave.gif";
const wavePNG = "../images/wave2.png";

// Get DOM elements
const playPauseBtn = document.querySelector("#play-btn");
const noticeContainer = document.querySelector(".notice-container");
const radiosContainer = document.querySelector(".radios");
const searchInput = document.querySelector("#search");

// Create an audio object
let audio = new Audio();

// Function to create a radio button
const createRadioButton = (radio) => {
  // Create button element
  const button = document.createElement("button");
  button.classList.add("ocamedia");
  button.id = radio.stream;

  // Create image element
  const image = document.createElement("img");
  image.src = radio.imageUrl;
  image.alt = radio.name;
  button.appendChild(image);

  // Create contents div
  const contentsDiv = document.createElement("div");
  contentsDiv.classList.add("btn-contents");

  // Create name paragraph
  const nameParagraph = document.createElement("p");
  nameParagraph.textContent = radio.name;
  contentsDiv.appendChild(nameParagraph);

  // Create location small
  const locationSmall = document.createElement("small");
  locationSmall.textContent = radio.location;
  contentsDiv.appendChild(locationSmall);

  button.appendChild(contentsDiv);

  return button;
};

// Function to create radio list
const createRadioList = (streams) => {
  if (streams.length === 0) {
    radiosContainer.innerHTML = `<h2>Result Not Found!</h2>`;
    return;
  }
  // Create a document fragment
  const fragment = document.createDocumentFragment();

  // Iterate through the streams
  streams.forEach((radio) => {
    const button = createRadioButton(radio);
    // Create Wave Image
    const waveImage = document.createElement("img");
    waveImage.classList.add("wave");
    waveImage.src = waveGif;
    waveImage.alt = "Wave";
    button.appendChild(waveImage);
    fragment.appendChild(button);

    if (radio.stream === selected.stream) {
      button.classList.add("selected");
      selectedImage = button.querySelector(".wave");
    }
  });

  // Clear and update radios container
  radiosContainer.innerHTML = "";
  radiosContainer.appendChild(fragment);
};

// Create the radio list
createRadioList(streams);

// Function to play media
const playMedia = (selected) => {
  // Display loading notice
  noticeContainer.innerHTML = `<h2>Loading... ${selected.name}</h2>`;
  // Fetch the selected stream
  fetch(selected.stream)
    .then((response) => {
      if (response.ok) {
        console.log("Data is available to stream.");

        // Event listener for when audio starts playing
        audio.addEventListener("play", () => {
          console.log("Audio started playing.");
        });

        // Event listener for audio errors
        audio.addEventListener("error", (error) => {
          console.error("Error playing audio:", error);
        });

        // Set the audio source to the selected stream
        audio.src = selected.stream;

        // Event listener for when audio metadata is loaded
        audio.addEventListener("loadedmetadata", () => {
          audio.play();
          playPauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
          noticeContainer.innerHTML = `<h2>Playing - ${selected.name}</h2>`;
          selectedImage.src = waveGif;
          selectedImage.style.display = "block";
        });
      } else {
        console.log(
          "No data available to stream. Response status:",
          response.status
        );
      }
    })
    .catch((error) => {
      console.error("Error checking data availability:", error);
    });
};

// Function to stop media
const stopMedia = () => {
  if (selectedImage) {
    selectedImage.src = wavePNG;
  }
  audio.src = selected.stream;
  audio.pause();
  audio.currentTime = 0;
};

const addEventListener = () => {
  // Add click event listeners to radio buttons
  const buttons = document.querySelectorAll(".ocamedia");
  const waves = document.querySelectorAll(".wave");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const streamUrl = button.id;
      selected = streams.find((stream) => stream.stream === streamUrl);
      buttons.forEach((btn) => btn.classList.remove("selected"));
      waves.forEach((wave) => {
        wave.style.display = "none";
      });
      stopMedia();
      button.classList.add("selected");
      selectedImage = button.querySelector(".wave");

      playMedia(selected);
    });
  });
};

addEventListener();
// Add click event listener to play button
playPauseBtn.addEventListener("click", () => {
  if (audio.paused) {
    playMedia(selected);
  } else {
    audio.pause();
    selectedImage.src = wavePNG;
    playPauseBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
    noticeContainer.innerHTML = `<h2>Paused - ${selected.name}</h2>`;
  }
});

// Play media for the initially selected stream
if (navigator.onLine) {
  playMedia(selected);
} else {
  noticeContainer.innerHTML = `<h2 style="color:red;">You are Offline</h2>`;
  noticeContainer.classList.add("offline");
}

// Event listener for offline status
window.addEventListener("offline", () => {
  stopMedia();

  noticeContainer.innerHTML = `<h2 style="color:red;"">You are Offline</h2>`;
});

// Event listener for online status
window.addEventListener("online", () => {
  console.log("Started");
  playMedia(selected);
  noticeContainer.classList.remove("offline");
});

// Implement Search and Filter
searchInput.addEventListener("input", (e) => {
  let filteredStreams = [];

  const search = e.target.value;
  if (search && search.trim().length > 2) {
    filteredStreams = streams.filter((stream) => {
      return (
        stream.name.toLowerCase().includes(search.trim().toLowerCase()) ||
        stream.location.toLowerCase().includes(search.trim().toLowerCase())
      );
    });
    createRadioList(filteredStreams);
  } else {
    createRadioList(streams);
  }
  addEventListener();
});
