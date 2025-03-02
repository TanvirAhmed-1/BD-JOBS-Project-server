require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port=process.env.POST || 5000;
const app=express()

//middleware
app.use(cors())
app.use(express.json())

// job-site
//AglvyYde8uzKKdbS


const uri = `mongodb+srv://${process.env.DATA_USER}:${process.env.DATA_Pass}@cluster0.0p516.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

  const jobCollection=client.db("jobs").collection("job")
  const applycollection=client.db("jobs").collection("apply")

//get all data
app.get("/jobs",async(req,res)=>{
  const result=await jobCollection.find().toArray()
  res.send(result)
})


//post 
app.post("/jobs", async(req, res)=>{
  const data=req.body;
  console.log(data);
 const result=await jobCollection.insertOne(data);
 res.send(result)
})




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/",(req ,res)=>{
    res.send("the CURD is Running")
})

app.listen(port,(req,res)=>{
console.log(`the server is running: ${port}`)
})

