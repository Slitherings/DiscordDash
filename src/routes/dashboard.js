const router = require('express').Router();

function isAuthorized (req, res, next) {
    if(req.user){
        console.log('User is logged in.');
        console.log(req.user);
        next();
    }
    else{
        console.log('User is not logged in.');
        res.redirect('/');
    }
}

router.get('/', isAuthorized ,(req, res) => {
    res.render('dashboard', {
        username: req.user.username,
        avatar: req.user.avatar,
        discordId: req.user.discordId,
        guilds: req.user.guilds
    });
});

router.get('/settings', isAuthorized, (req, res) => {
    res.render('settings', {
        username: req.user.username,
        avatar: req.user.avatar,
        discordId: req.user.discordId,
        guilds: req.user.guilds
    });
});

router.get('/quicktask', isAuthorized, (req, res) => {
    res.render('quicktasks', {
        username: req.user.username,
        avatar: req.user.avatar,
        discordId: req.user.discordId,
        guilds: req.user.guilds
    });
});

module.exports = router; 