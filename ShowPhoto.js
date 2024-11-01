import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getStorage, ref, listAll, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js"; // Import necessary storage functions

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBC1L-dtjQXEebKShlfeZdEcbaqdVnd8Sc",
    authDomain: "computernetowrk-d0548.firebaseapp.com",
    databaseURL: "https://computernetowrk-d0548-default-rtdb.firebaseio.com",
    projectId: "computernetowrk-d0548",
    storageBucket: "computernetowrk-d0548.appspot.com",
    messagingSenderId: "998610150229",
    appId: "1:998610150229:web:4be217660084db7cec05dc",
    measurementId: "G-TG070X5E3B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Function to delete all photos in the 'snapshots' folder
async function DeleteAll() {
    const storageRef = ref(storage, 'snapshots/'); // Reference to the 'snapshots' folder
    try {
        const result = await listAll(storageRef); // List all items in the folder
        const deletePromises = result.items.map(item => {
            return deleteObject(item); // Delete each file
        });
        await Promise.all(deletePromises); // Wait for all deletions to complete
        console.log("All files deleted successfully.");
        alert("All files deleted successfully.");
    } catch (error) {
        console.error("Error deleting files:", error);
        alert("Error deleting files: " + error.message);
    }
}

// Function to fetch the latest photo from the 'snapshots' folder
async function fetchLatestSnapshotPhoto() {
    const storageRef = ref(storage, 'snapshots/'); // Reference to the 'snapshots' folder
    const result = await listAll(storageRef); // List all items in the folder
    const photoContainer = document.getElementById('photos');
    photoContainer.innerHTML = ''; // Clear previous photos

    if (result.items.length > 0) {
        const latestPhotoItem = result.items[result.items.length - 1];
        const url = await getDownloadURL(latestPhotoItem); // Get the download URL for the latest photo

        const photoDiv = document.createElement('div');
        photoDiv.className = 'photo';
        const img = document.createElement('img');
        img.src = url; // Set the image source to the latest photo URL
        photoDiv.appendChild(img); // Add the image to the photo div
        photoContainer.appendChild(photoDiv); // Add the photo div to the container
    } else {
        console.log("No photos available in snapshots.");
    }
}

// Function to fetch the latest photo from the 'danger' folder
async function fetchLatestDangerPhoto() {
    const storageRef = ref(storage, 'danger/'); // Reference to the 'danger' folder
    const result = await listAll(storageRef); // List all items in the folder
    const photoContainer = document.getElementById('model');
    photoContainer.innerHTML = ''; // Clear previous photos

    if (result.items.length > 0) {
        const latestPhotoItem = result.items[result.items.length - 1];
        const url = await getDownloadURL(latestPhotoItem); // Get the download URL for the latest photo

        const photoDiv = document.createElement('div');
        photoDiv.className = 'photo1';
        const img = document.createElement('img');
        img.src = url; // Set the image source to the latest photo URL
        photoDiv.appendChild(img); // Add the image to the photo div
        photoContainer.appendChild(photoDiv); // Add the photo div to the container
    } else {
        console.log("No photos available in danger.");
    }
}

// Attach the DeleteAll function to the delete button
function setupButton() {
    const deleteButton = document.getElementById('deleteButton');
    deleteButton.addEventListener('click', DeleteAll);
}
function setupStorageButton() {
    const storageButton = document.getElementById('storage');
    storageButton.addEventListener('click', () => {
        window.location.href = "https://console.firebase.google.com/u/3/project/computernetowrk-d0548/storage/computernetowrk-d0548.appspot.com/files"; // Replace with your storage page URL
    });
}

// Fetch photos every 5 seconds
setInterval(() => {
    fetchLatestSnapshotPhoto(); // Fetch the latest photo from snapshots
    fetchLatestDangerPhoto(); // Fetch the latest photo from danger
}, 5000); // Fetch both every 5 seconds

document.addEventListener('DOMContentLoaded', () => {
    fetchLatestSnapshotPhoto(); // Fetch the latest photo from snapshots on page load
    fetchLatestDangerPhoto(); // Fetch the latest photo from danger on page load
    setupButton(); // Setup the delete button
    setupStorageButton(); // Setup the 'Go To Storage' button
});
