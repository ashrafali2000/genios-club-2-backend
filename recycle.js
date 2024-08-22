import mongoose from "mongoose";

const recycleSchema = new mongoose.Schema({
  user: String,
  sponcerId: String,
  amount: String,
  time: String,
  newMatrix: String,
});
export default mongoose.model("recycle", recycleSchema);
