import mongoose, { ConnectionStates } from "mongoose";

const { disconnected, connected } = ConnectionStates;

const mongoConnection = {
  isConnected: disconnected,
};

export const disconnect = async () => {
  if (
    mongoConnection.isConnected === disconnected ||
    process.env.NODE_ENV === "development"
  )
    return;

  await mongoose.disconnect();
  console.log("Desconectado de MongoDB");
};

export const connect = async () => {
  if (mongoConnection.isConnected) {
    console.log("Ya estabamos conectados");
    return;
  }

  if (mongoConnection.isConnected !== disconnected) {
    mongoConnection.isConnected = mongoose.connections[0].readyState;

    if (mongoConnection.isConnected === connected) {
      console.log("Se usa conexión anterior");
      return;
    }

    disconnect();
  }

  await mongoose.connect(process.env.MONGO_URL ?? "");
  mongoConnection.isConnected = connected;
  console.log("Conectado a MongoDB", process.env.MONGO_URL);
};
