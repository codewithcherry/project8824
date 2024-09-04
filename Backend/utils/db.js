const mongodb=require('mongodb');
const MongoClient=mongodb.MongoClient;

const uri=require('./dbcredentials')

const connectMongo =(callback)=>{

    MongoClient.connect(uri)
    .then(
        client =>{
            callback(client);
        }
    )
    .catch(
        (err)=>{
            console.log(err);
        }
    )
}

module.exports=connectMongo;