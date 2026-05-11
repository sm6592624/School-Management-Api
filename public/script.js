// Form submission for adding schools
document.getElementById('addSchoolForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('schoolName').value.trim();
  const address = document.getElementById('schoolAddress').value.trim();
  const latitude = parseFloat(document.getElementById('schoolLatitude').value);
  const longitude = parseFloat(document.getElementById('schoolLongitude').value);
  const messageDiv = document.getElementById('addMessage');

  // Validation
  if (!name || !address) {
    showMessage(messageDiv, 'Please fill in all fields', 'error');
    return;
  }

  if (isNaN(latitude) || isNaN(longitude)) {
    showMessage(messageDiv, 'Latitude and Longitude must be valid numbers', 'error');
    return;
  }

  try {
    showMessage(messageDiv, 'Adding school...', 'info');

    const response = await fetch('/addSchool', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        address,
        latitude,
        longitude,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      showMessage(messageDiv, `✅ ${data.message}`, 'success');
      document.getElementById('addSchoolForm').reset();

      // Refresh schools list if user has already searched
      const userLat = document.getElementById('userLatitude').value;
      const userLon = document.getElementById('userLongitude').value;
      if (userLat && userLon) {
        await findSchools();
      }
    } else {
      showMessage(messageDiv, `❌ Error: ${data.message}`, 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showMessage(messageDiv, `❌ Failed to add school: ${error.message}`, 'error');
  }
});

// Find schools based on user location
async function findSchools() {
  const userLatitude = parseFloat(document.getElementById('userLatitude').value);
  const userLongitude = parseFloat(document.getElementById('userLongitude').value);
  const schoolsList = document.getElementById('schoolsList');

  // Validation
  if (isNaN(userLatitude) || isNaN(userLongitude)) {
    showSchoolsMessage(schoolsList, 'Please enter valid latitude and longitude', 'error');
    return;
  }

  try {
    showSchoolsMessage(schoolsList, 'Loading schools...', 'info');

    const response = await fetch(`/listSchools?latitude=${userLatitude}&longitude=${userLongitude}`);
    const data = await response.json();

    if (response.ok && data.success) {
      if (data.schools.length === 0) {
        showSchoolsMessage(schoolsList, 'No schools found in the database', 'info');
      } else {
        displaySchools(data.schools);
      }
    } else {
      showSchoolsMessage(schoolsList, `Error: ${data.message}`, 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showSchoolsMessage(schoolsList, `Failed to load schools: ${error.message}`, 'error');
  }
}

// Display schools in the list
function displaySchools(schools) {
  const schoolsList = document.getElementById('schoolsList');
  schoolsList.innerHTML = '';

  schools.forEach((school, index) => {
    const schoolCard = document.createElement('div');
    schoolCard.className = 'school-card';
    schoolCard.innerHTML = `
      <div class="school-name">#${index + 1} ${school.name}</div>
      <div class="school-address">${school.address}</div>
      <div class="school-info">
        <div class="info-item">
          <strong>Latitude</strong>
          ${school.latitude.toFixed(6)}
        </div>
        <div class="info-item">
          <strong>Longitude</strong>
          ${school.longitude.toFixed(6)}
        </div>
      </div>
      <div class="distance">📍 ${school.distance}</div>
    `;
    schoolsList.appendChild(schoolCard);
  });
}

// Get user's current location
function getCurrentLocation() {
  if (navigator.geolocation) {
    const messageDiv = document.getElementById('addMessage');
    showMessage(messageDiv, 'Getting your location...', 'info');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        document.getElementById('userLatitude').value = lat.toFixed(6);
        document.getElementById('userLongitude').value = lon.toFixed(6);

        showMessage(messageDiv, `✅ Location obtained: ${lat.toFixed(6)}, ${lon.toFixed(6)}`, 'success');

        // Automatically find schools
        findSchools();
      },
      (error) => {
        let errorMessage = 'Unable to get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permission denied. Please enable location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get user location timed out.';
            break;
        }
        showMessage(messageDiv, `❌ ${errorMessage}`, 'error');
      }
    );
  } else {
    showMessage(document.getElementById('addMessage'), '❌ Geolocation is not supported by your browser', 'error');
  }
}

// Helper function to show messages
function showMessage(element, message, type) {
  element.textContent = message;
  element.className = `message ${type}`;
  element.style.display = 'block';
}

// Helper function to show messages in schools list
function showSchoolsMessage(element, message, type) {
  element.innerHTML = `<p class="info-text">${message}</p>`;
  element.style.display = 'block';
}
