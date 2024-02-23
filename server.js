const express= require('express')
const cors = require('cors')
require('dotenv').config()
const {connectDb} = require('./config/db')
const {errorHandler} = require("./middlewares/errorHandler")

const app =express()
const PORT = process.env.PORT || 5000
app.use(cors())

app.use(express.json())

connectDb();

app.use('/api/users',require('./routes/userRoutes'))
app.use('/api/mechanics',require('./routes/mechanicRoutes'))
app.use('/api/requests',require('./routes/requestRoutes'))
app.use('/api/appDetails',require('./routes/appDetailRoutes'))


app.use(errorHandler);
app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})