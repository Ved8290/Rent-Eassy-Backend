const express= require('express');
const app= express();
const cors= require('cors');
const mongoose= require('mongoose');
const dns= require('dns');
const Property= require("./Routes/Property");
const Auth= require("./Routes/Auth");
require('dotenv').config();
const { startCronJobs } = require('./Cornjobs');

const PORT= process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const url= process.env.Mongo_URL;

dns.setServers(['1.1.1.1', '8.8.8.8']);

mongoose.connect(url)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);

app.get('/', (req, res) => {
    res.send('Rent Flow Backend!');
})

app.get('/error',(req, res) => {
    res.send('Error Page!');
})

startCronJobs();

app.use('/auth', require('./Routes/Auth'));
app.use('/api', Property);
app.use('/api', require('./Routes/NewRenter'));
app.use('/api', require('./Routes/RenterDetails'));
app.use('/api', require('./Routes/CornUpdates')); 

<<<<<<< HEAD
=======
>>>>>>> 