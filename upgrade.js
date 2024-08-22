import mongoose from "mongoose";

const upgradeSchema = new mongoose.Schema({
  user: String,
  sponcerId: String,
  amount: String,
  time: String,
  newMatrix: String,
});
export default mongoose.model("upgrade", upgradeSchema);
