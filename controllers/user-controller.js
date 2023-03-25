let userHelpers=require('../helpers/user-helpers')
let adminHelpers=require('../helpers/admin-helpers')
module.exports={
    
    getSignUp:(req,res)=>{
        res.render('user/signup')
    },
    
    getHome:(req,res)=>{
        res.render('user/home')
    },
    signupSubmit:(req,res)=>{
     console.log('new acount created,user details:-',req.body)
      userHelpers.signupDetails(req.body)
    }
}