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
  while (true) {
    const buffer = new Uint8Array(1024);
    await Deno.stdin.read(buffer);

    await connection.write(buffer);
  }
};

const main = async () => {
  const connection = await Deno.connect({ port: 8000 });

  handleResponses(connection);
  handleRequests(connection);
};

await main();
