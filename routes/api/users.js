//login登录  register注册  的接口
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')

//加密 创建token
const jwt = require('jsonwebtoken') 
const keys = require('../../config/keys')
//验证token
const passport = require('passport')


const User = require("../../models/User")
// @route  GET api/users/test
// @desc   返回的请求的json数据
// @access public
//er.get('/test', (req, res) => {
//res.json({ msg: 'login works' })
//)}
//注册 接口
// @route  POST api/users/register
// @desc   返回的请求的json数据
// @access public
router.post('/register',(req, res) => {
  //console.log(req.body);
  //查询 数据库有没有这个邮箱
  User.findOne({email:req.body.email})
  .then((user)=>{
  if(user) {
     //有user 存在邮箱 则败 返回400状态码 
    return res.status(400).json("邮箱已经注册！");
    }else{
      //（邮箱，{长度，格式，无则返回默认头像}）  在gravatar注册弄了头像才能得到头像图片链接
    const avatar =gravatar.url(req.body.email,{s:'200',r:'pg',d:'mm'});

    //建立新用户 信息
    const newUser = new User ({
      name:req.body.name,
      email:req.body.email,
      identity:req.body.identity,
     // avatar,     
    
      password:req.body.password
    })
    bcrypt.genSalt(10,function(err,salt){
      //bcrypt.hash（需要加密的密码，salt，）
      bcrypt.hash(newUser.password,salt,(err,hash)=>{
      if(err)   throw err;
      //更新为加密的密码      hash 加密的密码 来自45的括号里
      newUser.password = hash;
      
      newUser.save() //存储 新用户信息
              //成功则返回（then里的参数user）user信息       只是返回部分加密的json格式用户信息 res.json(user)
              .then(user => res.json(user))
              .catch(err => console.log(err));
      });
    });

   }  
  })
})
//login登录
// @route  POST api/users/login
// @desc   返回token   jwt passport
// @access public
router.post('/login',(req, res) => {
  //得到登录的邮箱 密码
  const email = req.body.email;
  const password = req.body.password;
  //查询
  User.findOne({email})
      .then(user => {
        //为假 不存在
        if(!user){
          return res.status(404).json('用户不存在');
        }
        // bcrypt.compare密码匹配  1输入的密码 2数据库的用户密码
        bcrypt.compare(password,user.password)
              .then(isMath =>{
                //为真 匹配成功 数据库的用户信息加入新对象 即规则  
                if(isMath){
                  const rule = {
                    id:user.id,
                    name:user.name,
                    avatar:user.avatar,
                    identity:user.identity
                  };
                  //返回一个token  jwt.sign('规则','加密方式名字','过期时间','箭头函数');
                  jwt.sign(rule,keys.secretOrKey,{expiresIn:3600},(err,token)=>{
                    if(err) throw err;
                    res.json({
                      success:true,
                      token: 'Bearer ' +token
                    })
                  });
                  //res.json({msg:'success'});
                }else{
                  //密码不对
                  return res.status(400).json("密码错误");
                }
              })
      })
})

//验证token
// @route  GET api/users/current
// @desc   返回token current  user
// @access Private
//passport.authenticate(验证方式，
router.get('/current',passport.authenticate('jwt',{session:false}),(req,res)=>{
  //页面输入 'Bearer ' +token
  //验证成功后 返回json格式部分用户信息
  res.json({
    id:req.user.id,
    name:req.user.name,
    email:req.user.email,
    //身份
    identity:req.user.identity
  });
})



module.exports = router;