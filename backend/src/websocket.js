const socketio = require('socket.io');

const parseStringAsArray = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');

// TODO: alterar para mongo
const connections = [];
let io;

exports.setupWebsocket = server => {
    io = socketio(server);

    io.on('connection', socket => {
        const { latitude, longitude, techs } = socket.handshake.query;

        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude)
            },
            techs: parseStringAsArray(techs)
        });
    });
};

exports.findConnections = (coordinates, techs) => {
    return connections.filter(connection => {
        const distance = calculateDistance(coordinates, connection.coordinates);
        const hasTech  = connection.techs.some(item => techs.includes(item));
        
        return distance < 10 && hasTech;
    });
};

exports.sendMessage = (to, messageKey, data) => {
    to.forEach(connection => {
        io.to(connection.id).emit(messageKey, data);
    });
};