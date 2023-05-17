let userHelpers = require('../../helpers/user-helpers')
let adminHelpers = require('../../helpers/admin-helpers')
const { ObjectId } = require('mongodb')


module.exports={

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

}