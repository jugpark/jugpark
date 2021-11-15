const express = require('express');
const app = express()
const port = 5000
const cookieParser = require('cookie-parser');
const config = require('./server/config/key');
const { auth } = require('./server/middleware/auth')
const { User } = require("./server/models/User");
//application/x-www-form-unlencoded -parse(분석)
app.use(express.urlencoded({ extended: true }));
//application/json -parse(분석)
app.use(express.json());
app.use(cookieParser());

const mongoose = require('mongoose');
const { userInfo } = require('os');
mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB Connected..'))
    .catch(err => console.log(err))
//then -> check a correction
//catch -> if there are some errors, catch it and return error

app.get('/', (req, res) => res.send('Hello World! really'))

app.get('/api/hello', (req, res) => {
    res.send("안녕하세요")
})

app.post('/api/users/register', (req, res) => {
    //while registering for a member, take some information from client and put it into datebase.
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/api/users/login', (req, res) => {

    //find requested email in database
    User.findOne({ email: req.body.email }, (err, user) => {

        // console.log('user', user)
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "no user information by submitted email."
            })
        }

        // if requested email is existing in database, check the passwords are same
        user.comparePassword(req.body.password, (err, isMatch) => {
            // console.log('err',err)

            // console.log('isMatch',isMatch)

            if (!isMatch)
                return res.json({ loginSuccess: false, message: "wrong password." })

            // if password right, make a token
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                // save token in local storage cookie
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id })
            })
        })
    })
})

// role 1 = admin    role 2 = specific admin
// role 0 = normal user  role != 0 admin
app.get('/api/users/auth', auth, (req, res) => {
    //even information reach here, it means authentication works success
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    // console.log('req.user', req.user)
    User.findOneAndUpdate({ _id: req.user._id },
        { token: "" }
        , (err, user) => {
            if (err) return res.json({ success: false, err });
            return res.status(200).send({
                success: true
            })
        })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
