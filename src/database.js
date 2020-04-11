const mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost/notes-db-app', {
mongoose.connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false        
}).then(db => console.log('MongoDB is connected')).catch(err => console.error(err));
