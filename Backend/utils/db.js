const db = require('mysql2');
const dbCredentials=require('./dbcredentials');

const dbpool=db.createPool(
    dbCredentials
)

module.exports=dbpool.promise();