🚀 Real-Time Location Sharing Project

I recently built a Real-Time Location Sharing System using Node.js, Express, Socket.io, and Leaflet.js.

🔹 What it does

✅ Multiple users can share their live location in real time.
✅ My own device’s location is shown as a blue marker.
✅ Other users’ locations are shown as red markers.
✅ If I open the app on both laptop and mobile:

On laptop → I see my blue marker + my mobile’s red marker.

On mobile → I see my blue marker + my laptop’s red marker.
✅ All markers update instantly as users move.

🔹 How it works

The Geolocation API fetches the device’s latitude & longitude.

This location is sent to the backend using Socket.io.

The server broadcasts this data to all connected devices.

Leaflet.js displays the updated markers on the map in real time.

🔹 Tech Stack

Backend: Node.js, Express.js, Socket.io

Frontend: HTML, CSS, JavaScript, Leaflet.js

Tools: Ngrok (for live multi-device testing)



Delivery or Ride-Sharing Apps

Emergency Response Systems
