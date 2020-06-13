const express = require("express")
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()
const passport = require('passport')
//引入users
const users = require('./routes/api/users')
const profile = require('./routes/api/profiles')

const db = require('./config/keys').mongoURI;

//使用 body-parser中间件
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

mongoose.connect(db,{  useUnifiedTopology: true ,useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// passport初始化
app.use(passport.initialize());
require('./config/passport')(passport);  

//app.get("/",(req,res)=>{
//  res.send("Hello World!");
//})
//使用users
app.use('/api/users', users);
app.use('/api/profiles',profile);


const port = process.env.PORT || 5000;

app.listen(port,()=>{
  console.log(`Server running on port ${port} `);
})