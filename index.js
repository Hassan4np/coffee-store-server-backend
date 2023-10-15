const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
//middle wirder
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uruvxpx.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();
        const database = client.db("coffeesDB");
        const CoffeesCollection = database.collection("coffees");


        app.get('/coffees', async(req, res) => {
            const cursor = CoffeesCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        });
        app.get('/coffees/:id', async(req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) };
            const result = await CoffeesCollection.findOne(query);
            res.send(result)
        });

        app.post('/coffees', async(req, res) => {
            const coffees = req.body;
            console.log(coffees)
                // const result = await haiku.insertOne(doc);
            const result = await CoffeesCollection.insertOne(coffees);
            res.send(result)

        });


        app.put('/coffees/:id', async(req, res) => {
            const id = req.params.id;
            const updatecoffees = req.body;
            console.log(id, updatecoffees);
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatecoff = {
                $set: {
                    name: updatecoffees.name,
                    chif: updatecoffees.chif,
                    supplar: updatecoffees.supplar,
                    tests: updatecoffees.tests,
                    photo: updatecoffees.photo

                }
            };
            const result = await CoffeesCollection.updateOne(filter, updatecoff, options);
            res.send(result);
        })


        app.delete('/coffees/:id', async(req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) };
            const result = await CoffeesCollection.deleteOne(query);
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



app.get('/', (req, res) => {
    res.send('HELLO I AM HASSANDSSSSSS')
});
app.listen(port, () => {
    console.log(`this is heat this port ${port}
`)
})