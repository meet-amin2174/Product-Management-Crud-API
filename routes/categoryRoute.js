const router = require('express').Router();
const categoryController = require('../controllers/categoryController');
const {verifyUser} = require('../middleware/verifyUser')
const {isAdmin} = require('../middleware/isAdmin')
const validator = require('../middleware/validator');

router.get('/categories',verifyUser,categoryController.getAllCategories ); 
router.get('/categories/:id',verifyUser,categoryController.getCategoryById);
router.post('/categories',validator.requireName,verifyUser,isAdmin(['admin']),categoryController.createCategory);
router.put('/categories/:id',validator.requireName,verifyUser,isAdmin(['admin']),categoryController.updateCategory);
router.delete('/categories/:id',verifyUser,isAdmin(['admin']),categoryController.deleteCategory);
module.exports = router