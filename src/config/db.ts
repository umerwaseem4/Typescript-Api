import mongoose from "mongoose";
import colors from "colors";

const connectDB = async (): Promise<any> => {
  try {
    await mongoose.connect("mongodb://localhost:27017/todo-full-app", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
      useCreateIndex: true,
    });
    console.log(colors.bgGreen("Mongodb Connected"));
  } catch (error) {
    console.log(colors.bgRed(error));
  }
};

export default connectDB;
