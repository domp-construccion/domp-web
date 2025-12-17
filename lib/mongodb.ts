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
    throw new Error(
      "MONGODB_URI no está configurado. No es posible conectarse a MongoDB.",
    );
  }

  try {
    const client = await clientPromise;
    
    // Si en el URI se especifica el nombre de la base de datos, MongoClient lo usa por defecto.
    // Ejemplo de URI recomendado:
    // MONGODB_URI=mongodb+srv://usuario:pass@cluster.mongodb.net/domp
    return client.db();
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    
    // Si es un error de DNS, dar sugerencias
    if (errorMessage.includes("ENOTFOUND") || errorMessage.includes("querySrv")) {
      throw new Error(
        `Error de conexión a MongoDB Atlas. Verifica: 1) Tu conexión a internet, 2) Que el cluster de MongoDB Atlas esté activo (no pausado), 3) Que tu IP esté en la whitelist de MongoDB Atlas.`,
      );
    }
    
    throw new Error(`No se pudo conectar a MongoDB: ${errorMessage}`);
  }
}


