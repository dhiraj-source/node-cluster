const app = require('express')();
const cluster = require('cluster')
const { generateKeyPair } = require('crypto')

const PORT = 3000

//os.cpus().length should not be used to calculate the amount of parallelism available to an application. Use availableParallelism for this purpose
const numCPUs = require('os').cpus().length

// For Master prcess
if (cluster.isMaster) {
    console.log(`master ${process.pid} running `)

    // Worker 
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // for first worker died

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} is died`)

        if (signal) {
            console.log(`Worker ${worker.process.pid} was killed by signal: ${signal}`);
        } else if (code !== 0) {
            console.log(`Worker ${worker.process.pid} exited with error code: ${code}`);
        } else {
            console.log(`Worker ${worker.process.pid} exited successfully.`);
        }

        console.log('Starting a new worker...');
        
        cluster.fork() // Create a new worker to replace the dead one
    })


} else {
    const worker_threads = cluster.worker.id + PORT
    app.listen(worker_threads, err => err ? console.log('error in server setup') : console.log(`Worker ${process.pid} started on port ${worker_threads}`))

    app.get('/key', (req, res) => {
        generateKeyPair('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: 'top secret'
            }
        }, (err, publicKey, privateKey) => {

            // Handle errors and use the
            // generated key pair.
            res.send(publicKey);
        })
    })
}


//new thing
// (alias) module "cluster"
// import cluster
// Clusters of Node.js processes can be used to run multiple instances of Node.js that can distribute workloads among their application threads.When process isolation is not needed, use the worker_threads module instead, which allows running multiple application threads within a single Node.js instance.

// The cluster module allows easy creation of child processes that all share server ports.

// import cluster from 'node:cluster';
// import http from 'node:http';
// import { availableParallelism } from 'node:os';
// import process from 'node:process';

// if (cluster.isPrimary) {
//     console.log(`Primary ${process.pid} is running`);

//     // Fork workers.
//     for (let i = 0; i < numCPUs; i++) {
//       cluster.fork();
//     }
// cluster.on('exit', (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
// });
// } else {
//     // Workers can share any TCP connection
//     // In this case it is an HTTP server
//     http.createServer((req, res) => {
//         res.writeHead(200);
//         res.end('hello world\n');
//     }).listen(8000);
//     console.log(`Worker ${process.pid} started`);
// }
// Running Node.js will now share port 8000 between the workers:

// $ node server.js
// Primary 3596 is running
// Worker 4324 started
// Worker 4520 started
// Worker 6056 started
// Worker 5644 started
// On Windows, it is not yet possible to set up a namd pipe server in a worker