const router = require('express').Router();
const authController = require('../controllers/authController')
const validator = require('../middleware/validator')
router.post('/register',validator.regUser,authController.regUser);
router.post('/login',validator.loginUser,authController.loginUser)
module.exports=router;
