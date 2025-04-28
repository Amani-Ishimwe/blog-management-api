const express = require('express');
const morgan = require('morgan');
const path = require('path');
const routes = require('./routes/blog-routes')
const connectDB = require('./config/db')
const debug = require('debug')('app:server')
const config = require('config')
const Blog = require('./models/blog-model')

const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs')
app.use(express.json());
app.use(morgan('dev'));

app.use(routes)



const startServer = async ()=>{
    try{
        await connectDB()
        const server = app.listen(config.get('port'),()=>{
            debug(`Server is running on port ${config.get('port')}`)
        })
        return server
    }catch(error){
        debug('Server startup error: ',error)
        process.exit(1)
    }
}
startServer();