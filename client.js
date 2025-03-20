const handleResponses = async (connection) => {
  try {
    for await (const response of connection.readable) {
      Deno.stdout.writeSync(response);
    }
  } catch (error) {
    console.log(error);
  }

  console.log("Connection is closed!");
};

const handleRequests = async (connection) => {
  for await (const request of Deno.stdin.readable) {
    await connection.write(request);
  }
};

const main = async () => {
  const connection = await Deno.connect({ port: 8000 });

  handleResponses(connection);
  handleRequests(connection);
};

await main();
