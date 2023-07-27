const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${db_user}:${db_password}@cluster0.t99wqyy.mongodb.net/?retryWrites=true&w=majority"`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    console.log("🛢 Server successfully connected to MongoDB!");

    const db = client.db("craft-your-pc");
    const productCollection = db.collection("products");

    app.get("/products", async (req, res) => {
      const products = await productCollection.find({}).toArray();

      res.status(200).send({ success: true, statusCode: 200, data: products });
    });

    app.get("/", (req, res) => {
      res.send({ message: "Server Api Working!!" });
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
