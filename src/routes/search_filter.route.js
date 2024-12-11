const express=require('express');
const router=express.Router();
const FilterController=require('../controllers/search_filter_controller.js');
router.get('/filter',FilterController.renderFoods);
router.get('/filter/result',FilterController.getFoods);
router.get('/filter/submit',FilterController.getFoodsbyBranch);
// Route lấy tất cả khu vực
router.get('/api/areas', FilterController.getAllAreas);

// Route lấy chi nhánh theo khu vực
router.get('/api/branches/:areaId', FilterController.getBranchesByArea);
module.exports=router;