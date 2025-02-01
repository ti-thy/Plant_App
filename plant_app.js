document.addEventListener("DOMContentLoaded", function() {
    // Show form when "Let's Get Started" is clicked
    document.getElementById("getStartedButton").addEventListener("click", function() {
        document.getElementById('landingPage').style.display = 'none';
        document.getElementById('userForm').style.display = 'block';
    });

    const API_KEY = "2l2szjHqZSQrrexXbiDjK2NyPzXs1A7SZOpuLL706BAtroej3H"; 
    const API_URL = "https://api.plant.id/v2/identification"; // Corrected API URL
    const loader = document.getElementById("loadingSpinner"); // Get spinner element

    // Restrict file upload: Min 2, Max 5, and file size < 5MB
    document.getElementById("plantImages").addEventListener("change", function() {
        const files = this.files;
        let valid = true;

        // Check if the number of images is between 2 and 5
        if (files.length < 2 || files.length > 5) {
            alert("⚠️ You must upload at least 2 and at most 5 images.");
            this.value = ""; // Reset file input
            return;
        }

        // Validate file sizes
        for (let file of files) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert(`⚠️ ${file.name} exceeds the 5MB limit. Please upload a smaller image.`);
                valid = false;
                break;
            }
        }

        if (!valid) {
            this.value = ""; // Reset input if invalid
        }
    });

    // Handle form submission and API request
    document.querySelector("form").addEventListener("submit", async function(event) {
        event.preventDefault(); // Prevent default form submission

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const files = document.getElementById("plantImages").files;

        if (files.length < 2 || files.length > 5) {
            alert("⚠️ You must upload at least 2 and at most 5 images.");
            return;
        }

        alert("📷 Uploading images... Please wait!"); // Show upload notice
        loader.style.display = "block"; // Show loader spinner

        // Convert images to Base64
        const base64Images = await Promise.all([...files].map(fileToBase64));

        // Call the API
        await identifyPlant(base64Images);

        loader.style.display = "none"; // Hide loader spinner after response
    });

    // Function to convert images to Base64
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]); // Get base64 without prefix
            reader.onerror = error => reject(error);
        });
    }

    // Function to send images to Plant ID API
    async function identifyPlant(images) {
        try {
            loader.style.display = "block";  // Show loader

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Api-Key": API_KEY
                },
                body: JSON.stringify({
                    images: images,
                    organs: ["leaf"], 
                })
            });

            const data = await response.json();
            console.log("API Response:", data);

            loader.style.display = "none";  // Hide loader after response

            if (data.suggestions && data.suggestions.length > 0) {
                const plantName = data.suggestions[0].plant_name;
                alert(`🌿 Identified Plant: ${plantName}`);
            } else {
                alert("❌ No plant match found. Try different images.");
            }

        } catch (error) {
            loader.style.display = "none"; // Hide loader on error
            console.error("Error identifying plant:", error);
            alert("⚠️ Failed to identify the plant. Please try again.");
        }
    }
});





























































































/*

const API_KEY = "2l2szjHqZSQrrexXbiDjK2NyPzXs1A7SZOpuLL706BAtroej3H";
const API_URL = "	https://plant.id/api/v3";


// Show the user form and hide the landing page
document.getElementById("getStartedButton").addEventListener("click", function() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('userForm').style.display = 'block';
});

// File upload validation: 2 to 5 images
document.getElementById("plantImages").addEventListener("change", function() {
    const files = this.files;
    if (files.length < 2 || files.length > 5) {
        alert("⚠️ You have to upload at least 2 pictures of your plant. Do not upload more than 5 pictures!");
        this.value = ""; // Clear file selection
    }
});


// Submit button alert
document.getElementById("submitButton").addEventListener("click", async function(event) {
    event.preventDefault(); // Prevent form submission
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim(); 
    const files = document.getElementById("plantImages").files;

    if (name === "" || email === "" || files.length < 2 || files.length > 5) {
        alert("⚠️ Please fill in all fields and upload between 2-5 images!");
        return;
    }

    alert("📸 Uploading images... Please wait!");


    //convert images to Base64

    const imageBase64Array = await convertImagesToBase64(files);

    //send images to plant.id API

    const response = await identifyplant(imageBase64Array);

    //show response to user

    displayPlantInfo(response);

});

/** Converts images to Base64 format */

async function convertImagesToBase64 (files){
    const promises = [...files].map(file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(",")[1]);// Extract Base64
            reader.onerror = error => reject(error);
        });
    });

    return Promise.all(promises);
}

/**
 * Sends images to Plant.id API for identification
 */
async function identifyPlant(imageBase64Array) {
    const requestBody = {
        api_key: API_KEY,
        images: imageBase64Array,
        details: ["common_names", "care_instructions"]
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) throw new Error("❌ Error: Failed to fetch plant data");

        return await response.json();
    } catch (error) {
        console.error(error);
        alert("⚠️ Unable to identify the plant. Try again later!");
    }
}

/**
 * Displays plant information & care guide
 */
function displayPlantInfo(response) {
    if (!response || !response.suggestions || response.suggestions.length === 0) {
        alert("⚠️ Could not identify the plant. Please try a clearer image.");
        return;
    }

    const plant = response.suggestions[0]; // Most likely match
    const plantName = plant.plant_name || "Unknown Plant";
    const careInstructions = plant.plant_details?.care_instructions || "No care guide available.";

    // Show the results in a new section
    document.getElementById("userForm").innerHTML = `
        <h2>🌿 Plant Identified: ${plantName}</h2>
        <p><strong>Care Tips:</strong> ${careInstructions}</p>
        <button onclick="location.reload()">🔄 Identify Another Plant</button>
    `;
}

