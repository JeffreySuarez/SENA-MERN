import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://jsuarez:Esteban2212@cluster0.f3opeuk.mongodb.net/");
    console.log(">>> DB is connected");
  } catch (error) {
    console.log("error connecting to");
  }
};
