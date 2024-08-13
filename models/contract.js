import { mongoose } from "mongoose";
const blockSchema = new mongoose.Schema(
  {
    newUserId: {
      type: String,
      required: true,
      unique: true,
    },
    sponserId: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Block = mongoose.model("Block", blockSchema);
export default Block;
