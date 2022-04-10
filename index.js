const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const mongoURI = "mongodb://localhost:27017/notesApp"

//<-------------Connecting  to Database------------->
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then((res) => {
        console.log('Connected Mongo Databases');
    })
    .catch((error) => {
        console.log('Cant Connect to databse error occured');
    })


app.use(express.json()) //parsing json in body
app.use(cors()) // Bypass cors policy


//<--------Middleware Routes---------->
const notesRoute = require('./routes/notesRoute')
const checkAuth = require('./auth/checkAuth')
app.use('/notes', checkAuth, notesRoute)

const userRoute = require('./routes/userRoute')
app.use('/user', userRoute)

const authRoute = require('./auth/authRoute')
app.use('/jwt', authRoute)

const postsRoute = require('./routes/postsRoute')
app.use('/posts', postsRoute)



//<--------Error Handler Middleware----------->
const { notFound, errorHandler } = require('./middlewares/errorMiddleware')
app.use(notFound)
app.use(errorHandler)


app.listen(5000)