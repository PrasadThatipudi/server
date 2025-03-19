const sendMessage = (sender, receivers, message, encoder) => {
  receivers.forEach((receiver) => {
    const response = `${sender.clientName}: ${message}`;

    receiver.write(encoder.encode(response));
  });
};

const readClientName = async (client, decoder, encoder) => {
  const requestMessage = "Please enter your name: ";

  await client.write(encoder.encode(requestMessage));

  const name = new Uint8Array(50);
  const byteCount = await client.read(name);

  return decoder.decode(name).slice(0, byteCount);
};

const closeConnection = (connection, encoder) => {
  const exitMessage = "Connection closed successfully!\n";

  connection.write(encoder.encode(exitMessage));
  connection.close();
};

const handleConnection = async (connection, allConnections) => {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  const clientName = await readClientName(connection, decoder, encoder);
  connection.clientName = clientName.slice(0, -2);

  for await (const request of connection.readable) {
    const message = decoder.decode(request);

    if (message.trim() === "exit") {
      closeConnection(connection, encoder);
      return;
    }

    sendMessage(connection, allConnections, message, encoder);
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
