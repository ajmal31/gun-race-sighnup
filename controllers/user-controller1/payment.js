let userHelpers = require('../../helpers/user-helpers')
let adminHelpers = require('../../helpers/admin-helpers')
const { ObjectId } = require('mongodb')

module.exports={

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
}