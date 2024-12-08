// Remove the import statements from the top

const firebaseConfig = {
    apiKey: "AIzaSyCufK6OovrrxT1k7Jn1n_7CLC7cEZda9bo",
    authDomain: "kowi-prediction.firebaseapp.com",
    databaseURL: "https://kowi-prediction-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "kowi-prediction",
    storageBucket: "kowi-prediction.firebasestorage.app",
    messagingSenderId: "734552761175",
    appId: "1:734552761175:web:bc9e36d3d2a7e9e8615412",
    measurementId: "G-11MDFV2JMP"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

function addPrediction() {
    const predictorName = document.getElementById('predictorName').value;
    const eventDate = document.getElementById('eventDate').value;
    
    if (!eventDate || !predictorName) {
        alert('Proszę wypełnić wszystkie pola');
        return;
    }

    // Add to Firebase
    database.ref('predictions').push({
        name: predictorName,
        date: eventDate,
        timestamp: Date.now()
    });

    // Clear inputs
    document.getElementById('predictorName').value = '';
    document.getElementById('eventDate').value = '';
}

// Listen for predictions
database.ref('predictions').on('value', (snapshot) => {
    const predictions = snapshot.val();
    const table = document.getElementById('predictionBody');
    table.innerHTML = ''; // Clear existing entries
    
    for (let id in predictions) {
        const pred = predictions[id];
        const row = document.createElement('tr');
        const formattedDate = new Date(pred.date).toLocaleString('pl-PL');
        
        row.innerHTML = `
            <td>${pred.name}</td>
            <td>${formattedDate}</td>
            <td><button class="delete-btn" onclick="deletePrediction('${id}')">Delete</button></td>
        `;
        table.appendChild(row);
    }
});

function deletePrediction(id) {
    database.ref('predictions/' + id).remove();
}

// Calculate next New Year
function getNextNewYear() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const nextYear = currentYear + 1;
    return new Date(`January 1, ${nextYear} 00:00:00`).getTime();
}

// Set the countdown date
const countDownDate = getNextNewYear();

// Update the countdown every 1 second
const timer = setInterval(function() {
    // Get current date and time
    const now = new Date().getTime();
    
    // Find the distance between now and the countdown date
    const distance = countDownDate - now;
    
    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Display the results
    document.getElementById("days").innerHTML = days.toString().padStart(2, '0');
    document.getElementById("hours").innerHTML = hours.toString().padStart(2, '0');
    document.getElementById("minutes").innerHTML = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").innerHTML = seconds.toString().padStart(2, '0');
    
    // If the countdown is finished, start counting to next year
    if (distance < 0) {
        countDownDate = getNextNewYear();
    }
}, 1000);
