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
import "dotenv/config";
  const app = express();
  app.use(cors());
  app.use(express.json());


// Mongoose 

// states 
var fromBlock = BigInt(26562743);
// connect to your contract
// create the client with your clientId, or secretKey if in a server environment
const client = createThirdwebClient({
    // clientId: process.env.CLIENT_ID,
    clientId: "467b42b016f89ecb921c9d662da99fd1",
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

const events = await getContractEvents({
    contract: myContract,
    fromBlock: fromBlock,
    toBlock: (fromBlock + BigInt(360)),
    events: [preparedEvent],
});

let response;
let num1;
let num2;
let num3;
let num4;

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

// Define a Mongoose Schema
const eventSchema = new mongoose.Schema({
    user: String,
    sponcer: String,
    amount: String,
    time: String,
  });
// Create a Mongoose Model based on the Schema
const EventModel = mongoose.model("Event", eventSchema);

// Fetching function 
async function FetchingData(){
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

        const newEventData = {
            user: User,
            sponcer: Sponcer,
            amount: Amount,
            time: Time,
        };

        const newEvent = new EventModel(newEventData);

        try {
            // Save the document to the database
            await newEvent.save();
            console.log("Event saved:", newEvent);
        } catch (err) {
            console.error("Error saving event to database", err);
        }
        // var en = new Eventual(User, Sponcer, Amount, Time);
        // console.log("this =>", en);
        // To DataBase
        // even.push(en);
      }
}
// Call the function every 2 minutes (120,000 milliseconds)
setInterval(FetchingData, 60000);


// Basic route to view saved events
app.get('/', async (req, res) => {
    const events = await EventModel.find();
    res.send(`Server is running. Events: ${JSON.stringify(events)}`);
  });
// app.use("/block", function (req, res) {
// res.send(`Server is running 2 .....and...Data.....${events}`);
// });
app.listen(3001, () => {
    console.log(`Server is running on port 3001`);
});