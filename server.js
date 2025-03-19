const sendMessage = (sender, receiver, message) => {
  console.log(message, sender, receiver);
};

const handleConnection = async (connection, allConnections) => {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  for await (const request of connection.readable) {
    const message = decoder.decode(request).trim();

    if (message === "exit") {
      const exitMessage = "Connection closed successfully!\n";

      connection.write(encoder.encode(exitMessage));
      connection.close();
      return;
    }

    sendMessage(connection, allConnections.at(0), message);
  }
};

const main = async () => {
  const listener = Deno.listen({ port: 8000 });
  const allConnections = [];

  for await (const connection of listener) {
    allConnections.push(connection);
    handleConnection(connection, allConnections);
  }
};

await main();
