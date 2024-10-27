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

// Function to fetch the latest photo from Firebase Storage
async function fetchLatestPhoto() {
    const storageRef = ref(storage, 'snapshots/'); // Reference to the 'snapshots' folder
    const result = await listAll(storageRef); // List all items in the folder
    const photoContainer = document.getElementById('photos');
    photoContainer.innerHTML = ''; // Clear previous photos

    if (result.items.length > 0) {
        // Get the download URL for the last uploaded item (assuming the latest photo is the last in the list)
        const latestPhotoItem = result.items[result.items.length - 1];
        const url = await getDownloadURL(latestPhotoItem); // Get the download URL for the latest photo

        const photoDiv = document.createElement('div');
        photoDiv.className = 'photo';
        const img = document.createElement('img');
        img.src = url; // Set the image source to the latest photo URL
        photoDiv.appendChild(img); // Add the image to the photo div
        photoContainer.appendChild(photoDiv); // Add the photo div to the container
    } else {
        console.log("No photos available");
    }
}

// Attach the DeleteAll function to the delete button
function setupButton() {
    const deleteButton = document.getElementById('deleteButton');
    deleteButton.addEventListener('click', DeleteAll);
}

// Fetch photos every 10 seconds
setInterval(fetchLatestPhoto, 10000); // Fetch the latest photo every 10 seconds
document.addEventListener('DOMContentLoaded', () => {
    fetchLatestPhoto(); // Fetch the latest photo on page load
    setupButton(); // Setup the delete button
});
