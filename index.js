const express = require('express');
const cors =require('cors');
var jwt = require('jsonwebtoken');
require('dotenv').config();
const port=process.env.PORT||5000;
const app=express();

//middleware
app.use(cors());
app.use(express.json())
//function
function verifyJWT(req,res,next){
  const authHeader=req.headers.authorization;
  if(!authHeader){
    return res.status(401).send({message:'unauthorized Access'})

  }
  const token=authHeader.split(" ")[1];
  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,decoded)=>{
    if(err){
      return res.status(403).send({message:'Forbidden Access'});
    }

else{
  // console.log('decoded',decoded);
  req.decoded=decoded;
  next();
}

  })


}
//connection

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tgqvotd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
      const serviceCollection = client.db("geniusCar").collection("service");
      const orderCollection=client.db("geniusCar").collection("order");
      // query for movies that have a runtime less than 15 minutes

    //   const options = {
    //     // sort returned documents in ascending order by title (A->Z)
    //     sort: { title: 1 },
    //     // Include only the `title` and `imdb` fields in each returned document
    //     projection: { _id: 0, title: 1, imdb: 1 },
    //   };
    
//Auth
app.post('/login',async(req,res)=>{

  const user=req.body;
  const accessToken=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
    expiresIn:'1d'
  });
  res.send({accessToken});

})
    //Services api
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

//order collection Api
//place order
app.post("/order",async(req,res)=>{

const order=req.body;
const result = await orderCollection.insertOne(order);
res.send(result);

})
//get all orders
app.get("/orders",verifyJWT ,async(req,res)=>{
const decodedEmail=req.decoded.email;
  const email=req.query.email;
if(email===decodedEmail){
  console.log(email)
  const query = {email:email};
  const cursor = orderCollection.find(query);
  const orders =await cursor.toArray();
  res.send(orders);
}
else{
  return res.status(403).send({message:'Forbidden Access'});
}

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