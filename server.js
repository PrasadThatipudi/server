const sendMessage = (sender, receivers, message, encoder) => {
  receivers.forEach(async (receiver) => {
    try {
      const response = `${message}`;

      await receiver.write(encoder.encode(response));
    } catch (error) {
      console.log(error.message);
      receivers.delete(receiver);
    }
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
  connection.clientName = clientName.slice(0, -1);
  // console.log(typeof clientName, clientName, clientName.trim());

  for await (const request of connection.readable) {
    const message = decoder.decode(request);

    if (message.trim() === "exit") {
      closeConnection(connection, encoder);
      allConnections.delete(connection);
      return;
    }

    sendMessage(connection, allConnections, message, encoder);
  }
};

const main = async () => {
  const listener = Deno.listen({ port: 8000 });
  const allConnections = new Set();

  for await (const connection of listener) {
    allConnections.add(connection);
    handleConnection(connection, allConnections);
  }
};

await main();
