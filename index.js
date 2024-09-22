const express = require('express');
require('dotenv').config()
const { InstagramPost, sequelize, Sequelize } = require('./models'); // Import models

const app = express();
const port = process.env.SERVER_PORT; // Change to your preferred port

// Middleware to parse JSON bodies
app.use(express.json());

// Search API with range
app.get('/posts', async (req, res) => {
    const { startId, endId } = req.query;

    if (!startId || !endId) {
        return res.status(400).json({ error: 'startId and endId are required' });
    }

    try {
        const posts = await InstagramPost.findAll({
            where: {
                id: {
                    [Sequelize.Op.between]: [parseInt(startId, 10), parseInt(endId, 10)]
                }
            }
        });

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/', (req, res) => {
    res.send({ message: "It's working" })
})
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

