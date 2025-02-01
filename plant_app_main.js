document.addEventListener("DOMContentLoaded", function() {
    const API_KEY = "2l2szjHqZSQrrexXbiDjK2NyPzXs1A7SZOpuLL706BAtroej3H"; 
    const API_URL = "https://plant.id/api/v3/identification=${2l2szjHqZSQrrexXbiDjK2NyPzXs1A7SZOpuLL706BAtroej3H}"; 

    const loader = document.getElementById("loadingSpinner");

    // Restrict file upload: Min 2, Max 5, and file size < 5MB
    document.getElementById("plantImages").addEventListener("change", function() {
        const files = this.files;
        let valid = true;

        if (files.length < 2 || files.length > 5) {
            alert("⚠️ You must upload at least 2 and at most 5 images.");
            this.value = ""; 
            return;
        }

        for (let file of files) {
            if (file.size > 5 * 1024 * 1024) { 
                alert(`⚠️ ${file.name} exceeds the 5MB limit. Please upload a smaller image.`);
                valid = false;
                break;
            }
        }

        if (!valid) {
            this.value = "";
        }
    });

    document.getElementById("submitButton").addEventListener("click", async function(event) {
        event.preventDefault(); 

        const files = document.getElementById("plantImages").files;

        if (files.length < 2 || files.length > 5) {
            alert("⚠️ You must upload at least 2 and at most 5 images.");
            return;
        }

        alert("📷 Uploading images... Please wait!");
        loader.style.display = "block"; 

        const base64Images = await Promise.all([...files].map(fileToBase64));

        await identifyPlant(base64Images);

        loader.style.display = "none";
    });

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });
    }

    async function identifyPlant(images) {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Api-Key": API_KEY
                },
                body: JSON.stringify({
                    images: images,
                    organs: ["leaf"],
                    latitude: null,
                    longitude: null,
                })
            });

            const data = await response.json();
            console.log("API Response:", data);

            if (data.suggestions && data.suggestions.length > 0) {
                const plantName = data.suggestions[0].plant_name;
                alert(`🌿 Identified Plant: ${plantName}`);
            } else {
                alert("❌ No plant match found. Try different images.");
            }

        } catch (error) {
            console.error("Error identifying plant:", error);
            alert("⚠️ Failed to identify the plant. Please try again.");
        }
    }
});
