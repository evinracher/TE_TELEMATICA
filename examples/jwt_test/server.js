require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

const posts = [
    {
        username: 'Kevin',
        title: 'Post 1'
    },
    {
        username: 'Pedro',
        title: 'Post 2'
    }
]

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name));
})

// middleware
function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    // undefined or actual token
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null ) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        // User has token, but it is no the correct one
        if (err) return res.sendStatus(403);
        req.user = user;
        next()
    });
}

app.listen(3000);