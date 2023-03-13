const express = require('express');
const cors =require('cors');
require('dotenv').config();
const port=process.env.PORT||5000;
const app=express();

//middleware
app.use(cors());
app.use(express.json())
//connection

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tgqvotd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
      const serviceCollection = client.db("geniusCar").collection("service");
      // query for movies that have a runtime less than 15 minutes

    //   const options = {
    //     // sort returned documents in ascending order by title (A->Z)
    //     sort: { title: 1 },
    //     // Include only the `title` and `imdb` fields in each returned document
    //     projection: { _id: 0, title: 1, imdb: 1 },
    //   };
//get all service
app.get("/service",async(req,res)=>{
    const query = {};
    const cursor = serviceCollection.find(query);
    const services =await cursor.toArray();
    res.send(services);
})
//delete a service
app.delete("/service/:id",async(req,res)=>{
     const id=req.params.id;
    const query = {_id:new ObjectId(id)};
    const result = await serviceCollection.deleteOne(query);
    res.send(result)
});
//add a service
app.post("/service",async(req,res)=>{
    const newService=req.body;
    const result = await serviceCollection.insertOne(newService);
    res.send(result)
})
//get single service
app.get("/service/:id",async(req,res)=>{
    const id=req.params.id;
    const query = {_id:new ObjectId(id)};
    const service =await serviceCollection.findOne(query);
    res.send(service);
})
      // print a message if no documents were found
    //   if ((await movies.countDocuments(query)) === 0) {
    //     console.log("No documents found!");
    //   }
    //   // replace console.dir with your callback to access individual elements
    //   await cursor.forEach(console.dir);
    } finally {
      //await client.close();
    }
  }
  run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('running genius server')
});
app.listen(port,()=>{
    console.log('listening to port',port)
})