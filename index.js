import {
  createThirdwebClient,
  getContract,
  prepareEvent,
  getContractEvents,
} from "thirdweb";
import express, { json } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { defineChain } from "thirdweb/chains";
import { ethers } from "ethers";
import "dotenv/config";
const app = express();
app.use(cors());
app.use(express.json());

// create the client with your clientId, or secretKey if in a server environment
const client = createThirdwebClient({
  clientId: process.env.CLIENT_ID,
});

const DbPassword = process.env.USER_PASSWORD1;
mongoose
  .connect(
    `mongodb+srv://ashrafalikakozai9876:${DbPassword}@cluster0.u1l69.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    console.log("DataBase is connected--->");
  })
  .catch((err) => {
    console.log("err------>", err);
  });
// connect to your contract
const myContract = getContract({
  client,
  chain: defineChain(4002),
  address: process.env.CONTRACT_ADDRESS,
});

const preparedEvent = prepareEvent({
  myContract,
  signature:
    "event NewUser(uint _user, uint _sponcer, uint256 amount, uint256 time)",
});


const events = await getContractEvents({
  contract: myContract,
  fromBlock: 26562743n,
  toBlock: 26562797n,
  events: [preparedEvent],
});

const response = {
  events: events[0],
};

// Convert BigInt values to strings for serialization
let serializedResponse;
setTimeout(() => {
  serializedResponse = JSON.stringify(response?.events?.args, (key, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
  console.log(`These are all the events that we need:=> ${serializedResponse}`);
}, 2000);

app.get("/", function (req, res) {
  res.send(`Server is running.....and...Data.....${serializedResponse}`);
});
app.use("/block", function (req, res) {
  res.send(`Server is running.....and...Data.....${serializedResponse}`);
});
app.listen(3001, () => {
  console.log(
    `These are all the events that we need:=> ${serializedResponse} ${3001}`
  );
});
