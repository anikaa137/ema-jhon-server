const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()


const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 7000

// console.log(process.env.DB_USER, process.env.DB_PASS, process.env.DB_NAME)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mivuu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("emaJhonStore").collection("products");
    console.log(err)

    app.post('/addProduct', (req, res) => {
        const products = req.body;
        console.log(products)
        productsCollection.insertMany(products)
            .then(result => {
                // console.log(result.insertedCount);
                res.send(result.insertedCount)
        })
    })
    //read
    app.get('/products', (req, res) => {
        productsCollection.find({}).limit(30)
            .toArray((err, documents) => {
                res.send(documents)
                console.log(err)
        })
    })
    //single product api
    app.get('/product/:key', (req, res) => {
        productsCollection.find({key:req.params.key})
            .toArray((err, documents) => {
                res.send(documents[0])
                console.log(err)
        })
    })

    //products BY Keys
    app.post('/productsByKeys', (req, res) => {
        const prodctkeys = req.body;
        productsCollection.find({ key: { $in: prodctkeys } })
            .toArray((err, documents) => {
                res.send(documents);
        })
    })
});



app.listen(port)