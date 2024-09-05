// import {
//   createThirdwebClient,
//   getContract,
//   prepareEvent,
//   getContractEvents,
// } from "thirdweb";
// import express, { json } from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import { defineChain } from "thirdweb/chains";
// import { ethers } from "ethers";
// import "dotenv/config";
// const app = express();
// app.use(cors());
// app.use(express.json());

// // create the client with your clientId, or secretKey if in a server environment
// const client = createThirdwebClient({
//   clientId: process.env.CLIENT_ID,
// });

// // const DbPassword = process.env.USER_PASSWORD1;
// // mongoose
// //   .connect(
// //     `mongodb+srv://ashrafalikakozai9876:${DbPassword}@cluster0.u1l69.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
// //   )
// //   .then(() => {
// //     console.log("DataBase is connected--->");
// //   })
// //   .catch((err) => {
// //     console.log("err------>", err);
// //   });
// // connect to your contract
// const myContract = getContract({
//   client,
//   chain: defineChain(4002),
//   address: process.env.CONTRACT_ADDRESS,
// });

// const preparedEvent = prepareEvent({
//   myContract,
//   signature:
//     "event NewUser(uint _user, uint _sponcer, uint256 amount, uint256 time)",
// });

// // States
// class Eventual {
//   constructor(user, sponcer, amount, time) {
//     this.user = user;
//     this.sponcer = sponcer;
//     this.amount = amount;
//     this.time = time;
//   }
// }

// var even = [];
// var fromBlock = BigInt(26562743);

// const events = await getContractEvents({
//   contract: myContract,
//   fromBlock: fromBlock,
//   toBlock: fromBlock + BigInt(425),
//   events: [preparedEvent],
// });

// // const response = {
// //   events: events[0],
// // };

// let response;
// let num1;
// let num2;
// let num3;
// let num4;
// // Convert BigInt values to strings for serialization
// // let serializedResponse;

// function run1() {
//   for (let i = 0; i < events.length; i++) {
//     response = {
//       events: events[i],
//     };
//     // Convert BigInt values to strings for serialization
//     const User = JSON.stringify(response.events.args._user, (key, value) =>
//       typeof value === "bigint" ? value.toString() : value
//     );

//     const Sponcer = JSON.stringify(
//       response.events.args._sponcer,
//       (key, value) => (typeof value === "bigint" ? value.toString() : value)
//     );

//     const Amount = JSON.stringify(response.events.args.amount, (key, value) =>
//       typeof value === "bigint" ? value.toString() : value
//     );

//     const Time = JSON.stringify(response.events.args.time, (key, value) =>
//       typeof value === "bigint" ? value.toString() : value
//     );
//     var en = new Eventual(User, Sponcer, Amount, Time);
//     // console.log("this =>", en);
//     // To DataBase
//     even.push(en);
//   }
// }
// function run2() {
//   for (let i = 0; i < even.length; i++) {
//     let userNumber = JSON.stringify(even[i].user, (key, value) =>
//       typeof value === "bigint" ? value.toString() : value
//     );
//     let SponcerNumber = JSON.stringify(even[i].sponcer, (key, value) =>
//       typeof value === "bigint" ? value.toString() : value
//     );
//     let AmountNumber = JSON.stringify(even[i].amount, (key, value) =>
//       typeof value === "bigint" ? value.toString() : value
//     );
//     let TimeNumber = JSON.stringify(even[i].time, (key, value) =>
//       typeof value === "bigint" ? value.toString() : value
//     );

//     num1 = Number(userNumber.replace(/[^0-9]/g, ""));
//     num2 = Number(SponcerNumber.replace(/[^0-9]/g, ""));
//     num3 = Number(AmountNumber.replace(/[^0-9]/g, ""));
//     num4 = Number(TimeNumber.replace(/[^0-9]/g, ""));

//     console.log(`New User:=> ${num1}, ${num2}, ${num3}, ${num4}`);
//   }
//   console.log("1: ", fromBlock.toString());
//   // to Database
//   fromBlock = fromBlock + BigInt(425);
//   console.log("2: ", fromBlock.toString());
// }

// setInterval(() => {
//   run1();
//   run2();
// }, 800);

// app.get("/", function (req, res) {
//   res.send(`Server is running.....and...Data.....${serializedResponse}`);
// });
// app.use("/block", function (req, res) {
//   res.send(`Server is running.....and...Data.....${serializedResponse}`);
// });
// app.listen(3001, () => {
//   console.log(
//     `These are all the events that we need:=> ${serializedResponse} ${3001}`
//   );
// });

// new Code
import mongoose from "mongoose";
import newUser from "./NewUser.js";
import {
  createThirdwebClient,
  getContract,
  prepareEvent,
  getContractEvents,
} from "thirdweb";
import express, { json } from "express";
import cors from "cors";
import { defineChain } from "thirdweb/chains";
import "dotenv/config";
import blockNumber from "./BlockFetcher.js";
import upgrade from "./upgrade.js";
import recycle from "./recycle.js";

// *** State values ***
// server
const app = express();
app.use(cors());
app.use(express.json());
const router = express.Router();
var fromBlock = 26658274n;
var data;

// *** contract ***
const client = createThirdwebClient({
  clientId: process.env.CLIENT_ID,
});
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
const UpgradeEvent = prepareEvent({
  myContract,
  signature:
    "event Upgrade(uint _user, uint _sponcer, uint amount, uint newMatrix, uint time)",
});
const RecycledEvent = prepareEvent({
  myContract,
  signature:
    "event Recycled(uint _user, uint _sponcer, uint amount, uint newMatrix, uint time)",
});

const events = await getContractEvents({
  contract: myContract,
  fromBlock: fromBlock,
  toBlock: blockNumber,
  events: [preparedEvent],
});
const UpgradeEvents = await getContractEvents({
  contract: myContract,
  fromBlock: fromBlock,
  toBlock: blockNumber,
  events: [UpgradeEvent],
});
const RecycledEvents = await getContractEvents({
  contract: myContract,
  fromBlock: fromBlock,
  toBlock: blockNumber,
  events: [RecycledEvent],
});

// mongoose
const clientOptions = {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};

const FetchInfo = async () => {
  let value1 = [];
  let value2 = [];
  let value3 = [];
  let value4 = [];
  // try {
  const run = async () => {
    for (let i = 0; i < events.length; i++) {
      // fetch events
      value1.push(
        JSON.stringify(events[i].args._user, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
      value2.push(
        JSON.stringify(events[i].args._sponcer, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );

      value3.push(
        JSON.stringify(events[i].args.amount, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );

      value4.push(
        JSON.stringify(events[i].args.time, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
    }
    let CurrentBlockNumber;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-API-Key": process.env.API_BLOCK_FETCHER,
      },
    };

    await fetch(
      "https://svc.blockdaemon.com/universal/v1/fantom/testnet/sync/block_number",
      options
    )
      .then((response) => (CurrentBlockNumber = response.json()))
      .then(
        (response) => (
          (CurrentBlockNumber = BigInt(Number.response)),
          console.log(fromBlock, CurrentBlockNumber)
        )
      )
      .catch((err) => console.error(err));
    fromBlock = CurrentBlockNumber;
  };
  const run2 = async () => {
    for (let i = 0; i < events.length + 1; i++) {
      if (i < events.length) {
        // Create a new user and save to the database
        const user = new newUser({
          user: value1[i],
          sponcerId: value2[i],
          amount: value3[i],
          time: value4[i],
        });
        await user.save().then(() => {
          console.log(
            `New user: ${value1[i]} => Sponcer: ${value2[i]} =  saved ✅ `
          );
        });
        value1.splice(i, -1);
        value2.splice(i, -1);
        value3.splice(i, -1);
        value4.splice(i, -1);
        // events.splice(i, -1);
      } else if (events.length == i) {
        while (events.length > 0) {
          events.pop();
          value1.pop();
          value2.pop();
          value3.pop();
          value4.pop();
        }
      }
    }
  };
  await run();
  await mongoose.connect(process.env.URL, clientOptions);

  console.log("Connected to MongoDB");
  await run2();
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
};
const FetchInfoUpgradeEvent = async () => {
  let value1 = [];
  let value2 = [];
  let value3 = [];
  let value4 = [];
  let value5 = [];
  // try {
  const run = async () => {
    for (let i = 0; i < UpgradeEvents.length; i++) {
      // fetch UpgradeEvents
      value1.push(
        JSON.stringify(UpgradeEvents[i].args._user, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
      value2.push(
        JSON.stringify(UpgradeEvents[i].args._sponcer, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );

      value3.push(
        JSON.stringify(UpgradeEvents[i].args.amount, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );

      value4.push(
        JSON.stringify(UpgradeEvents[i].args.time, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
      value5.push(
        JSON.stringify(UpgradeEvents[i].args.newMatrix, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
    }
    let CurrentBlockNumber;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-API-Key": process.env.API_BLOCK_FETCHER,
      },
    };

    await fetch(
      "https://svc.blockdaemon.com/universal/v1/fantom/testnet/sync/block_number",
      options
    )
      .then((response) => (CurrentBlockNumber = response.json()))
      .then(
        (response) => (
          (CurrentBlockNumber = BigInt(Number.response)),
          console.log(fromBlock, CurrentBlockNumber)
        )
      )
      .catch((err) => console.error(err));
    fromBlock = CurrentBlockNumber;
  };
  const run2 = async () => {
    for (let i = 0; i < UpgradeEvents.length + 1; i++) {
      if (i < UpgradeEvents.length) {
        // Create a new user and save to the database
        const user = new upgrade({
          user: value1[i],
          sponcerId: value2[i],
          amount: value3[i],
          time: value4[i],
          newMatrix: value5[i],
        });
        await user.save().then(() => {
          console.log(
            `New user: ${value1[i]} => Sponcer: ${value2[i]} =  saved ✅ `
          );
        });
        value1.splice(i, -1);
        value2.splice(i, -1);
        value3.splice(i, -1);
        value4.splice(i, -1);
        // UpgradeEvents.splice(i, -1);
      } else if (UpgradeEvents.length == i) {
        while (UpgradeEvents.length > 0) {
          UpgradeEvents.pop();
          value1.pop();
          value2.pop();
          value3.pop();
          value4.pop();
        }
      }
    }
  };
  await run();
  // await mongoose.connect(process.env.URL, clientOptions);

  // console.log("Connected to MongoDB");
  // await run2();
  // await mongoose.disconnect();
  // console.log("Disconnected from MongoDB");
};
const FetchInfoRecycledEvent = async () => {
  let value1 = [];
  let value2 = [];
  let value3 = [];
  let value4 = [];
  let value5 = [];
  // try {
  const run = async () => {
    for (let i = 0; i < RecycledEvents.length; i++) {
      // fetch RecycledEvents
      value1.push(
        JSON.stringify(RecycledEvents[i].args._user, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
      value2.push(
        JSON.stringify(RecycledEvents[i].args._sponcer, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );

      value3.push(
        JSON.stringify(RecycledEvents[i].args.amount, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );

      value4.push(
        JSON.stringify(RecycledEvents[i].args.time, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
      value4.push(
        JSON.stringify(RecycledEvents[i].args.newMatrix, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
    }
    let CurrentBlockNumber;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-API-Key": process.env.API_BLOCK_FETCHER,
      },
    };

    await fetch(
      "https://svc.blockdaemon.com/universal/v1/fantom/testnet/sync/block_number",
      options
    )
      .then((response) => (CurrentBlockNumber = response.json()))
      .then(
        (response) => (
          (CurrentBlockNumber = BigInt(Number.response)),
          console.log(fromBlock, CurrentBlockNumber)
        )
      )
      .catch((err) => console.error(err));
    fromBlock = CurrentBlockNumber;
  };
  const run2 = async () => {
    for (let i = 0; i < RecycledEvents.length + 1; i++) {
      if (i < RecycledEvents.length) {
        // Create a new user and save to the database
        const user = new recycle({
          user: value1[i],
          sponcerId: value2[i],
          amount: value3[i],
          time: value4[i],
        });
        await user.save().then(() => {
          console.log(
            `New user: ${value1[i]} => Sponcer: ${value2[i]} =  saved ✅ `
          );
        });
        value1.splice(i, -1);
        value2.splice(i, -1);
        value3.splice(i, -1);
        value4.splice(i, -1);
      } else if (RecycledEvents.length == i) {
        while (RecycledEvents.length > 0) {
          RecycledEvents.pop();
          value1.pop();
          value2.pop();
          value3.pop();
          value4.pop();
        }
      }
    }
  };
  await run();
  await mongoose.connect(process.env.URL, clientOptions);

  console.log("Connected to MongoDB");
  await run2();
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
};

// / Run every 2 seconds

app.listen(3001, () => {
  console.log(`Server is running on port 3001`),
    setInterval(FetchInfo, 4000),
    setInterval(FetchInfoUpgradeEvent, 8000);
  setInterval(FetchInfoRecycledEvent, 12000);
});

const userRoutes = router.get("/", async (req, res) => {
  try {
    await mongoose.connect(process.env.URL, clientOptions);

    console.log("Connected to MongoDB");
    const users = await newUser.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
const upgradeRoutes = router.get("/", async (req, res) => {
  try {
    await mongoose.connect(process.env.URL, clientOptions);

    console.log("Connected to MongoDB");
    const users = await upgrade.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
const recycleRoutes = router.get("/", async (req, res) => {
  try {
    await mongoose.connect(process.env.URL, clientOptions);

    console.log("Connected to MongoDB");
    const users = await recycle.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.use("/newusers", userRoutes);
app.use("/upgrade", upgradeRoutes);
app.use("/recycle", recycleRoutes);
// app.post("/newusers",userRoutes.get("/newusers", async(res,req)=>{
//     const post = await
// }) )
// app.listen(3001, () => console.log(`Server started on port 3001`));
