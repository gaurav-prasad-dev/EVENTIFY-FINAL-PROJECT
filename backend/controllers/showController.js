const Show = require("../models/Show");
const Content = require("../models/Content");
const Screen = require("../models/Screen");




exports.createShow = async(req,res) => {

    try{

        const { content, screen, showDate, startTime, endTime, basePrice } = req.body;

        const contentExist = await Content.findById(content);

        
         if (!contentExist) {
      return res.status(404).json({
        success: false,
        message: "Content not found"
      });
    }

    const screenExist = await Screen.findById(screen);

     if (!screenExist) {
      return res.status(404).json({
        success: false,
        message: "screen not found"
      });
    }

    const show = await Show.create({
        content,
        screen,
        showDate,
        startTime,
        endTime,
        basePrice,
    });

   
    return res.status(201).json({
      success: true,
      message: "Show created successfully",
      show
    });

    }catch(error){

         return res.status(500).json({
      success: false,
      message: error.message
    });
    }
}


exports.getShowByContent = async(req,res) => {
    try{

        const { contentId } = req.params;

        const shows = await Show.find({
            content: contentId,
            status:"Active",
        })
        .populate("screen")
        .populate("content")

         return res.status(200).json({
      success: true,
      shows,
    });


    }catch(error){

        
   return res.status(500).json({
      success: false,
      message: "Error fetching shows"
    });

    }
}


exports.getShowById = async(req,res) => {
    try{

        const { id } = req.params;

        const show = await Show.findById(id)
        .populate("content")
        .populate({
            path:"screen",
            populate:{
                path:"venue"
            }
        });


         if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found"
      });
    }

    return res.status(200).json({
      success: true,
      show
    });




    }catch(error){

         return res.status(500).json({
      success: false,
      message: "Error fetching show"
    });

    }
}