import express from 'express';
import mongoose from 'mongoose';
import ShortUrl from './models/ShortUrl.js';

mongoose.connect('mongodb://localhost:27017/urlShortener',{
    useNewUrlParser: true, useUnifiedTopology: true
})

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))

app.listen(process.env.PORT || 3000, () => {
    console.log('Server listening on port 3000');
});

app.get('/', async(req,res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls });
})

app.post('/shortUrls', async(req,res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
    res.redirect('/');
})

app.get('/:shortUrl', async(req,res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if(shortUrl == null) return res.sendStatus(404)

    shortUrl.click++
    shortUrl.save()

    res.redirect(shortUrl.full)
})



