let userHelpers = require('../../helpers/user-helpers')
let adminHelpers = require('../../helpers/admin-helpers')
const { ObjectId } = require('mongodb')


module.exports={

 
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
  
}