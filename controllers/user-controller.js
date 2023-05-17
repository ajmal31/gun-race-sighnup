let userHelpers = require('../helpers/user-helpers')
let adminHelpers = require('../helpers/admin-helpers')
let db = require('../config/connection')
let collections = require('../config/collections')
let checking = require('../checking/userBlock')
const { RoomRecordingContext } = require('twilio/lib/rest/video/v1/room/recording')
const { ObjectId } = require('mongodb')

const Razorpay = require('razorpay')
var instance = new Razorpay({
    key_id: 'rzp_test_FqE7lxwHbHUy8A',
    key_secret: 'w8jb9ijjMG8qcHAa602JfsSg',
  });

var couponTotal
module.exports = {

    getSignUp: (req, res) => {

        userdata = req.session.userDetails
        res.render('user/signup', { userdata })
    },

    getHome: (req, res) => {

        adminHelpers.getAllCategories().then((data) => {

            let userdata = req.session.userDetails
            res.render('user/home', { data, userdata })
        })

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

        res.render('user/login', { userdata })
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

                            console.log("user blocked,you can't login");
                        } else {
                            req.session.user = true
                            req.session.userDetails = result

                            res.redirect('/')

                        }
                    })
                } else {

                    req.session.user = false
                    res.redirect('/login')

                }

            })
        })
    },
///

    getCart: (req, res) => {
        let uid = req.session.userDetails._id

        userHelpers.getCartProducts(uid).then((data) => {
            if (data) {


                let userdata = req.session.userDetails
                res.render('user/cart', { userdata, data })

            }
        })

    },

    otpLogin: (req, res) => {

        let badnumber = req.session.badnumber
        req.session.badnumber = false

        res.render('user/phNumber', { badnumber })
    },

    checkNumber: (req, res) => {

        userHelpers.checkNumber(req.body.phone).then((response) => {
            if (!response.err) {

                let name = response.name
                req.session.phone = response.phone
                req.session.userDetails = response.data

                res.render('user/otp', { name })
            }
            else {

                req.session.badnumber = true

                res.redirect('/otplogin')
            }

        })

    },

    postCheckOtp: (req, res) => {

        let phone = req.session.phone
        let otp = req.body.otp

        userHelpers.checkOtp(otp, phone).then((response) => {

            if (!response.err) {

                req.session.user = true
                res.redirect('/')

            }
            else {
                req.session.user = false
                res.redirect('/checkotp')
            }

        })
    },
    getCheckOtp: (req, res) => {

        res.render('user/otp')
    },
    getShop: (req, res) => {


        let catName = req.params.id
        userHelpers.shop(catName).then((data) => {

            if (data) {



                let userdata = req.session.userDetails
                res.render('user/shop_1', { data, userdata })

            } else {


                console.log('data didnt get');
            }
        })
    },

    //not completed i will come just wait
    addToCart: (req, res) => {

        userHelpers.addToCart(req.params.id, req.session.userDetails._id).then((response) => {

            if (response.exist) {

                const previousUrl = req.header('Referer');
                console.log('the product already exist in the cart');
                res.redirect(previousUrl)


            } else {
                const previousUrl = req.header('Referer');
                console.log('product added to cart');
                res.redirect(previousUrl)
            }



        })
    },
    viewProductDetails: (req, res) => {

        let pid = req.params.id

        adminHelpers.getOneProduct(pid).then((data) => {

            console.log('mission success')
            console.log(data);
            let userdata = req.session.userDetails

            res.render('user/productDetails', { userdata, data })

        })
    },
    getCheckout: (req, res) => {


        let userdata = req.session.userDetails

        let uid = req.params.id

        userHelpers.getCartProducts(uid).then((cartData) => {

            userHelpers.getUserAddress(uid).then((userAddress) => {

                console.log('card Data');
                console.log(cartData);
                console.log('userAdress');
                console.log(userAddress);

                let subTotal = 0
                let quantity = 0
                let price = 0
                let tempTotal = 0
                let total = getTotal(cartData)

                 

                function getTotal(cartData) {


                    for (let i = 0; i < cartData.length; i++) {
                        price = Number(cartData[i].products.price)

                        quantity = cartData[i].quantity
                        subTotal = price * quantity

                        tempTotal = tempTotal + subTotal

                    }
                    return tempTotal
                }


                // userAddress=userAddress.address
                console.log('userAddress')
                console.log(userAddress)

                console.log('chekng..............................................................................');
                console.log(total);
                
                coupon=req.session.coupon

               
                couponCodeErr=req.session.couponCodeErr
                req.session.couponCodeErr=false

                minimumPurchase=req.session.minimumPurchase  
                req.session.minimumPurchase=false

                minimumPurchaseAmount=req.session.minimumPurchaseAmount
                req.session.minimumPurchaseAmount=false

               expired=req.session.expire
               req.session.expire=false

                res.render('user/checkout', { userdata, total, cartData, userAddress,coupon,couponCodeErr,minimumPurchase ,minimumPurchaseAmount,expired})

            })
        })

    },
    getForgotPassword: (req, res) => {
        res.redirect('/otplogin')
    },




    postCartCount: (req, res) => {

        console.log('ajax request recieved')
        console.log('ajax recieved count', req.body.quantity)
        let uid = req.session.userDetails._id
        let pid = req.body.pid
        let count = req.body.quantity
        console.log('calling user helpers');
        userHelpers.changeCartCount(uid, pid, count).then((response)=>{
            if(response)
            {
                res.json(response)
            }else{
                console.log('waitinggggggggggggggggggggggggggggggggg');
            }
        })
    },



    getRemoveCartProduct: (req, res) => {

        console.log('ajax cart product spotted')
        console.log(req.body);
        let pid = req.body.pid
        let uid = req.session.userDetails._id
        console.log(pid);
        userHelpers.removeCartProduct(pid, uid)
    },



    getAllProducts: (req, res) => {
        adminHelpers.getAllProducts().then((response) => {
            if (response) {
                let userdata = req.session.userDetails
                res.render('user/ViewFullProducts', { response, userdata })
            }
        })
    },


    addWishList: (req, res) => {

      previousUrl=req.header('Referer')

      let pid=req.params.id
      let userId=req.session.userDetails._id
      
      userHelpers.addWishlist(pid,userId).then((response)=>{

        res.redirect(previousUrl)
      })

    },
    getAllWishListProducts: (req, res) => {
        let userdata = req.session.userDetails
        let userId=req.session.userDetails._id
        userHelpers.getAllWishlistProducts(userId).then((response)=>{

            res.render('user/wishList', { userdata })
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



    postAddAddress: (req, res) => {

        console.log('address Details');

        let uid = req.session.userDetails._id
        let uname = req.session.userDetails.username
        console.log('adress');
        console.log(req.body)

        let data = req.body
        let obj = {
            userId: ObjectId(uid),
            type: data.type,
            name: data.name,
            address: data.address,
            state: data.state,
            country: data.country,
            pincode: data.pincode,
            phone: data.phone

        }
        userHelpers.postAddAddress(obj).then((response) => {
            const previousUrl = req.header('Referer');

            if (response) {

                res.redirect(previousUrl)
            } else {
                res.redirect(previousUrl)
            }

        })

    },
    postPlaceOrder: (req, res) => {

        const previousUrl = req.header('Referer');
        console.log('place order details ')
        console.log(req.body);
        let addressId = req.body.address
        let totalAmount = req.body.amount
        let uid = req.session.userDetails._id
        let payment = req.body.payment_mode
        console.log('pament method')
        console.log(payment)
        
        if(addressId==null)
         {
             res.redirect(previousUrl)

         }else{

            userHelpers.getCartProducts(uid).then((cartProducts) => {

                userHelpers.getUserSpecificAddress(addressId).then((userAddress) => {
    
                    
    
                        userHelpers.placeOrder(cartProducts, userAddress, uid, totalAmount, payment).then((orderId) => {
                            if (orderId) {
        
                                //Order Details inserted in the order collection after clearing the user cart
        
                                userHelpers.removeCartData(uid).then((remove) => {
                                    if (remove) {
        
                                        
        
                                        if(payment === 'razorpay') {
                                            userHelpers.generateRazorpay(orderId,totalAmount).then((order)=>{
                                            console.log(order)
                                            console.log("order")
                                              req.session.coupon=null
                                             res.json({order:order,status:false})
                                                
                                            });
                                          }else
                                          {
                                            
                                            res.json({status:true})
                                                 
                                           
                                          }
                                          
                                          
                                        
                                    }
                                })
        
                            }
        
        
                        })
                    
                    
                })
    
            })

         }
        

    
       


    },
    getAllOrders: (req, res) => {

        let uid = req.session.userDetails._id

        userHelpers.getAllOrders(uid).then((allOrders) => {

            if (allOrders) {
                console.log('all orders')
                console.log(allOrders);
                console.log('order geting successfull');
                let userdata = req.session.userDetails
                res.render('user/orders', { userdata, allOrders })
            }


        })
    },
    getViewmore: (req, res) => {

        let id = req.params.id
        userHelpers.getOneOrder(id).then((orders) => {


            products = orders.products
            address = orders.address
            total = orders.total_amount
            orderStatus=orders.order_status
            console.log('heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
            console.log(products)
            console.log(address)
            console.log(total)


            let userdata = req.session.userDetails
            res.render('user/orderProductDetails', { userdata, products, address, total ,id ,orderStatus})


        })
    },
    getDeleteAddress:(req,res)=>{

        const previousUrl = req.header('Referer');
        console.log('heloooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo')
        console.log(req.params.id)
      
        let id=req.params.id
        userHelpers.deleteAddress(id).then((response)=>{

            if(response)
            {
                console.log('address delete succfull');
                res.redirect(previousUrl)

            }else{

                console.log('address not deleted ');
                res.redirect(previousUrl)



            }
        })
       

    },
    getOrderSuccess:(req,res)=>{


        let userdata=req.session.userDetails
        res.render('user/orderSuccess',{userdata})
    },
    postVerifyPayment:(req,res)=>{


        console.log('verify payment successfull')
        console.log(req.body);

       
        userHelpers.verifyPayment(req.body).then((response)=>{
          
            if(response)
            {

                let orderId=req.body['order[receipt]'];
                
                userHelpers.changePaymentStatus(orderId).then((response)=>{

                      
                    res.json(response)
                })
                
            }


        })
    },
    postApplyCoupon:(req,res)=>{

        const previousUrl = req.header('Referer');

        let total=req.body.total
        let couponCode=req.body.code
        let currentDate=new Date()
        let temp=0
        let discountAmount=0
        console.log('coupon body',req.body)
        userHelpers.checkCoupenExist(couponCode).then((response)=>{
           if(response)
           {

            expiryDate= new Date(response.expiryDate)
           

            req.session.minimumPurchaseAmount=response.minimumPurchasingAmount

            if(expiryDate.getTime()<currentDate.getTime())
            {
                console.log('coupon expired')
                req.session.expire=true
                
                res.redirect(previousUrl)

            }else{

                console.log('coupen is valid')

                console.log('minimun purchasing amount',response.minimumPurchasingAmount)
                if(Number(total)>Number(response.minimumPurchasingAmount))
                {
                    

                // exmaple:- find the 15 percentage of 50000 (15/100)=0.15 ---0.15*50000
                temp=Number(response.discount)/100
                discountAmount=Number(temp)*Number(total)
                console.log(discountAmount)

                if(Number(discountAmount)>Number(response.limitAmount))
                {
                    discountAmount=Number(response.limitAmount)

                    total=Number(total)-Number(discountAmount)

                    console.log('limitamount=discountamountyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy')
                    console.log(total)
                    
                    couponTotal=total
                    req.session.coupon=couponTotal
                    console.log('coupontotal',couponTotal)

                    req.session.couponCodeErr=false
                    req.session.minimumPurchase =false 

                    req.session.expire=false

                    res.redirect(previousUrl)


                }else{

                    total=total-discountAmount
                    console.log('total')
                    console.log(total)
                    couponTotal=total
                    req.session.coupon=couponTotal

                    req.session.couponCodeErr=false
                    req.session.minimumPurchase =false 

                    req.session.expire=false
                    res.redirect(previousUrl)

                }

                }
                else
                {
                    req.session.couponCodeErr=false
                    req.session.minimumPurchase =true 
                    req.session.expire=false
                    console.log('sorry your purchase is not enough , please purchase then minums Amount')
                    res.redirect(previousUrl)
                }
                
            }
           }else{
            console.log('the coupen code is not exisiting')
             
            req.session.minimumPurchase =false 
            req.session.couponCodeErr=true
            req.session.expire=false

            res.redirect(previousUrl)
           }

        })
    },
    getRemoveCoupon:(req,res)=>{


        const previousUrl=req.header('Referer')
        req.session.coupon=null
        res.redirect(previousUrl)
        
    },
    getCancelOrder:(req,res)=>{

         previousUrl=req.header('Referer')

        let oid=req.params.id
        userHelpers.cancelOrder(oid).then((response)=>{
           
        res.redirect(previousUrl)
            

        })
    },
    getReturnOrder:(req,res)=>{

        previousUrl=req.header('Referer')

       let oid=req.params.id
       userHelpers.returnOrder(oid).then((response)=>{
          
       res.redirect(previousUrl)
           

       })
   },
   getWallet:(req,res)=>{

    let userdata=req.session.userDetails

     res.render('user/wallet',{userdata})
   }
    




}   