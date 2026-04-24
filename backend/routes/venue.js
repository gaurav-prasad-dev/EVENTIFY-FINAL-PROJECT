 const express = require("express");
  const router = express.Router();


   const { createVenue, getVenueByCity, getVenueById} = require("../controllers/venueController");

   const { auth, isAdmin } = require("../middlewares/auth");
  
   console.log("auth:", auth);
console.log("isAdmin:", isAdmin);
console.log("createVenue:", createVenue);

   router.post("/create-venue",  createVenue);// add auth , and isadmin later

   router.get("/city/:cityId",getVenueByCity);
   router.get("/:id", getVenueById);


   module.exports = router;
   