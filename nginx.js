const app = require('express')()

// API endpoint
app.get('/', (req,res)=>{
    console.log('Welcome Home')
})

// Launching application on several ports
app.listen(3001)
app.listen(3002)
app.listen(3003)
app.listen(3004)

// This code snippet tries to start multiple servers from the same Express instance.A single Express app cannot listen on multiple ports.
//     Instead, you need to create separate app instances or spawn multiple processes.Here’s a corrected version:

// const express = require('express');

// const createServer = (port) => {
//     const app = express();
//     app.get('/', (req, res) => {
//         res.send("Welcome to GeeksforGeeks !");
//     });
//     app.listen(port, () => {
//         console.log(`Server is running on port ${port}`);
//     });
// };

// // Launch servers on multiple ports
// [3000, 3001, 3002, 3003].forEach(createServer);

// 2. Nginx Configuration:
// Nginx is configured to:

// Act as a reverse proxy and load balancer.
// Use an upstream block(my_http_servers) to define the list of Node.js servers.
// Distribute incoming requests on port 80 across these servers.
// Configuration snippet:
// upstream my_http_servers {
//     # Define the backend servers
//     server 127.0.0.1: 3000;
//     server 127.0.0.1: 3001;
//     server 127.0.0.1: 3002;
//     server 127.0.0.1: 3003;
// }

// server {
//     listen 80;
//     server_name your - domain.com www.your - domain.com;

//     location / {
//         # Set headers
//         proxy_set_header X- Real - IP $remote_addr;
//         proxy_set_header Host $http_host;

//         # Forward requests to the upstream servers
//         proxy_pass http://my_http_servers;
//     }
// }
