const map = L.map("map").setView([20.5937, 78.9629], 5); // Default view centered on India
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

let userMarker, targetMarker;

// Function to update the distance display
function updateDistance() {
    if (userMarker && targetMarker) {
        const distance = userMarker.getLatLng().distanceTo(targetMarker.getLatLng());
        document.getElementById("distanceValue").innerText =
            `Distance: ${(distance / 1000).toFixed(2)} km (${distance.toFixed(2)} meters).`;
        document.getElementById("distanceDisplay").classList.remove("hidden");
    } else {
        document.getElementById("distanceDisplay").classList.add("hidden");
    }
}

// Go to specified location
document.getElementById("goToLocation").addEventListener("click", () => {
    const lat = parseFloat(document.getElementById("latitudeInput").value);
    const lng = parseFloat(document.getElementById("longitudeInput").value);
    if (isNaN(lat) || isNaN(lng)) {
        alert("Invalid Latitude/Longitude");
        return;
    }
    if (targetMarker) targetMarker.setLatLng([lat, lng]);
    else targetMarker = L.marker([lat, lng]).addTo(map).bindPopup("Target Location").openPopup();
    map.flyTo([lat, lng], 15);
    updateDistance();
});

// Get current location
document.getElementById("currentLocation").addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                if (userMarker) userMarker.setLatLng([latitude, longitude]);
                else userMarker = L.marker([latitude, longitude]).addTo(map).bindPopup("Your Location").openPopup();
                map.flyTo([latitude, longitude], 15);
                updateDistance();
            },
            () => alert("Could not fetch current location.")
        );
    } else alert("Geolocation not supported.");
});

// Reset map to default view
document.getElementById("resetMap").addEventListener("click", () => {
    map.setView([20.5937, 78.9629], 5); // Reset to default center and zoom level
    map.closePopup(); // Close any open popups
});

// Clear all markers and reset inputs
document.getElementById("clearInputs").addEventListener("click", () => {
    if (userMarker) {
        map.removeLayer(userMarker);
        userMarker = null;
    }
    if (targetMarker) {
        map.removeLayer(targetMarker);
        targetMarker = null;
    }
    document.getElementById("latitudeInput").value = "";
    document.getElementById("longitudeInput").value = "";
    updateDistance(); // Hide distance display
});

// Toggle menu
document.getElementById("menu-button").addEventListener("click", () => {
    const menu = document.getElementById("menu");
    menu.classList.toggle("open");
});
