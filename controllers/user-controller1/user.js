let userHelpers = require('../../helpers/user-helpers')
let adminHelpers = require('../../helpers/admin-helpers')
let checking = require('../../checking/userBlock')
const { ObjectId } = require('mongodb')

module.exports={

    getSignUp: (req, res) => {

        userdata = req.session.userDetails
        res.render('user/signup', { userdata })
    },

  

    postSignup: (req, res) => {

        return new Promise((resolve, reject) => {

            userHelpers.signupData(req.body).then((data) => {
                req.session.userDetails = req.body
                res.redirect('/')
            })
        })

    },


    getLogin: (req, res) => {

        let userdata = req.session.userDetails

        let loginErr=req.session.loginErr
        let userBlocked=req.session.userBlocked
        req.session.loginErr=false
        req.session.userBlocked=false

        res.render('user/login', { userdata,loginErr,userBlocked })
    },


    getLogout: (req, res) => {

        req.session.user = false
        req.session.userDetails = null
        res.redirect('/login')
    },


    postLogin: (req, res) => {

        return new Promise((resolve, reject) => {

            userHelpers.loginData(req.body).then((result) => {

                if (result) {
                    console.log('resulteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
                    console.log(result)

                    checking.userBlock(result.email).then((data) => {

                        if (data) {

                            req.session.userBlocked=true
                            console.log("user blocked,you can't login");
                            res.redirect('/login')
                        } else {
                            req.session.loginErr=false
                            req.session.userBlocked=false
                            req.session.user = true
                            req.session.userDetails = result

                            res.redirect('/')

                        }
                    })
                } else {

                    req.session.loginErr=true
                    req.session.userBlocked=false
                    req.session.user = false
                    res.redirect('/login')

                }

            })
        })
    },
    getUserProfile: (req, res) => {

        let userdata = req.session.userDetails
        let uid = req.session.userDetails._id

        userHelpers.getAllOrders(uid).then((orders) => {
           

            userHelpers.getUserAddress(uid).then((address)=>{

                console.log(orders);

                
                res.render('user/userProfile', { userdata, orders ,address})

            })

           

        })




    },

}