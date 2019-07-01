
const express = require('express')
const app = express()
const cors = require('cors')
const twilio = require('twilio')
const socketUtils = require('./utils/socketUtils')
const server = require('http').Server(app)
const io = require('socket.io')(server)

let socketStack = []

// Set socket.io listeners
io.on('connection', (socket) => {

    socket.on('add to stack', () => {
        // store socket id
        console.log(`Socket ${socket.id} connected.`)
        const inQue = (socketStack.length) ? true : false
        socketStack.push({ id: socket.id, que: inQue })
        console.log(socketStack)
    })

    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected.`);
        // check if the next socket is in que, emit message to user
        if (socketStack.length) {
            // remove socket connection from stack
            socketUtils.removeSocketFromStack(socket, socketStack)
        }

        if (socketStack.length && socketStack[0].que) {
            socketStack[0].que = false
            io.to(`${socketStack[0].id}`).emit('now messaging')
        }
        console.log(socketStack)
    })

})

app.use(cors())
app.use(express.json())

app.get('/sms', (req, res, next) => {
    // get message from Twilio
    const messageFromUser = req.query.Body

    try {
        // emit sms message to chat app
        const connectionId = socketStack[0].id
        io.to(`${connectionId}`).emit('sms message', messageFromUser)
        return res.status(200)
    } catch (err) {
        next(err)
    }
})

app.post('/chat', (req, res, next) => {

    const connectionId = req.body.query.connection
    const twilioAccountSid = req.body.query.twilioAccountSid
    const twilioAuthToken = req.body.query.twilioAuthToken
    const fromNumber = req.body.query.fromNumber
    const toNumber = req.body.query.toNumber
    const message = req.body.message

    if (!twilioAccountSid || !twilioAuthToken) {
        return res.status(500).send('Missing sms programmable credentials')
    }

    // check to see if connection is equal to socketStack[0]
    if (connectionId === socketStack[0].id) {

        const client = twilio(twilioAccountSid, twilioAuthToken)

        try {
            // Send message from chat app to the client's cell phone
            client.messages
                .create({
                    body: message,
                    from: fromNumber,
                    to: toNumber
                })
                .then(message => {
                    return res.status(200).send('SMS sent')
                });

        } catch (err) {
            next(err)
        }

    } else {
        // add socket connection in que
        socketUtils.addSocketQueToStack(connectionId, socketStack)
        // emit to the socket client that they are in que
        io.to(`${connectionId}`).emit('added to que')
    }

})

const PORT = process.env.PORT || 8000;
server.listen(PORT);

