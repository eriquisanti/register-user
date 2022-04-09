const mongoose = require('mongoose');
require('dotenv/config');

class Connection {
    constructor(){
        this.dataBaseConnectionMongoDB()
    }

    dataBaseConnectionMongoDB(){
        this.mongoDBConnection = mongoose.connect(process.env.MONGO_DB_KEY).then(() => {
            console.log("Connect MongoDB ...")
        }).catch(err => console.error(`Connect faild MongoDB: ${err}`));
    }
}

module.exports = new Connection();