require('dotenv').config();
require('./strategies/discordstrategy');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const db = require('./database/database');
const path = require('path');
const mongoose = require('mongoose');
db.then(() => console.log('Connected to MongoDB')).catch(err => console.error(err));

//Routes    
const authRoute = require('./routes/auth');
const dashboardRoute = require('./routes/dashboard');

app.use(session({
    secret: 'secret shhh',
    cookie: {
        maxAge: 60000 * 60 * 24
    },
    saveUninitialized: false,
    resave: false,
    name: 'discord_auth',
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
//Middleware 
app.use('/auth', authRoute);
app.use('/dashboard', dashboardRoute);

app.get('/', isAuthorized, (req, res) => {
    res.render('home' , {
        users : [
            { name: 'admin', email: 'admin@yahoo.com' },
            { name: 'user1', email: 'user1@yahoo.com' },
            { name: 'user2', email: 'user2@yahoo.com' },
            { name: 'user3', email: 'user3@yahoo.com' },
            { name: 'user4', email: 'user4@yahoo.com' },
        ]
    });
});


function isAuthorized(req, res, next) {
    if(req.user) {
        console.log('User is logged In');
        res.redirect('/dashboard');
    }
    else{
        console.log('User is not logged In');
        next();
    }
}

app.listen(PORT, () => {
    console.log (`Listening for Requests on PORT ${PORT}`);
});