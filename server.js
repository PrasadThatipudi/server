const handleConnection = async (connection) => {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  for await (const data of connection.readable) {
    const request = decoder.decode(data);

    if (request.trim() === "exit") {
      const exitMessage = "Connection closed successfully!\n";

      connection.write(encoder.encode(exitMessage));
      connection.close();
      return;
    }

    connection.write(encoder.encode(request));
  }
};

const listener = Deno.listen({ port: 8000 });

for await (const connection of listener) {
  handleConnection(connection);
}
