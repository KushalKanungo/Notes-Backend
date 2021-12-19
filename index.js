const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const session = require('express-session')
const MongoDBSession = require('connect-mongodb-session')(session)
const mongoURI = "mongodb://localhost:27017/notesApp"

//<-------------Connecting  to Database------------->
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then((res) => {
        console.log('Connected Mongo Databases');
    })


//<----------Creating Session and Cookie------------->
const sessionStore = new MongoDBSession({
    uri: mongoURI,
    collection: 'mySessions'
})


app.use(
    session({
        secret: 'signedkey',
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            maxAge: 60000
        }
    })
)


//<---------Check User Middleware------------>
const checkUser = (req, res, next) => {
    if (req.session.isAuth) {
        next()
    } else {
        res.status(401).json({'isAuthorised': false})
    }
}


app.use(express.json()) //parsing json in body
app.use(cors()) // Bypass cors policy


//<--------Middleware Routes---------->
const notesRoute = require('./routes/notesRoute')
app.use('/notes', checkUser,notesRoute)

const userRoute = require('./routes/userRoute')
app.use('/user', userRoute)


app.listen(5000)