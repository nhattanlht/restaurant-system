const express=require('express');
const router=express.Router();
const CustomersController=require('../controllers/customers.controller.js');


router.get('/menu',CustomersController.renderFoods);
router.get('/menu/result',CustomersController.getFoods);
router.get('/menu/submit',CustomersController.getFoodsbyBranch);
// Route lấy tất cả khu vực
router.get('/api/areas', CustomersController.getAllAreas);

// Route lấy chi nhánh theo khu vực
router.get('/api/branches/:areaId', CustomersController.getBranchesByArea);

// Route lấy chi nhánh 
router.get('/api/branches', CustomersController.getBranches);
router.get('/api/categories', CustomersController.getCategories);



module.exports=router;