var express = require('express');
var router = express.Router();
let userController=require('../controllers/user-controller')

/* GET users listing. */

//get signup page
router.get('/signUp',userController.getSignUp)

//get home page
router.get('/',userController.getHome)

router.post('/signup-submit',userController.signupSubmit)
module.exports = router;
