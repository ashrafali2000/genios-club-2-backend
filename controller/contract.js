import Block from "../models/contract";
import {
  createThirdwebClient,
  getContract,
  prepareEvent,
  getContractEvents,
} from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { ethers } from "ethers";
export const createBlock = async (req, res, next) => {
  const {} = req.body;
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

  const client = createThirdwebClient({
    clientId: "467b42b016f89ecb921c9d662da99fd1",
  });

  // connect to your contract
  const myContract = getContract({
    client,
    chain: defineChain(4002),
    address: "0xe10b4AD803bF261FB49568Adb68a075CbBe106fE",
  });

  const preparedEvent = prepareEvent({
    myContract,
    signature:
      "event NewUser(uint _user, uint _sponcer, uint256 amount, uint256 time)",
  });

  const events = await getContractEvents({
    contract: myContract,
    fromBlock: fromBlock,
    toBlock: fromBlock + BigInt(425),
    events: [preparedEvent],
  });
  var response;

  function save() {
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
      console.log("this =>", en);
      // To DataBase
      even.push(en);
    }
  }
  save();
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

      const num1 = Number(userNumber.replace(/[^0-9]/g, ""));
      const num2 = Number(SponcerNumber.replace(/[^0-9]/g, ""));
      const num3 = Number(AmountNumber.replace(/[^0-9]/g, ""));
      const num4 = Number(TimeNumber.replace(/[^0-9]/g, ""));

      console.log(`New User:=> ${num1}, ${num2}, ${num3}, ${num4}`);
    }
    console.log("1: ", fromBlock.toString());
    // to Database
    fromBlock = fromBlock + BigInt(425);
    console.log("2: ", fromBlock.toString());
  }
  run2();

  const newBlock = new Block({});

  try {
    await newBlock.save();
    res.json("SignUp is Successful");
  } catch (error) {
    next(error);
  }
};
