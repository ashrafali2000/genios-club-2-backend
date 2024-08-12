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
  .connect(``)
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
    "event NewUser(address _user, address _sponcer, uint256 amount, uint256 time)",
});

const events = await getContractEvents({
  contract: myContract,
  fromBlock: 26541113n,
  toBlock: 26548931n,
  events: [preparedEvent],
});

const response = {
  events: events[0],
};

// Convert BigInt values to strings for serialization
const serializedResponse = JSON.stringify(response.events.args, (key, value) =>
  typeof value === "bigint" ? value.toString() : value
);
console.log(`These are all the events that we need:=> ${serializedResponse}`);
app.get("/", function (req, res) {
  res.send(`Server is running.....and...Data.....${serializedResponse}`);
});
app.listen(3000, () => {
  console.log(`These are all the events that we need:=> ${serializedResponse}`);
});
