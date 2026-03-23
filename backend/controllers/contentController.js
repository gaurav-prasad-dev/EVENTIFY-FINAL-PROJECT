const Content = require("../models/Content");


exports.createContent = async(req,res) => {
    try{

        const { title, type, description, duration, languages, genres, releaseDate, poster, trailerUrl} = req.body;

         if (!title || !type) {
      return res.status(400).json({
        success: false,
        message: "Title and type are required"
      });
    }

        // ✅ Duplicate check
    const existing = await Content.findOne({ title });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Content already exists"
      });
    }


        const content = await Content.create({     
     title,
      type,
      description,
      duration,
      languages,
      genres,
      releaseDate,
      poster,
      trailerUrl
            
        })

         return res.status(201).json({
      success: true,
      message: "Content created successfully",
      content,
    });

    }catch(error){

           return res.status(500).json({
      success: false,
      message: "Error creating content",
    });

    }
}



exports.getContents = async(req,res) => {
    try{

        const contents = await Content.find({ isActive: true});

        if (!contents.length) {
  return res.status(404).json({
    success: false,
    message: "No content found",
  });
}

    return res.status(200).json({
      success: true,
      contents,
    });

        
    }catch(error){

         return res.status(500).json({
      success: false,
      message: "Error fetching content",
    });

    }
}

exports.getContentById = async(req,res) =>{
    try{

        const { id } = req.params;

        const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    return res.status(200).json({
      success: true,
      content,
    });
    }catch(error){

          return res.status(500).json({
      success: false,
      message: "Error fetching content",
    });

    }
}



exports.updateContent = async(req,res) =>{
    try{

        const { id } = req.params;

        const updatedContent = await Content.findByIdAndUpdate(
            id,
            req.body,
            { new:true }

        );

        return res.status(200).json({
      success: true,
      message: "Content updated successfully",
      updatedContent,
    });


    }catch(error){

          return res.status(500).json({
      success: false,
      message: "Error updating content",
    });
    

    }
}