import mongoose from "mongoose";

export const connectDB=async()=>{
  await mongoose.connect("mongodb+srv://greatstack:divyanshu@cluster0.lk5gjlo.mongodb.net/food-del")
  .then(()=>console.log("DB Connected"));
}