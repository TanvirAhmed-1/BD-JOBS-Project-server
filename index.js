require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.POST || 5000;
const app = express();

//middleware
app.use(cors({
  origin: "http://localhost:5000",
  credentials: true, 
}));
app.use(express.json());
app.use(cookieParser());

// job-site
//AglvyYde8uzKKdbS

const uri = `mongodb+srv://${process.env.DATA_USER}:${process.env.DATA_Pass}@cluster0.0p516.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const jobCollection = client.db("jobs").collection("job");
    const applyCollection = client.db("jobs").collection("apply");

    //get all data
    app.get("/jobs", async (req, res) => {
      const result = await jobCollection.find().toArray();
      res.send(result);
    });

    //id base jobs
    app.get("/jobs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.findOne(query);
      res.send(result);
    });

    // user email to access data
    app.get("/jobs-apply", async (req, res) => {
      const email = req.query.email;
      const query = { applicant_email: email };
      const result = await applyCollection.find(query).toArray();

      for (const add of result) {
        // console.log(add.job_id)
        const query2 = { _id: new ObjectId(add.job_id) };
        const result2 = await jobCollection.findOne(query2);
        if (result2) {
          add.title = result2.title;
          add.location = result2.location;
          add.company = result2.company;
          add.company_logo = result2.company_logo;
        }
      }
      res.send(result);
    });

    //post
    app.post("/jobs-apply", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await applyCollection.insertOne(data);
      res.send(result);
    });

    app.post("/jobs", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await jobCollection.insertOne(data);
      res.send(result);
    });

    //jwt token

    app.get("/jwt", async (req, res) => {
      const email  = req.body;
      console.log(email);
      const token = jwt.sign(email, process.env.DATA_TOKEN, {
        expiresIn: "10h",
      });
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: false,
        })
        // .send(token)
        .send({ success: true,});
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("the CURD is Running");
});

app.listen(port, (req, res) => {
  console.log(`the server is running: ${port}`);
});
