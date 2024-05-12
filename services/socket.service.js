

const asyncLocalStorage = require('./als.service');
const logger = require('./logger.service');

var gIo = null
var gSocketBySessionIdMap = {}
var gSocketByUserIdMap = {}

function connectSockets(http, session) {
    gIo = require('socket.io')(http, {
        cors: {
            origin: '*'
        }
    })

    const sharedSession = require('express-socket.io-session');

    gIo.use(sharedSession(session, {
        autoSave: true
    }));

    gIo.on('connection', socket => {
        gSocketBySessionIdMap[socket.handshake.sessionID] = socket
        socket.on('disconnect', socket => {
            console.log('Someone disconnected')
            if (socket.handshake) {
                delete gSocketBySessionIdMap[socket.handshake.sessionID]
            }
        })

        socket.on('LOGIN', user => {
            gSocketByUserIdMap[user._id] = socket
        })

        socket.on('ORDER_OUT', order => {
            const hostSocket = gSocketByUserIdMap[order.host._id]
            const userSocket = gSocketByUserIdMap[order.user._id]
            if (hostSocket) hostSocket.emit('ORDER_IN', order)
            if (userSocket) userSocket.emit('ORDER_IN', order)
        })

        socket.on('set notif', msg => {
            gIo.to(socket.handshake.session.user._id).emit('get notif', msg)
        })
        socket.on('user-watch', userId => {
            socket.join(userId)
        })

    })
}

function emitToAll({ type, data, room = null }) {
    if (room) gIo.to(room).emit(type, data)
    else gIo.emit(type, data)
}

function emitToUser({ type, data, userId }) {
    gIo.to(userId).emit(type, data)
}

function broadcast({ type, data, room = null }) {
    const store = asyncLocalStorage.getStore()
    const { sessionId } = store
    if (!sessionId) return logger.debug('Shoudnt happen, no sessionId in asyncLocalStorage store')
    const excludedSocket = gSocketBySessionIdMap[sessionId]
    if (!excludedSocket) return logger.debug('Shouldnt happen, No socket in map')
    if (room) excludedSocket.broadcast.to(room).emit(type, data)
    else excludedSocket.broadcast.emit(type, data)
}


module.exports = {
    connectSockets,
    emitToAll,
    broadcast,
    emitToUser
}



