const app = require('express')()
const { generateKeyPair } = require('crypto')
const cluster = require('cluster')


const numCPUs = require('os').cpus().length
// console.log('number', numCPUs)

// for master cluster or process 

if(cluster.isMaster){

    console.log(`master ${process.pid} is running`)
    for(let i=0;i<numCPUs;i++){
        cluster.fork()
    }
    
    //when an woker died
    
    cluster.on('exit', (worker,code,signal)=>{
        console.log(`worker  ${worker.process.pid} died`);
        
    })
}else{

    app.listen(3000, err => {
        err ? console.log('error in seting up server') : console.log(`Worker ${process.pid} started`)
    
    })
}



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
    }, (error, publicKey, privateKey) => {
        res.send(publicKey)
    })

})


// const app = require('express')()
// const { generateKeyPair } = require('crypto')

// app.get('/key', (req, res) => {
//     generateKeyPair('rsa', {
//         modulusLength: 2048,
//         publicKeyEncoding: {
//             type: 'spki',
//             format: 'pem'
//         },
//         privateKeyEncoding: {
//             type: 'pkcs8',
//             format: 'pem',
//             cipher: 'aes-256-cbc',
//             passphrase: 'top secret'
//         }
//     }, (error, publicKey, privateKey) => {
//         res.send(publicKey)
//     })

// })

// app.listen(8000, err => {
//     err ? console.log('error in seting up server') : console.log('server is runing on port 8000')

// })