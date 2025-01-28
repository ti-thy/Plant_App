// Select the form
const plantForm = document.getElementById('plantForm');

// Handle form submission
plantForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent page refresh

  // Get user input values
  const userName = document.getElementById('userName').value;
  const userEmail = document.getElementById('userEmail').value;
  const plantImages = document.getElementById('plantImages').files;

  // Validate number of images
  if (plantImages.length < 2 || plantImages.length > 5) {
    alert('Please upload between 2 and 5 images.');
    return;
  }

  // Display success message
  alert(`Thank you, ${userName}! We have received your details.`);

  // Clear the form
  plantForm.reset();
});
