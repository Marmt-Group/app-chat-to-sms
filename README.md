# Chat application to SMS

This application can be utilized by any frontend framework for chat to sms. A user on a website chats and you receive and respond by text message on your phone.

## Installation
1. Download zip or clone: `git clone https://github.com/Marmt-Group/chat-to-sms.git`
2. Purchase a Twilio SMS number [https://www.twilio.com/sms](https://www.twilio.com/sms)
3. Open a Google account, and install [gcloud](https://cloud.google.com/sdk/install).

## Deploy
Once you clone `npm i` isn't necessary

> you can just deploy right away with 

```shell
$ gcloud deploy
```

## Set up Twilio webhook
You need to set up the **a message comes in** webhook in for your Twilio SMS number, with the deployed app to app engine url. The url needs to end with `/sms`. Make sure it's set to HTTP GET
![image](https://user-images.githubusercontent.com/3498223/59966841-c0332400-94d6-11e9-81a5-d6f228b4f018.png)

## Features
* Node/Express.js
* Socket.io
* Twillio SMS programmable
* Deployed on Google App Engine

## Usage example on the front-end with React

```javascript
import React from 'react'
import openSocket from 'socket.io-client';
const socket = openSocket('https://<your-app>.appspot.com');

class FormChatBot extends React.Component {
    constructor(props) {
        super(props)

        socket.on('sms message', (newSMS) => this.handleSMSChange(newSMS));

        this.state = {
            textMessage: ''
        }
    }

    handleSMSChange = (sms) => {
        const message = JSON.stringify(sms.messageFromUser)
        alert(message)
    }

    handleChange = (event) => {
        this.setState({ textMessage: event.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const message = this.state.textMessage

        fetch('https://<your-app>.appspot.com/chat', {
            method: 'POST',
            body: JSON.stringify(
                { 
                    query: { 
                        fromNumber: '+1888888888', // Twilio purchased sms number
                        toNumber: '+1999999999', // your client's number
                        twilioAccountSid: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // retrieve from Twilio console
                        twilioAuthToken: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' // retrieve from Twilio console
                    },
                    message: message
                }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .catch(error => console.error(error))
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="text" value={this.state.textMessage} onChange={this.handleChange}></input>
                <input type="submit" value="Submit"></input>
            </form>
        )
    }
}

export default FormChatBot
```

## Contributing

Submit a [pull request](https://github.com/Marmt-Group/chat-to-sms/pulls)

## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
- Copyright 2019 © <a href="https://marmt.io" target="_blank">Marmt Group</a>.
