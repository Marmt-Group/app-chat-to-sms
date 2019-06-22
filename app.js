
const express = require('express')
const app = express()
const cors = require('cors')

const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use(cors())
app.use(express.json())

app.get('/sms', (req, res, next) => {
    // get message from Twilio
    const messageFromUser = req.query.Body

    try {
        // emit sms message to chat application
        io.emit('sms message', { messageFromUser });
        res.send('SMS received');
    } catch (err) {
        next(err)
    }
})

app.post('/chat', (req, res, next) => {
    
    const twilioAccountSid = req.body.query.twilioAccountSid
    const twilioAuthToken = req.body.query.twilioAuthToken
    const fromNumber = req.body.query.fromNumber
    const toNumber = req.body.query.toNumber
    const message = req.body.message

    if (!twilioAccountSid || !twilioAuthToken) {
        res.status(500).send('Missing sms programmable credentials')
        return
    }

    const client = require('twilio')(twilioAccountSid, twilioAuthToken)
    
    try {

        client.messages
            .create({
                body: message,
                from: fromNumber,
                to: toNumber
            })
            .then(message => {
                res.status(200).send(message.sid)
            });

    } catch (err) {
        next(err)
    }
})

if (module === require.main) {
    const PORT = process.env.PORT || 8080;
    server.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    });
}