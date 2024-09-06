const {getDb}=require('../utils/db')

class User{
    constructor(userid,email){
        this.userid=userid;
        this.email=email;
    }

    createNewUser(){
        let db=getDb()
        return db.collection("users").insertOne(this);
    }
}

module.exports=User;