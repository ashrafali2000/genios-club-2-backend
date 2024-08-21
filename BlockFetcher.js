import "dotenv/config";

let CurrentBlockNumber;
const blockNumber = () => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "X-API-Key": api,
    },
  };

  fetch(
    "https://svc.blockdaemon.com/universal/v1/fantom/testnet/sync/block_number",
    options
  )
    .then((response) => (CurrentBlockNumber = response.json()))
    .then(
      (response) => (
        (CurrentBlockNumber = response), console.log(CurrentBlockNumber)
      )
    )
    .catch((err) => console.error(err));

  return CurrentBlockNumber;
};

export default blockNumber;
