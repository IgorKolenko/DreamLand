const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const express = require("express");
const app = express();

var loginMsg = "";

function initialize(passport, getUserByEmail, getUserById){
    const authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email);
        console.log("Email: "+email);
        console.log("Password: "+password);
        if(user == null){
            console.log("Returning: No user with that email");
            loginMsg = 'No user with that email';
            return done(null, false, {message: 'No user with that email'});
        }
        console.log(user.username);

        try {
            console.log("Entering try method");
            await bcrypt.compare(password, user.password, function(err, res){
                console.log("Entering bcrypt compare");
                if(err){
                    return done("Error: "+err);
                }

                if(res){
                    console.log("Returning: user: "+user.username);
                    return done(null, user);
                }else{
                    console.log("Returning: Password incorrect");
                    loginMsg = 'Password incorrect';
                    return done(null, false, {message: 'Password incorrect'});
                }
            })
        } catch (e) {
            return done(e);
        }
    }
    
    passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'}, authenticateUser));

    passport.serializeUser((user, done) => {
        console.log("Serializing");
        return done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
        console.log("Deserializing");
        return done(null, await getUserById(id));
    }); 
}

function loginMessage(req, res){
    res.json({msg: loginMsg});
    loginMsg = "";
}

module.exports = {
    initialize,
    loginMessage
}