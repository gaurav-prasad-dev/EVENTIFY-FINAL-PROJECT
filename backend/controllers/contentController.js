const Content = require("../models/Content");
const axios = require("axios");

// =====================================
// CREATE CONTENT
// =====================================
exports.createContent = async (req, res) => {
  try {
    const {
      title,
      type,
      description,
      duration,
      languages,
      genres,
      releaseDate,
      poster,
      trailerUrl,
      tmdbId,
    } = req.body;

    if (!title || !type) {
      return res.status(400).json({
        success: false,
        message: "Title and type are required",
      });
    }

    // duplicate check (title + type better than only title)
    const existing = await Content.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") },
      type,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Content already exists",
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
      trailerUrl,
      tmdbId,
      isActive: true,
      approvalStatus: "approved",
    });

    return res.status(201).json({
      success: true,
      data: content,
    });

  } catch (error) {
    console.log("CREATE CONTENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating content",
    });
  }
};



exports.createContentFromTMDB = async (req, res) => {
  try {
    const { tmdbId } = req.body;

    if (!tmdbId) {
      return res.status(400).json({
        success: false,
        message: "tmdbId is required",
      });
    }

    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${tmdbId}`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          append_to_response: "videos",
        },
      }
    );

    // ✅ safer duplicate check
    const exists = await Content.findOne({
      $or: [
        { tmdbId: tmdbId.toString() },
        {
          title: { $regex: new RegExp(`^${data.title}$`, "i") },
          type: "movie",
        },
      ],
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Content already exists",
      });
    }

    const trailer = data.videos?.results?.find(
      (v) => v.type === "Trailer" && v.site === "YouTube"
    );

    const content = await Content.create({
      title: data.title,
      type: "movie",
      description: data.overview,
      duration: data.runtime || 0,
      languages:
        data.spoken_languages?.map((l) => l.english_name) || [
          data.original_language,
        ],
      genres: data.genres?.map((g) => g.name) || [],
      releaseDate: data.release_date,
      poster: data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : null,
      trailerUrl: trailer
        ? `https://www.youtube.com/watch?v=${trailer.key}`
        : null,
      tmdbId: tmdbId.toString(),
      isActive: true,
      approvalStatus: "approved",
    });

    return res.status(201).json({
      success: true,
      message: "Content created from TMDB",
      data: content,
    });
  } catch (error) {
    console.log("TMDB CREATE ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create content from TMDB",
    });
  }
};

// =====================================
// GET ALL CONTENTS
// =====================================
exports.getContents = async (req, res) => {
  try {
    const { type } = req.query;

    const query = {
      isActive: true,
      // approvalStatus: "approved",
    };

    if (type) query.type = type;

    const contents = await Content.find(query)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: contents.length,
      data: contents,
    });

  } catch (error) {
    console.log("GET CONTENTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching content",
    });
  }
};

// =====================================
// GET CONTENT BY ID
// =====================================
exports.getContentById = async (req, res) => {
  try {
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
      data: content,
    });

  } catch (error) {
    console.log("GET CONTENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching content",
    });
  }
};

// =====================================
// UPDATE CONTENT
// =====================================
exports.updateContent = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    Object.assign(content, req.body);

    await content.save();

    return res.status(200).json({
      success: true,
      message: "Content updated successfully",
      data: content,
    });

  } catch (error) {
    console.log("UPDATE CONTENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating content",
    });
  }
};

// =====================================
// DELETE CONTENT
// =====================================
exports.deleteContent = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    await content.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Content deleted successfully",
    });

  } catch (error) {
    console.log("DELETE CONTENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting content",
    });
  }
};

// =====================================
// FEATURE CONTENT
// =====================================
exports.featureContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    content.featured = true;

    await content.save();

    return res.status(200).json({
      success: true,
      message: "Content featured successfully",
      data: content,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error featuring content",
    });
  }
};

// =====================================
// UNFEATURE CONTENT
// =====================================
exports.unfeatureContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    content.featured = false;

    await content.save();

    return res.status(200).json({
      success: true,
      message: "Content unfeatured successfully",
      data: content,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error unfeaturing content",
    });
  }
};



// =====================================
// SEARCH CONTENT (MOVIE + EVENT)
// =====================================
exports.searchContent = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const results = await Content.find({
      title: { $regex: query, $options: "i" },
      isActive: true,
    })
      .limit(20)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: results,
    });

  } catch (error) {
    console.log("SEARCH ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
};

// =====================================
// GET CONTENT LIST (FROM YOUR DB)
// =====================================
exports.getContentList = async (req, res) => {
  try {
    const { type } = req.query; // ?type=movie or ?type=event

    const filter = { isActive: true };
    if (type) filter.type = type;

    const content = await Content.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: content, // has _id, title, poster, etc.
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching content",
    });
  }
};