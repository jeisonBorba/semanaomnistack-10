const axios = require('axios');

const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {

    async index(req, res) {
        const devs = await Dev.find();

        res.json(devs);
    },

    async store(req, res) {
        const { github_username, techs, latitude, longitude } = req.body;

        let dev = await Dev.findOne({ github_username });
        if (!dev) {
            const response = await axios.get(`https://api.github.com/users/${github_username}`);
    
            const { name = login, avatar_url, bio } = response.data;
            const techsArray = parseStringAsArray(techs); 
        
            const location = {
                type: 'Point',
                coordinates: [ longitude, latitude ]
            }
        
            dev = await Dev.create({
                name,
                github_username,
                bio,
                avatar_url,
                techs: techsArray,
                location
            });

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray
            );

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }
    
        return res.json(dev);
    },

    async destroy(req, res) {
        const { username } = req.params; 
        
        await Dev.remove({ github_username: username });

        res.json({ 'message': 'Item deleted successfully!' });
    },

    async update(req, res) {
        const { github_username, techs, latitude, longitude } = req.body;

        const location = {
            type: 'Point',
            coordinates: [ longitude, latitude ]
        };

        const filter = { github_username };

        const update = {
            techs: parseStringAsArray(techs),
            location
        };

        const dev = await Dev.findOneAndUpdate(filter, update);

        res.json(dev)
    }
}