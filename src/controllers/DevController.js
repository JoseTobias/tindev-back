// Controla as requisicoes
const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = {
    // Grava o desenvolvedor
    async store(req, res) {
        const { username } = req.body;

        const userExists = await Dev.findOne({ user: username });

        if(userExists) {
            return res.json(userExists);
        }

        const response = await axios.get(`https://api.github.com/users/${username}`);

        const { login, bio, avatar_url: avatar } = response.data;

        const dev = await Dev.create({
            name: login,
            user: username,
            bio,
            avatar
        })

        return res.json(dev);
    },

    // Mostra os desenvolvedores que ele ainda n deu like nem dislike
    async index(req, res) {
        const { user } = req.headers;

        const loggedDev = await Dev.findById(user);

        const users = await Dev.find({
            $and: [
                { _id: { $ne: user } },
                { _id: { $nin: loggedDev.likes } },
                { _id: { $nin: loggedDev.dislikes } },
            ],
        })
        return res.json(users);
    }
};