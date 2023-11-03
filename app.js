require('dotenv').config()
require('express-async-errors')
//package to handle async errors and not worry about setting try catch block


const express = require('express')
const app = express();

const connectDB = require('./db/connect')//returns promise
const productsRouter = require('./routes/products')


const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')

//middleware
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('<h1> Store API</h1><a href="/api/vi/products">products route</a>')
})

app.use('/api/v1/products',productsRouter)

//products route

app.use(notFoundMiddleware)
app.use(errorMiddleware)
const port = process.env.PORT || 3000
const start = async (req,res)=>{
    try {
        //connect DB
        await connectDB(process.env.MONGO_URI)
        app.listen(port,console.log(`Server is listening port ${port}...`))
    } catch (error) {
        
    }
}
start()
// on deployment npm start