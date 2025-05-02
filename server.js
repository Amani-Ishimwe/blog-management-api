const express = require('express');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db')
const debug = require('debug')('app:server')
const config = require('config')
const blogRoutes = require('./routes/blog-routes')
const roleRoutes = require('./routes/role-routes')
const userRoutes = require('./routes/user-routes')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger/swagger.json')

const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs')
app.use(express.json());
app.use(morgan('dev'));

//routes

app.use('/api/user',userRoutes)
app.use('/api/role',roleRoutes) 
app.use('/api/blog',blogRoutes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const startServer = async ()=>{
    try{
        await connectDB()
        const server = app.listen(process.env.PORT || config.get('port'),()=>{
            debug(`Server is running on port ${config.get('port')}`)
        })
        return server
    }catch(error){
        debug('Server startup error: ',error)
        process.exit(1)
    }
}
startServer();

module.exports = app