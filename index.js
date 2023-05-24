const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const productRoutes = require('./routes/product')
const transactionRoutes = require('./routes/transaction')
const statRoutes = require('./routes/statistics')
const authRoutes = require('./routes/auth')
 
mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGO_URL, {  
    useNewUrlParser: true,    
    useUnifiedTopology: true, 
}) 
.then(()=> console.log('connected to database'))
.catch((err)=> console.log(err))

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())   
        
app.use('/product', productRoutes)
app.use('/transaction', transactionRoutes)
app.use('/stat', statRoutes)
app.use('/auth', authRoutes)

app.listen(process.env.PORT || 5000, ()=> {
    console.log(`server is running to port ${process.env.PORT}.`)
})    