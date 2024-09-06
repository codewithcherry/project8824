const {getDb}=require('../utils/db');
const mongodb=require('mongodb');

class User{
    constructor(userName,email){
        this.userName=userName;
        this.email=email;
    }

    createNewUser(){
        let db=getDb()
        return db.collection("users").insertOne(this);
    }

    static findUserbyId(uid){
        let db=getDb();

        return db.collection("users").findOne({_id:new mongodb.ObjectId(uid)})
                .then(user=>{
                    console.log("user found");
                    return user;
                    
                })
                .catch(err=>{
                    console.log(err);
                })
    }
}

module.exports=User;