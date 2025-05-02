const mongoose = require('mongoose');
const config =  require('config')
const debug = require('debug')('app:db')

const connectDB = async () =>{
    try{
    //    const mongooseOptions ={
    //         serverSelectionTimeoutMS:5000,
    //         socketTimeoutMs:45000,
    //         family:4
    //     }


        await mongoose.connect(config.get('MongoURI') )
        debug('Connected to DataBase')



        mongoose.connection.on('connected',()=>{
            console.log("Connected to the database ");
            
            debug('Mongoose has been connected on DB')
        })
        mongoose.connection.on('error',(err)=>{     
            debug('Mongoose connection error:',err.message)
        })
        mongoose.connection.on('disconnected',()=>{
            debug('Mongoose has been disconnected successfully')
        })

        process.on('SIGINT',async ()=>{
            mongoose.connection.close()
            debug('Mongoose connection was closed through app termination')
            process.exit(0)
        })
    }catch(err){
     console.log('Error connecting to MongoDB:', err.message)
        process.exit(1)
    }
}  


module.exports = connectDB ;