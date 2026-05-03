const express = require("express");
const router = express.Router();

const {
  createContent,
  createContentFromTMDB,
  getContents,
  getContentById,
  updateContent,
  deleteContent,
  featureContent,
  unfeatureContent,
  searchContent,
  getContentList
} = require("../controllers/contentController");

const { auth, isAdmin } = require("../middlewares/auth");

// ======================================================
// 🌐 PUBLIC ROUTES
// ======================================================
// In your content/movie router
router.get("/content", getContentList); // GET /api/v1/content?type=movie

// GET ALL CONTENT
router.get("/", getContents);

// SEARCH CONTENT
router.get("/search/all", searchContent);

// GET SINGLE CONTENT
router.get("/:id", getContentById);

// ======================================================
// 🔐 ADMIN ONLY ROUTES
// ======================================================

// CREATE CONTENT
router.post(
  "/create",
  auth,
  isAdmin,
  createContent
);

// CREATE CONTENT FROM TMDB
router.post(
  "/tmdb",
  auth,
  isAdmin,
  createContentFromTMDB
);

// UPDATE CONTENT
router.put(
  "/:id",
  auth,
  isAdmin,
  updateContent
);

// DELETE CONTENT
router.delete(
  "/:id",
  auth,
  isAdmin,
  deleteContent
);

// FEATURE CONTENT
router.patch(
  "/:id/feature",
  auth,
  isAdmin,
  featureContent
);

// UNFEATURE CONTENT
router.patch(
  "/:id/unfeature",
  auth,
  isAdmin,
  unfeatureContent
);

module.exports = router;