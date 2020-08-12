const express = require("express");
var mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt-nodejs');
const mongo = require('mongodb').MongoClient;
var cors = require('cors');
const passport = require('passport');
const passportModules = require('./passport-config');
const initializePassport = passportModules.initialize;
const loginMessage = passportModules.loginMessage;
const flash = require('express-flash');
const session = require('express-session');
const ObjectID = require('mongodb').ObjectID;
const path = require('path');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const bodyParser = require('body-parser');
var fs = require('fs');
var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
const stripe = require('stripe')("sk_test_51HFHGeIkujnIiQVaKKDPsIcrQvFREaB8gEkZ6ppX1XVnMeAjX35T2HKqA1HljAEyucM8plTGgtEkavHRnLPixOWM00et3StuGH");
const uuid = require('uuid').v4;

//Middleware
const app = express();
const port = 5000;
dotenv.config();

app.use(express.urlencoded({extended: false}));
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(bodyParser.json());

let gfs;


//Connecting to database and initializing routes
mongo.connect(process.env.MONGO_URI, (err, database) =>{
    if(err) {
        console.log('Database error: ' + err);
    } else {
        console.log('Successful database connection');


        const db = database.db('Dream-land');
        
        
        gfs = Grid(db, mongo);
        gfs.collection('bookImages');

        const storage = new GridFsStorage({
            db: db,
            file: (req, file) => {
              return new Promise((resolve, reject) => {  
                const filename = file.originalname;
                const fileInfo = {
                  filename: filename,
                  bucketName: 'bookImages'
                }
                resolve(fileInfo);
              });
            }
          });

        //const storage = new GridFsStorage({ db: db });
        const upload = multer({ storage });

        var registerMsg = "";
        var loginMsg = "";
        var memorizedItemId = "";

        //Passport initialization
        initializePassport(passport, async (email) => {
            const user = await db.collection('users').findOne({email: email});
            //console.log("Initialized user username: "+user.username);
            return user; 
        }, async (id) => {
            const user = await db.collection('users').findOne({_id: new ObjectID(id)});
            console.log("Username of desinc user: "+user.username);
            return user;
        });

        app.use(flash());
        
        app.use(passport.initialize());
        app.use(passport.session());
        

        app.get('/test', function(req, res){
            res.send("Test");
        }); 
        
        //Route for logging in user
        app.post('/login-user', (req, res, next) => {
            passport.authenticate('local', function(err, user, info){
                if(user){
                    console.log("Returned user: "+user.username);
                    req.logIn(user, function(err) {
                        if (err) { 
                            return next(err); 
                        }else{
                            console.log("Logging in");
                            console.log("Logged in user: "+req.user.username);
                            console.log("is authenticated: "+req.isAuthenticated());
                            console.log("Current session: "+JSON.stringify(req.session));
                            if(memorizedItemId == ""){
                                return res.redirect('http://localhost:3000/');
                            }else{
                                var tempMemory = memorizedItemId;
                                memorizedItemId = ""
                                return res.redirect('http://localhost:3000/store/'+tempMemory);
                            }
                        }
                    });
                }else{
                    return res.redirect('http://localhost:3000/login');
                }
            }, {
              successRedirect: 'http://localhost:3000/',
              failureRedirect: 'http://localhost:3000/login',
              failureFlash: true
            })(req, res, next);
          });

        //Register and login error messages routes  
        app.get('/register-msg', function(req, res){
            res.json({msg: registerMsg});
            registerMsg = "";
        });

        app.get('/login-msg', function(req, res){
            console.log("Getting login msg");
            loginMessage(req, res);
        });

        //Route for checking logged user
        app.get('/logged-user', function(req, res){
            console.log("Getting logged user");
            console.log("Current session: "+JSON.stringify(req.session));
            console.log("User: "+req.user);
            console.log(req.isAuthenticated());
            if(req.isAuthenticated()){
                console.log("Authenticated username: "+req.user.username);
                res.json({username: req.user.username});
            }else{
                console.log("User not authenticated");
                res.json({username: null});
            }
        })
        

        //Route for registering user
        app.post('/register-user', async function(req, resP){
            console.log("Posting to register-user")
            try {
                console.log("Entering try");
                const hash = await bcrypt.hashSync(req.body.password);
                console.log("Pass: "+req.body.password);
                console.log("Password hashed");
                console.log("Pass hash: "+hash);
                bcrypt.compare(req.body.confirmPassword, hash, async function(errC, resC){
                    console.log("Entering compare");
                    console.log("Conf pass: "+req.body.confirmPassword);
                    if(err){
                        console.error("Comparing error: "+errC);
                    }else if(resC){
                        if(await db.collection('users').findOne({email: req.body.email})){
                            registerMsg = "Email already in use";
                            resP.redirect("http://localhost:3000/register");
                        }else if(await db.collection('users').findOne({username: req.body.username})){
                            registerMsg = "User with that username already exists";
                            resP.redirect("http://localhost:3000/register");
                        }else{
                            db.collection('users').insert({
                                username: req.body.username,
                                email: req.body.email,
                                password: hash,
                                cart: [],
                                total: 0
                             })
                             resP.redirect("http://localhost:3000/login");
                        }
                    }else{
                        registerMsg = "Passwords do not match, Please try again";
                        console.log("Register msg on server: "+registerMsg);
                        resP.redirect("http://localhost:3000/register");
                    }
                })
            } catch (error) {
                console.error("Error: "+error);
                resP.redirect("http://localhost:3000/register");
            }
        })
        
        //Route for logging user out
        app.get('/logout-user', async function(req, res){
            console.log("Logging out");
            await req.logout();
            await req.session.destroy( function ( err ) {
                if (err) { console.log("Logout error: "+err); }
                console.log('Successfully logged out');
            });
            console.log("Redirecting to /");
            return res.redirect("http://localhost:3000/");
        });

        app.post('/add-book', upload.single('pic'), function(req, res, next){
            
            var genres = req.body.genres.split(' ');
            console.log("Req file: "+JSON.stringify(req.file));
            db.collection('books').insert({
                name: req.body.name,
                author: req.body.author,
                description: req.body.description,
                genres: genres,
                price: req.body.price,
                fileID: req.file.id
            });
            
            res.redirect("http://localhost:3000/addBook");
        })

        app.post('/filter-books', async function(req, res){
            console.log("Genre: "+req.body.genre);
            console.log("Max Price: "+req.body.maxPrice);
            var filteredJson;
            if(req.body.genre == "All"){
                console.log("Finding all");
                filteredJson = await db.collection('books').find({
                    price: {$lte: parseFloat(req.body.maxPrice)}
                }).toArray();
            }else{
                filteredJson = await db.collection('books').find({
                    genres: req.body.genre,
                    price: {$lte: parseFloat(req.body.maxPrice)}
                }).toArray();
            }
            console.log(JSON.stringify(filteredJson));
            res.json(filteredJson);
        })

        app.post('/search-books', async function(req, res){
            console.log("Entering search books API");
            var filteredJson = await db.collection('books').find({
                name: {$regex: new RegExp(req.body.search, "i")}
            }).toArray();

            filteredJson = filteredJson.concat(await db.collection('books').find({
                author: {$regex: new RegExp(req.body.search, "i")}
            }).toArray());

            res.json(filteredJson);
        })

        app.get('/images/:fileId', function(req, res){
            var bucket = new mongodb.GridFSBucket(db, {bucketName: 'bookImages'});

            var readstream = bucket.openDownloadStream(ObjectId(req.params.fileId));
            readstream.on("error", function(err){
                res.send("No image found with that title"); 
            });
            readstream.pipe(res);
        })

        app.post('/item', async function(req, res){
            var bookJson = await db.collection('books').findOne({
                _id: ObjectId(req.body.itemId)
            });
            res.json(bookJson);
        })

        app.post('/add-to-cart', async function(req, res){
            if(req.isAuthenticated()){
                console.log("User is authenticated, proceeding to add to cart");
                var user = req.user;
                user.cart.push(req.body.itemJson);
                req.login(user, function(err) {
                    if (err) return console.log(err);
                    console.log("User cart: "+JSON.stringify(req.user.cart));
                    db.collection('users').updateOne({
                        _id: ObjectID(req.user._id)
                    }, {
                        $set: {cart: req.user.cart}
                    });
                    res.json({isLogged: true})
                });
            }else{
                console.log("User is not authenticated, proceeding to redirect to login");
                memorizedItemId = req.body.itemJson._id;
                res.json({isLogged: false})
            }
        })

        app.get('/get-user-cart', function(req, res){
            res.json(req.user.cart);
        })

        app.post('/delete-item', function(req, res){
            console.log("Deleting item "+req.body.num);
            var user = req.user;
            user.cart.splice(req.body.num, 1);
            req.login(user, function(err) {
                if (err) return console.log(err);
                console.log("User cart: "+JSON.stringify(req.user.cart));
                db.collection('users').updateOne({
                    _id: ObjectID(req.user._id)
                }, {
                    $set: {cart: req.user.cart}
                });
                res.send(200)
            });
        })

        app.post('/delete-all', function(req, res){
            console.log("Deleting item "+req.body.num);
            var user = req.user;
            user.cart = []
            req.login(user, function(err) {
                if (err) return console.log(err);
                console.log("User cart: "+JSON.stringify(req.user.cart));
                db.collection('users').updateOne({
                    _id: ObjectID(req.user._id)
                }, {
                    $set: {cart: req.user.cart}
                });
                res.send(200)
            })
        })

        app.post('/checkout', async function(req, res){
            console.log("Request: ", req.body);

            let error;
            let status;

            try{
                const{product, token} = req.body
                const customer = await stripe.customers.create({
                    email: token.email,
                    source: token.id
                });

                const idempotencyKey = uuid();
                const charge = await stripe.charges.create(
                    {
                        amount: product.price*100,
                        currency: "usd",
                        customer: customer.id,
                        receipt_email: token.email,
                        description: 'Purchased books',
                        shipping: {
                            name: token.card.name,
                            address: {
                                line1: token.card.address_line1,
                                line2: token.card.address_line2,
                                city: token.card.address_city,
                                country: token.card.address_country,
                                postal_code: token.card.address_zip
                            }
                        }
                    },
                    {
                        idempotencyKey
                    }
                );
                console.log("Charge: ", {charge});
                status = "success";
            }catch(error){
                console.error("Error: ", error);
                status = "failure";
            }

            res.json({error, status});
        })

        app.listen(port, () => console.log('Listening on port '+port));

    }
});

