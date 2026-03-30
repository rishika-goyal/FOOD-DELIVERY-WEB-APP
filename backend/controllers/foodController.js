import foodModel from "../models/foodModel.js";
import fs from "fs";

//add food item
const addFood = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.json({ success: false, message: "Image missing" });
    }

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      image: req.file.filename
    });

    await food.save();

    res.json({ success: true, message: "Food Added" });

  } catch (error) {
    console.log("REAL ERROR:", error);
    res.json({ success: false, message: error.message });
  }
};
//all food list
const listFood=async(req, res)=>{
  try {
    const foods=await foodModel.find({});
    res.json({success:true, data:foods})
  } catch (error) {
    console.log(error);
    res.json({success:false, message:"Error"})
  }
}

//remove food items
const removeFood=async (req,res)=>{
  try {
    const food=await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, ()=>{})

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({success:true, message:"Food Removed"})
  } catch (error) {
    console.log(error);
    res.json({success:false, message:"Error"})
  }
}


export { addFood, listFood, removeFood}