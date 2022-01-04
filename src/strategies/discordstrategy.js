require('https').globalAgent.options.rejectUnauthorized = false;
const Discordstrategy = require('passport-discord').Strategy;
const passport = require('passport');
const DiscordUser = require('../models/discordUser');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser( async (id, done) => {
    const user = await DiscordUser.findById(id)
    if(user)
    done(null, user);
});

passport.use(new Discordstrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callBackURL: process.env.CLIENT_REDIRECT,
    scope: ['identify', 'guilds']
}, async (accessToken, refreshToken, profile, done) => {
    try{
        const user = await DiscordUser.findOne({
            discordId: profile.id,
            avatar: profile.avatar,
            guilds: profile.guilds
        });
        if(user){
            console.log('User exists.');
            done(null, user);
        }
        else{   
            console.log('User does not exist.');
            const newUser = await DiscordUser.create({
                discordId: profile.id,
                username: profile.username,
                avatar: profile.avatar,
                guilds: profile.guilds
            });
            const savedUser = await newUser.save();
            done(null, savedUser);
        }
    }
    catch(err){
        console.log(err);
        done(err, null);
    }
}));