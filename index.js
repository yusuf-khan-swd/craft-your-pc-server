require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t99wqyy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("craft-your-pc");
    const productCollection = db.collection("products");
    const categoryCollection = db.collection("categories");

    app.get("/products", async (req, res) => {
      const result = await productCollection
        .aggregate([{ $sample: { size: 9 } }])
        .toArray();

      res.status(200).send({ success: true, statusCode: 200, data: result });
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productCollection.findOne({
        _id: ObjectId(id),
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
          _id: ObjectId(id),
        });

        if (!category) {
          return res.status(404).send({
            success: false,
            statusCode: 404,
            message: "No category found by the provided ID.",
            data: { products: [], category: [] },
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
            data: { products: [], category: [] },
          });
        }

        res.status(200).send({
          success: true,
          statusCode: 200,
          message: "Product retrieve successfully",
          data: { products, category },
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
        _id: ObjectId(id),
      });

      res.status(200).send({ success: true, statusCode: 200, data: result });
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
