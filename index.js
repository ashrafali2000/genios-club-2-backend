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
app.get("/", function (req, res) {
  res.send("Server is running...");
});

// create the client with your clientId, or secretKey if in a server environment
const client = createThirdwebClient({
  // secretKey: "dfKqHzi2rb5RpeidV0ZY0pClyhp834GjDcFUwbNBrJQ4mxmtpoi1zvasSgIwUh-pfwT2FTOS45CeVGI4m2rw0g",
  clientId: process.env.CLIENT_ID,
});

// Access the provider from the client (it's an ethers.js provider)
// const provider = new ethers.providers.JsonRpcProvider(
//   "https://rpc.testnet.fantom.network"
// );

// const getCurrentBlockNumber = async () => {
//   try {
//     const blockNumber = await provider.getBlockNumber();
//     console.log("Current Block Number:", blockNumber);
//     return blockNumber;
//   } catch (error) {
//     console.error("Error fetching block number:", error);
//   }
// };

// getCurrentBlockNumber();
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
app.listen(3000, () => {
  console.log("Server is running on Port 3000");
});
