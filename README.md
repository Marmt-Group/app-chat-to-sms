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

## Front-end Integration Example
You can use any sort of front-end, but as an example, [react-chat-widget](https://www.npmjs.com/package/react-chat-widget) integrates very nicely:

![demonstration](./chat-demonstration.gif)

```javascript
import React from 'react'
import { Widget, addResponseMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import openSocket from 'socket.io-client';

const socket = openSocket('https://<your-app>.appspot.com');

class FormChatBot extends React.Component {
    constructor(props) {
        super(props)
        this.messageInput = React.createRef();

        socket.on('sms message', (sms) => this.handleAddResponseMessage(sms));

    }

    handleNewUserMessage = (newMessage) => {
        
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
                    message: newMessage
                }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .catch(error => console.error(error))
        
    }

    handleAddResponseMessage = (response) => {
        const message = response.messageFromUser
        const messageToStr = message.toString()
        addResponseMessage(messageToStr)
    }

    render() {
        return (

            <div className="App">
                <Widget
                    handleNewUserMessage={this.handleNewUserMessage}
                />
            </div>

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
