const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
const port = 3000;


app.use(express.static('public'))
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs')
app.use(express.json());
app.use(morgan('dev'));



app.get('/',(req,res)=>{
   res.render('users')
})
app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/signup',(req,res)=>{
    res.render('signup')
})


app.listen(port,()=>{
    console.log(`Server is running on port number ${port}`);
})