const express = require('express')
const bodyParser = require('body-parser')
const config = require('./config')
const expressLayouts = require('express-ejs-layouts');
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

const MongoClient = require('mongodb').MongoClient;
const uri = config.URI;
const client = new MongoClient(uri, {
    useNewUrlParser: true
});
client.connect(async (err) => {
    console.log('DB connect error: ', err)
    const collection_notes = client.db(config.DB).collection("notes");
    const collection_lists = client.db(config.DB).collection("lists");
    app.db_notes = collection_notes
    app.db_lists = collection_lists
});

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/static'));
app.use(expressLayouts)

app.get('/', function (req, res) {
    res.render('index', {
        pageTitle: " Start page"
    })
})

app.get('/lists', async (req, res) => {
    const newLists = []
    await app.db_lists.find({}).forEach(element => {
        newLists.push(element)
    });
    res.render('lists', {
        pageTitle: "Lists",
        newLists
    })
})

app.get('/notes', async (req, res) => {
    const newNotes = []
    await app.db_notes.find({}).forEach(element => {
        newNotes.push(element)
    });
    res.render('notes', {
        pageTitle: "Notes",
        newNotes
    })
})

app.get('/create_notes', (req, res) => {
    res.render('notes_create', {
        pageTitle: "Create notes",
    })
})

app.post('/create_notes', async (req, res) => {
    // console.log(req.body)
    try {
        await app.db_notes.insertOne({
            id: Date.now(),
            ...req.body
        })
    } catch (error) {
        console.log(error)
    }
    res.json({
        created: true
    })

})



app.listen(config.PORT, () => console.log(`server started at port ${config.PORT}`))