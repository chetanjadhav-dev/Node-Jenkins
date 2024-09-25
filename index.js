const express = require('express');
require('dotenv').config()
const { InstagramPost, sequelize, Sequelize } = require('./models'); // Import models

const app = express();
const port = process.env.SERVER_PORT; // Change to your preferred port

// Middleware to parse JSON bodies
app.use(express.json());

// Search API with range
app.get('/:profileId', async (req, res) => {
    const { start, end } = req.query;
    const profileId = req.params.profileId
    if (!start || !end) {
        return res.status(400).json({ error: 'start and end are required' });
    }

    try {
        const posts = await InstagramPost.findAll({
            where: {
                profile_id: profileId // Filter by profile_id
            },
            order: [['id', 'ASC']], // Order by id ascending
            limit: end, // Limit the number of results
            offset: start // Skip the first result
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

