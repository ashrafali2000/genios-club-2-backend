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

// const DbPassword = process.env.USER_PASSWORD1;
// mongoose
//   .connect(
//     `mongodb+srv://ashrafalikakozai9876:${DbPassword}@cluster0.u1l69.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
//   )
//   .then(() => {
//     console.log("DataBase is connected--->");
//   })
//   .catch((err) => {
//     console.log("err------>", err);
//   });
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

// States
class Eventual {
  constructor(user, sponcer, amount, time) {
    this.user = user;
    this.sponcer = sponcer;
    this.amount = amount;
    this.time = time;
  }
}

var even = [];
var fromBlock = BigInt(26562743);

const events = await getContractEvents({
  contract: myContract,
  fromBlock: fromBlock,
  toBlock: fromBlock + BigInt(425),
  events: [preparedEvent],
});

// const response = {
//   events: events[0],
// };

let response;
let num1;
let num2;
let num3;
let num4;
// Convert BigInt values to strings for serialization
// let serializedResponse;

function run1() {
  for (let i = 0; i < events.length; i++) {
    response = {
      events: events[i],
    };
    // Convert BigInt values to strings for serialization
    const User = JSON.stringify(response.events.args._user, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    const Sponcer = JSON.stringify(
      response.events.args._sponcer,
      (key, value) => (typeof value === "bigint" ? value.toString() : value)
    );

    const Amount = JSON.stringify(response.events.args.amount, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    const Time = JSON.stringify(response.events.args.time, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );
    var en = new Eventual(User, Sponcer, Amount, Time);
    // console.log("this =>", en);
    // To DataBase
    even.push(en);
  }
}
function run2() {
  for (let i = 0; i < even.length; i++) {
    let userNumber = JSON.stringify(even[i].user, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );
    let SponcerNumber = JSON.stringify(even[i].sponcer, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );
    let AmountNumber = JSON.stringify(even[i].amount, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );
    let TimeNumber = JSON.stringify(even[i].time, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    num1 = Number(userNumber.replace(/[^0-9]/g, ""));
    num2 = Number(SponcerNumber.replace(/[^0-9]/g, ""));
    num3 = Number(AmountNumber.replace(/[^0-9]/g, ""));
    num4 = Number(TimeNumber.replace(/[^0-9]/g, ""));

    console.log(`New User:=> ${num1}, ${num2}, ${num3}, ${num4}`);
  }
  console.log("1: ", fromBlock.toString());
  // to Database
  fromBlock = fromBlock + BigInt(425);
  console.log("2: ", fromBlock.toString());
}

setInterval(() => {
  run1();
  run2();
}, 800);

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
