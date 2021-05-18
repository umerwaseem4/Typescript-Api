import mongoose, { Schema, Document } from "mongoose";

interface ITodo extends Document {
  user: any;
  title: string;
  completed: boolean;
}

const TodoSchema: Schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model<ITodo>("todo", TodoSchema);
export default User;
