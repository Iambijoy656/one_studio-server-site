const express = require('express');
const cors = require('cors');
const app = express()
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;



// middleware
app.use(cors())
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWOED}@cluster0.iyuahvh.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('oneStudio').collection('services')

        const reviewCollection = client.db('oneStudio').collection('reviews')


        // JWT
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
            res.send({ token })
        })














        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray();
            res.send(services)
        })
        app.get('/limitservices', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.limit(3).toArray();
            res.send(services)
        })


        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query);
            res.send(service)
        })


        // review api

        app.get('/allreviews', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query)
            const reviews = await cursor.toArray();
            res.send(reviews)
        })

        //   particular user reviews

        app.get('/reviews', async (req, res) => {

            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }


            const cursor = reviewCollection.find(query)
            const reviews = await cursor.toArray();
            res.send(reviews)
        })


        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result)

        })


        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await reviewCollection.deleteOne(query)
            res.send(result)
        })






    }
    finally {

    }

}

run().catch(error => console.error(error))







app.get('/', (req, res) => {
    res.send('one studio server is running')
})


app.listen(port, () => {
    console.log(`One studio car server running on port ${port}`)
})