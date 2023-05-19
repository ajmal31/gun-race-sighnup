var express = require('express');
const adminController = require('../controllers/admin-controller');
var router = express.Router();
let adminControllers=require('../controllers/admin-controller')
let multer = require('../helpers/multer')
const adminAuth=require('../auth/adminAuth')

//middle ware checking all requests


//GET LOGIN
router.get('/login',adminControllers.getLogin)


//POST LOGIN
router.post('/adminLoginDetails',adminControllers.postLogin)
//GET HOME
router.get('/',adminControllers.getHome)

router.get('/logout',adminController.getLogout)

router.use(adminAuth.adminAuthentication)

//GET VIEW PRODUCTS
router.get('/viewProducts',adminControllers.viewProducts)

//GET ADD_PRODUCTS
router.get('/addProducts',adminControllers.getAddProducts)

//GET VIEW USERS
router.get('/users',adminControllers.getAllUsers)

//POST ADD PRODUCT
router.post('/addProduct',multer.uploads.array('images', 4),adminControllers.postAddProducts)

//DELETE PRODUCT
router.get('/deleteProduct/:id',adminControllers.deleteProduct)

// GET EDIT PRODUCTS
router.get('/editProduct/:id',adminControllers.getEditProduct)

//POST EDITED DATA
router.post('/updateProduct/:id',multer.uploads.array('images',4),adminControllers.postUpdateProduct)

//USER BLOCKING
router.get('/blockUser/:id',adminControllers.blockUser)

//USER UNBLOCKING
router.get('/unBlockUser/:id',adminController.unBlockUser)

///GET ADD_CATEGORY
router.get('/categories',adminController.getCategories)

//POST CATEGORY
router.post('/addCategories',multer.uploads.array('image1',1) ,adminController.postAddCategories)

//GET EDIT CATGEGORY
router.get('/editCategory/:id',adminController.getEditCategory)

//POST EDITED DATA
router.post('/updateCategory/:id',multer.uploads.array('image1',1),adminController.postUpdateCategory)

//GET DELETE CATEGORY
router.get('/deleteCategory/:id',adminController.getDeleteCategory)

//VIEW ORDERS
router.get('/viewOrders',adminController.viewOrders)

//ORDERS PRODUCTS DETAILS 
router.get('/viewMore/:id',adminController.getViewMore)

//CHANGE ORDER STATUS
router.post('/changeOrderStatus/:id',adminController.postChangeOrderStatus)

//GET ADD COUPEN
router.get('/coupon',adminController.getAddCoupon)

//POST ADD COUPEN
router.post('/addCoupon',adminController.postAddCoupon)

router.get('/salesReport',adminController.getSalesReport)

router.post('/report',adminController.report)

router.get('/productsListing',adminController.getProductsListing)

router.get('/makeOffer/:id',adminController.getMakeOffer)

router.post('/addOffer/:id',adminController.postAddOffer)

router.get('/categoryOffer/:id',adminController.getCategoryOffer)

router.post('/addCategoryOffer/:id',adminController.postAddCatOffer)

//DELETE COUPON
router.get('/deleteCoupon/:id',adminController.deleteCoupon)


module.exports = router;
