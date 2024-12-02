const FilterModel = require('../models/product.model.js');

class FilterController{
   static async renderFoods(req,res){
    try {
        const {branch,category,price,search}=req.query;
        console.log("Received filters:", req.query);

        let filters={
            branch:branch || 'all', //nhận từ client
            category:category||'all',
            price :price? parseInt(price):null,
            search:search || ''

        };
        let foods=await FilterModel.searchFoods(filters);
        res.json({foods,filters});
    }catch(error){
        res.status(500).json({message:'Error fetching food data',error});
    }
   }

   
}
module.exports=FilterController;