let allRecords = [];

const API_URL = 'http://localhost:3000/api'; // Change this to your backend URL

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadFiltersAndRecords();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('applyBtn').addEventListener('click', filterRecords);
    document.getElementById('resetBtn').addEventListener('click', resetFilters);
}

async function loadFiltersAndRecords() {
    try {
        // Load all records
        const recordsResponse = await fetch(`${API_URL}/records`);
        allRecords = await recordsResponse.json();

        // Load filter options
        const filtersResponse = await fetch(`${API_URL}/filters`);
        const filters = await filtersResponse.json();

        populateSelects(filters);
        displayRecords(allRecords);
        updateRecordCount();
    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('tableBody').innerHTML = 
            '<tr><td colspan="6" class="loading">Error loading records. Make sure your backend is running.</td></tr>';
    }
}

function populateSelects(filters) {
    // Populate vehicles
    const vehicleSelect = document.getElementById('vehicleFilter');
    filters.vehicles.forEach(vehicle => {
        const option = document.createElement('option');
        option.value = vehicle.idVehicle;
        option.textContent = vehicle.nameVehicle;
        vehicleSelect.appendChild(option);
    });

    // Populate maps
    const mapSelect = document.getElementById('mapFilter');
    filters.maps.forEach(map => {
        const option = document.createElement('option');
        option.value = map.idMap;
        option.textContent = map.nameMap;
        mapSelect.appendChild(option);
    });

    // Populate players
    const playerSelect = document.getElementById('playerFilter');
    filters.players.forEach(player => {
        const option = document.createElement('option');
        option.value = player.idPlayer;
        option.textContent = `${player.namePlayer} (${player.country})`;
        playerSelect.appendChild(option);
    });
}

function filterRecords() {
    const vehicleId = document.getElementById('vehicleFilter').value;
    const mapId = document.getElementById('mapFilter').value;
    const playerId = document.getElementById('playerFilter').value;
    const current = document.getElementById('currentFilter').value;

    let filtered = allRecords;

    if (vehicleId) {
        filtered = filtered.filter(r => r.idVehicle === parseInt(vehicleId));
    }
    if (mapId) {
        filtered = filtered.filter(r => r.idMap === parseInt(mapId));
    }
    if (playerId) {
        filtered = filtered.filter(r => r.idPlayer === parseInt(playerId));
    }
    if (current !== '') {
        filtered = filtered.filter(r => r.current === parseInt(current));
    }

    displayRecords(filtered);
    updateRecordCount(filtered.length);
}

function displayRecords(records) {
    const tbody = document.getElementById('tableBody');
    
    if (records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="loading">No records found</td></tr>';
        return;
    }

    tbody.innerHTML = records.map(record => `
        <tr>
            <td>${record.nameVehicle}</td>
            <td>${record.nameMap}</td>
            <td>${record.namePlayer}</td>
            <td>${record.country}</td>
            <td><strong>${record.distance.toLocaleString()}</strong></td>
            <td>
                <span class="status-badge ${record.current ? 'status-current' : 'status-nonmastery'}">
                    ${record.current ? 'Current' : 'Non-Mastery'}
                </span>
            </td>
        </tr>
    `).join('');
}

function updateRecordCount(count = allRecords.length) {
    document.getElementById('recordCount').textContent = `(${count} records)`;
}

function resetFilters() {
    document.getElementById('vehicleFilter').value = '';
    document.getElementById('mapFilter').value = '';
    document.getElementById('playerFilter').value = '';
    document.getElementById('currentFilter').value = '';
    displayRecords(allRecords);
    updateRecordCount();
}
