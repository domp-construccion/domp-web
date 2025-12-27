import { MongoClient } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<InstanceType<typeof MongoClient>> | undefined;
}

const uri = process.env.MONGODB_URI;

let clientPromise: Promise<InstanceType<typeof MongoClient>> | null = null;

if (uri) {
  const options = {
    serverSelectionTimeoutMS: 10000, // 10 segundos
    socketTimeoutMS: 45000, // 45 segundos
    connectTimeoutMS: 10000, // 10 segundos
  };

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise || null;
  } else {
    const client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export async function getDb() {
  if (!clientPromise) {
    return null;
  }

  try {
    const client = await clientPromise;
    
    // Si en el URI se especifica el nombre de la base de datos, MongoClient lo usa por defecto.
    // Ejemplo de URI recomendado:
    // MONGODB_URI=mongodb+srv://usuario:pass@cluster.mongodb.net/domp
    return client.db();
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error);
    // En lugar de lanzar error, retornar null para que el código pueda continuar
    return null;
  }
}


