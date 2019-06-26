const removeSocketFromStack = (socket, socketStack) => {
    for (let i = 0; i < socketStack.length; i++) {
        if (socket.id === socketStack[i].id) {
            socketStack.splice(i, 1);
            break;
        }
    }
}

const addSocketQueToStack = (connectionId, socketStack) => {
    for (let i = 0; i < socketStack.length; i++) {
        if (connectionId === socketStack[i].id) {
            socketStack[i].que = true;
            break;
        }
    }
}

module.exports = {
    removeSocketFromStack,
    addSocketQueToStack
}