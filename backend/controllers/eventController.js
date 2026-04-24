const { getMusicEvents,getComedyEvents,getSportsEvents} = require("../services/eventService");


exports.getEventData = async(req,res) => {
    try{

        const [music,sports, comedy] = await Promise.all([
            getMusicEvents(),
            getSportsEvents(),
            getComedyEvents(),
        ]);

        res.json({
            success:true,
            music,
            sports,
            comedy,
        })

    }catch(err){
        console.log("EVENT ERROR FULL:", err);
  console.log("EVENT ERROR MSG:", err.message);

  res.status(500).json({
    success: false,
    message: err.message, // 🔥 show real issue
  });

    }
}








