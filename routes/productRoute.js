const router = require('express').Router();
const productController = require('../controllers/productController');
const {verifyUser} = require('../middleware/verifyUser')
const {isAdmin} = require('../middleware/isAdmin')
const validator = require('../middleware/validator');


router.get('/products',verifyUser,productController.getAllProducts);
router.get('/products/:id',verifyUser,productController.getProductById);
router.get('/active/products',verifyUser,productController.getActiveProducts);
router.get('/products/category/:id',verifyUser,productController.getProductsByCategoryId);
router.post('/products',validator.createProductSchema,verifyUser,isAdmin(['admin']),productController.createProduct);
router.put('/products/:id',validator.updateProductSchema,verifyUser,isAdmin(['admin']),productController.updateProduct);
router.put('/json/:id',verifyUser,isAdmin(['admin']),productController.JsonData);
router.put('/products/soft/:id',verifyUser,isAdmin(['admin']),productController.softDelete);
router.delete('/products/:id',verifyUser,isAdmin(['admin']),productController.deleteProduct);




module.exports=router;