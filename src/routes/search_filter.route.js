const express=require('express');
const router=express.Router();
const FilterController=require('../controllers/search_filter_controller.js');
router.get('/filter',FilterController.renderFoods)
router.get('/filter/result',FilterController.getFoods);
module.exports=router;