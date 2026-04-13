// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Get elements
const stateInput = document.getElementById('state-input');
const fetchButton = document.getElementById('fetch-alerts');
const alertsDisplay = document.getElementById('alerts-display');
const errorMessage = document.getElementById('error-message');
const loadingSpinner = document.getElementById('loading-spinner');

// Function to show loading spinner
function showLoadingSpinner() {
  loadingSpinner.style.display = 'block';
}

// Function to hide loading spinner
function hideLoadingSpinner() {
  loadingSpinner.style.display = 'none';
}

// Function to display error
function displayError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
  errorMessage.classList.add('error');
}

// Function to clear error
function clearError() {
  errorMessage.textContent = '';
  errorMessage.classList.add('hidden');
  errorMessage.classList.remove('error');
}

// Function to validate input
function isValidStateAbbr(abbr) {
  return /^[A-Z]{2}$/.test(abbr);
}

// Function to fetch weather alerts
async function fetchWeatherAlerts(stateAbbr) {
  try {
    const response = await fetch(weatherApi + stateAbbr);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

// Function to display alerts
function displayAlerts(data) {
  const title = data.title;
  const alerts = data.features;
  const numAlerts = alerts.length;

  alertsDisplay.innerHTML = `<h2>${title}: ${numAlerts}</h2>`;
  if (numAlerts > 0) {
    const list = document.createElement('ul');
    alerts.forEach(alert => {
      const li = document.createElement('li');
      li.textContent = alert.properties.headline;
      list.appendChild(li);
    });
    alertsDisplay.appendChild(list);
  }
}

// Event listener for button
fetchButton.addEventListener('click', async () => {
  const stateAbbr = stateInput.value.trim().toUpperCase();

  // Input validation
  if (!isValidStateAbbr(stateAbbr)) {
    displayError('Please enter a valid two-letter state abbreviation.');
    return;
  }

  // Clear previous data
  alertsDisplay.innerHTML = '';
  clearError();
  stateInput.value = '';

  // Show loading
  showLoadingSpinner();

  try {
    const data = await fetchWeatherAlerts(stateAbbr);
    displayAlerts(data);
  } catch (error) {
    displayError(error.message);
  } finally {
    // Hide loading
    hideLoadingSpinner();
  }
});