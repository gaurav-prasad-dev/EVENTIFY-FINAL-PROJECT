const mongoose = require("mongoose");


exports.connect = async() =>{
    try{

      await  mongoose.connect(process.env.MONGODB_URL);
      console.log("db connection successfull");

    }catch(error){
        console.log("db failed");
        console.log(error);
        process.exit(1);

    }
    
}

