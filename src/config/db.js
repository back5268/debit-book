require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
}).then(() => {
    console.log('DB connect successful!');
}).catch((err) => {
    console.log(err);
    console.log('DB connect failed!');
})

// async function connect() {
//     try {
//         await mongoose.connect('mongodb://localhost:27017/userDB', {
//             useNewUrlParser: true, 
//             useUnifiedTopology: true,
//         })
//         console.log('Connect successful!');
//     } catch (err) {
//         console.log('Connect failed!');
//     }
// }

// module.exports = { connect };