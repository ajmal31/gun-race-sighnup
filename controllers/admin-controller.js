let userHelpers = require('../helpers/user-helpers')
let adminHelpers = require('../helpers/admin-helpers')
let db = require('../config/connection')
let collections = require('../config/collections')
module.exports = {
  getLogin: (req, res) => {
    let loginErr = req.session.loginErr
    req.session.loginErr = false
    res.render('admin/login', { loginErr })
  },
  postLogin: (req, res) => {
    adminHelpers.loginData(req.body).then((data) => {
      if (data) {

        req.session.admin = true
        req.session.loginErr = false
        res.redirect('/admin')
      }
      else {
        req.session.admin = false
        req.session.loginErr = true
        res.redirect('/admin/login')
      }
    })
  },
  getHome: (req, res) => {

    res.render('admin/home')
  },
  getLogout: (req, res) => {
    req.session.admin = false
    res.redirect('/admin')
  },
  viewProducts: (req, res) => {
    adminHelpers.getAllProducts().then((data) => {
      if (data) {

        res.render('admin/viewProducts', { data })
      }
    })

  },
  getAddProducts: (req, res) => {
    adminHelpers.getAllCategories().then((data) => {
      if (data) {
        console.log('category getting successfully')
        console.log(data)
        res.render('admin/addProducts', { data })
      }

    })

  },
  getAllUsers: (req, res) => {
    adminHelpers.getAllUsers().then((data) => {
      if (data) {
        console.log(data)
        res.render('admin/users', { data })
      }
    })

  },

  postAddProducts: (req, res) => {

    let images = req.files.map(a => a.filename)
    adminHelpers.addProducts(req.body, images)

    console.log(images)
    res.redirect('/admin')
  },

  deleteProduct: (req, res) => {

    adminHelpers.deleteProduct(req.params).then((data) => {

      if (data) {
        res.redirect('/admin/viewProducts')
      }
    })
  },
  getEditProduct: (req, res) => {
    adminHelpers.getOneProduct(req.params).then((data) => {
      if (data) {
        adminHelpers.getAllCategories().then((result) => {
          if (data) {
            console.log('ohohohohohohohohohohoh')
            console.log(data)
            console.log(result);
            res.render('admin/editProducts', { data, result })
          }
        })

      }
    })

  },
  postUpdateProduct: (req, res) => {
    console.log('updated product details checking proccess')
    console.log(req.body)
    console.log(req.params.id)
    console.log(req.files)
    let images = req.files.map(a => a.filename)
    console.log(images)
    adminHelpers.updateProduct(req.body, req.params.id, images).then((data) => {
      if (data) {
        console.log('done')
        res.redirect('/admin/viewProducts')
      }
    })
  },
  blockUser: (req, res) => {
    let pid = req.params.id
    adminHelpers.blockUser(pid).then((data) => {
      if (data) {
        req.session.user = false
        console.log('user blocking successfully')
        res.redirect('/admin/users')
      }
    })
  },
  unBlockUser: (req, res) => {
    let pid = req.params.id
    console.log(pid)
    adminHelpers.unBlockUser(pid).then((data) => {
      if (data) {
        req.session.user = true
        res.redirect('/admin/users')
      }
    })
  },
  getCategories: (req, res) => {
    adminHelpers.getAllCategories().then((response) => {
      if (response) {
        let catExist = req.session.catExist
        req.session.catExist = false
        res.render('admin/categories', { response, catExist })
      }
    })

  },
  postAddCategories: (req, res) => {
    console.log('imageeeeeeeeee')
    console.log(req.body)
    let image = req.files.map(a => a.filename)
    console.log(image);

    adminHelpers.addCategories(req.body, image).then((data) => {

      if (data) {
        req.session.catExist = false
        res.redirect('/admin/categories')
      } else {
        console.log('category not added')
        req.session.catExist = true
        res.redirect('/admin/categories')
      }
    })
  },
  getEditCategory: (req, res) => {


    adminHelpers.findOneCategory(req.params.id).then((data) => {
      if (data) {

        res.render('admin/editCategory', { data })
      } else {
        console.log('category finding mission failed')
      }
    })
  },
  postUpdateCategory: (req, res) => {
    let image = req.files.map(a => a.filename)

    adminHelpers.updateCategory(req.body, req.params.id, image).then((data) => {
      if (data) {
        console.log('category already exist');
        req.session.catExist = true
        res.redirect('/admin/categories')
      } else {
        // console.log('category updating failed')
        console.log('category updated succesfully')
        req.session.catExist = false
        res.redirect('/admin/categories')
      }
    })
  },
  getDeleteCategory: (req, res) => {
    adminHelpers.deleteCategory(req.params.id).then((data) => {
      if (data) {
        console.log('category deleted successfully')
        res.redirect('/admin/categories')
      }
    })
  },
  viewOrders: (req, res) => {


    adminHelpers.viewOrders().then((allOrders) => {
      //session pending
      console.log('response', allOrders)

      allOrders = allOrders.reverse()
      res.render('admin/orders', { allOrders })


    })
  },
  getViewMore: (req, res) => {

    let id = req.params.id

    userHelpers.getOneOrder(id).then((orders) => {




      products = orders.products
      address = orders.address
      total = orders.total_amount



      res.render('admin/orderProductDetails', { products, address, total, id })

    })
  },
  postChangeOrderStatus: (req, res) => {

    let status = req.body.status
    let id = req.params.id
    console.log('status')
    console.log(id)
    console.log(status)

    adminHelpers.changeOrderStatus(id, status).then((response) => {

      res.redirect('/admin/viewOrders')

    })
  },
  getAddCoupon: (req, res) => {
    console.log()

    adminHelpers.getAllCoupons().then((response)=>{

      res.render('admin/coupon',{response})
    })
    
  },
  postAddCoupon: (req, res) => {


    console.log('coupon details')
    console.log(req.body)

    adminHelpers.addCoupon(req.body).then((response) => {

      res.redirect('/admin/coupon')
    })
  },
  getSalesReport: (req, res) => {


    res.render('admin/salesreport')
  },
  report: (req, res) => {

    console.log('report')
    console.log(req.body)
    let start = req.body.start
    let end = req.body.end

    adminHelpers.getSales(start, end).then((response) => {

      res.render('admin/report', { response })

    })

  },
  getPremiumCoupen: (req, res) => {

    let temp = [];
    let allProductsName = 0
    adminHelpers.getAllCategories().then((response) => {

      adminHelpers.getAllProducts().then((allProducts) => {

        console.log('allproducts', allProducts)

        
        let allProductsName = sample();

        function sample() {
          for (let i = 0; i < allProducts.length; i++) {
            console.log(allProducts[i].title);
            temp.push(allProducts[i].title); // Corrected spelling of 'title'
            console.log(temp);
          }
          return temp;
        }

       res.render('admin/premiumCoupon',{response,allProductsName})


      })



    })

  },
  postPremiumAddCoupon:(req,res)=>{
    console.log('premimum coupon details')
    console.log(req.body)
  },
  getProductsListing:(req,res)=>{

    adminHelpers.getAllProducts().then((allProducts)=>{

      res.render('admin/listingProducts-offer',{allProducts})
    })
  },
  getMakeOffer:(req,res)=>{

    let pid=req.params.id
     adminHelpers.getOneProduct(pid).then((data)=>{
      res.render('admin/add-offer',{data})

    })
    
  },
  postAddOffer:(req,res)=>{
   previuosUrl=req.header('Referer')
   console.log(req.params.id)
    console.log(req.body)
    let pid=req.params.id
    let offerPrice=req.body.offerprice
    let offerExpire=req.body.offerexpire
    let images=[]
    adminHelpers.addOfferPriceProduct(pid,offerPrice,offerExpire).then((response)=>{

      res.redirect(previuosUrl)
    })
    
    
  },

  getCategoryOffer:(req,res)=>{

    let catId=req.params.id
    console.log(catId)
    res.render('admin/categoryOffer',{catId})
  },
  postAddCatOffer:(req,res)=>{

    let catId=req.params.id
    let percentage=req.body.percentage
    let date=req.body.offerexpire
   
      
      adminHelpers.findOneCategory(catId).then((category)=>{

        catName=category.name
        
        adminHelpers.addOfferCat(catName,percentage,date).then((response)=>{
       

        })

      
      })
      
    
  }
  
}






