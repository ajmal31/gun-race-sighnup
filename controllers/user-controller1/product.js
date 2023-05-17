let userHelpers = require('../../helpers/user-helpers')
let adminHelpers = require('../../helpers/admin-helpers')
const { ObjectId } = require('mongodb')


module.exports={
    getHome: (req, res) => {

        adminHelpers.getAllCategories().then((data) => {

            let userdata = req.session.userDetails
            res.render('user/home', { data, userdata })
        })

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
    viewProductDetails: (req, res) => {

        let pid = req.params.id

        adminHelpers.getOneProduct(pid).then((data) => {

            console.log('mission success')
            console.log(data);
            let userdata = req.session.userDetails

            res.render('user/productDetails', { userdata, data })

        })
    },
    getAllProducts: (req, res) => {
        adminHelpers.getAllProducts().then((response) => {
            if (response) {
                let userdata = req.session.userDetails
                res.render('user/ViewFullProducts', { response, userdata })
            }
        })
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

}