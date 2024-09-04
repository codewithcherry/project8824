const mongodb=require('mongodb');
const MongoClient=mongodb.MongoClient;

const {uri,shopDatabase}=require('./dbcredentials')

let _db

const mongoClientConnect =(callback)=>{

    MongoClient.connect(uri)
    .then(
        client =>{
           _db=client.db(shopDatabase)
           console.log("Mongo db server connected");
           callback(client);
        }
    )
    .catch(
        (err)=>{
            console.log(err);
            
        }
    )
}

const getDb=()=>{
    if(_db){
        return _db
    }
    else{
        throw err("Database not found");
    }
}

module.exports={mongoClientConnect,getDb};