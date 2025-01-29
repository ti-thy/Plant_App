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
document.getElementById("submitButton").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent form submission
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const files = document.getElementById("plantImages").files;

    if (name === "" || email === "" || files.length < 2 || files.length > 5) {
        alert("⚠️ Please fill in all fields and upload between 2-5 images!");
        return;
    }

    alert("✅ Form submitted successfully!");
});
