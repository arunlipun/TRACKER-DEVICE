

// const socket = io();
// const markers = {};

// // Apna unique socket ID track karne ke liye
// let myId = null;
// socket.on("connect", () => {
//     myId = socket.id;
// });

// // Geolocation
// if (navigator.geolocation) {
//     navigator.geolocation.watchPosition((position) => {
//         const { latitude, longitude } = position.coords;
//         socket.emit("send-location", { latitude, longitude });
//     }, (error) => {
//         console.log(error);
//     }, {
//         enableHighAccuracy: true,
//         timeout: 5000,
//         maximumAge: 0,
//     });
// }

// // Leaflet map
// const map = L.map("map").setView([0, 0], 16);
// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution: "OpenStreetMap"
// }).addTo(map);

// // Receive locations
// socket.on("receive-location", (data) => {
//     const { id, latitude, longitude } = data;

//     // ✅ Apne device ke liye map center move karo
//     if (id === myId) {
//         map.setView([latitude, longitude]);
//     }

//     // Marker already hai to update karo
//     if (markers[id]) {
//         markers[id].setLatLng([latitude, longitude]);
//     } else {
//         // Naya marker banao
//         const color = (id === myId) ? "blue" : "red";
//         const customIcon = L.icon({
//             iconUrl: `https://maps.gstatic.com/mapfiles/ms2/micons/${color}-dot.png`,
//             iconSize: [32, 32],
//             iconAnchor: [16, 32],
//         });
//         markers[id] = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
//     }
// });

// // User disconnect hone pe marker hatao
// socket.on("user-disconnectd", (id) => {
//     if (markers[id]) {
//         map.removeLayer(markers[id]);
//         delete markers[id];
//     }
// });



const socket = io();
const markers = {};

// Apna unique socket ID track karne ke liye
let myId = null;
socket.on("connect", () => {
    myId = socket.id;
});

// Success handler
function success(position) {
    const { latitude, longitude } = position.coords;
    console.log("GPS location:", latitude, longitude);
    socket.emit("send-location", { latitude, longitude });
}

// Error handler + Fallback
function error(err) {
    console.warn(`Geolocation error: ${err.message}`);
    // Fallback: IP-based approx location
    fetch("https://ipapi.co/json/")
        .then(res => res.json())
        .then(data => {
            console.log("Fallback IP location:", data.latitude, data.longitude);
            socket.emit("send-location", {
                latitude: data.latitude,
                longitude: data.longitude
            });
        })
        .catch(err => console.error("IP location fetch failed:", err));
}

// Geolocation
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(success, error, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    });
} else {
    // Agar geolocation hi supported nahi hai toh direct IP fallback
    fetch("https://ipapi.co/json/")
        .then(res => res.json())
        .then(data => {
            console.log("Direct IP location:", data.latitude, data.longitude);
            socket.emit("send-location", {
                latitude: data.latitude,
                longitude: data.longitude
            });
        });
}

// Leaflet map
const map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap"
}).addTo(map);

// Receive locations
socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;

    // ✅ Apne device ke liye map center move karo
    if (id === myId) {
        map.setView([latitude, longitude]);
    }

    // Marker already hai to update karo
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        // Naya marker banao
        const color = (id === myId) ? "blue" : "red";
        const customIcon = L.icon({
            iconUrl: `https://maps.gstatic.com/mapfiles/ms2/micons/${color}-dot.png`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
        });
        markers[id] = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
    }
});

// User disconnect hone pe marker hatao
socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
