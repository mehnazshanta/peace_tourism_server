const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 7000;
require("dotenv").config();

// _ _ _ _middleware
app.use(cors());
app.use(express.json());

// System vars
const DB_USER = "peace_tourism";
const DB_PASS = "zFXnCTWPeO9X9LAz";
const ACCESS_TOKEN_SECRET =
  "bcd8f28f9eb07a0ab125f1607aad4347dafd91a7956548f902227e6f17f726d47910008448bebba1e1a8b5c39c632a196cc21f16c1919942ef1fc7cffe22edfd";

const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.naqs43w.mongodb.net/?retryWrites=true&w=majority`;
const DB = "peaceTourismDB";
const COL_SERVICES = "services";
const COL_BOOKINGS = "bookings";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client.db(DB).collection(COL_SERVICES);
    const bookingCollection = client.db(DB).collection(COL_BOOKINGS);

    //  JWT method
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.send({ token });
    });

    // _ _ _ _ GET method
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    // _ _ _ _ bookings api
    app.get("/bookings", async (req, res) => {
      let query = {};

      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }

      const cursor = bookingCollection.find(query);
      const bookings = await cursor.toArray();
      res.send(bookings);
    });

    // _ _ _ _ POST method
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

    // _ _ _ _ DELETE method
    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch((error) => console.error(error));

//
app.get("/", (req, res) => {
  res.send("Hello from peace tourism");
});

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
