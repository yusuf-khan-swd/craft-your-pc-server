require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASS;

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
    const categoryCollection = db.collection("categories");

    app.get("/products", async (req, res) => {
      const result = await productCollection.find({}).toArray();

      res.status(200).send({ success: true, statusCode: 200, data: result });
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productCollection.findOne({
        _id: new ObjectId(id),
      });

      res.status(200).send({ success: true, statusCode: 200, data: result });
    });

    app.get("/categories", async (req, res) => {
      const result = await categoryCollection.find({}).toArray();

      res.status(200).send({ success: true, statusCode: 200, data: result });
    });

    app.get("/category-products/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const category = await categoryCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!category) {
          return res.status(404).send({
            success: false,
            statusCode: 404,
            message: "No category found by the provided ID.",
          });
        }

        const products = await productCollection
          .find({ category: category.category_name })
          .toArray();

        if (products.length < 1) {
          return res.status(404).send({
            success: false,
            statusCode: 404,
            message: "Products not found",
            data: products,
          });
        }

        res.status(200).send({
          success: true,
          statusCode: 200,
          message: "Product retrieve successfully",
          data: products,
        });
      } catch (error) {
        res.status(400).send({
          success: false,
          statusCode: 400,
          error: error,
          message: error.message,
        });
      }
    });

    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const result = await categoryCollection.findOne({
        _id: new ObjectId(id),
      });

      res.status(200).send({ success: true, statusCode: 200, data: result });
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send({ message: "CraftYourPC Server Api Working!!" });
});

app.get("/items", (req, res) => {
  res.status(200).send({ success: true, statusCode: 200, data: [{}, {}] });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
