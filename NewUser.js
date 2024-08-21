import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  user: String,
  sponcerId: String,
  amount: String,
  time: String,
});
export default mongoose.model("newUser", userSchema);
