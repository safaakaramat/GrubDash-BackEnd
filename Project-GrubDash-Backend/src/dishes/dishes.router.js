const router = require("express").Router();
const controller = require("./dishes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// Routes for the "/dishes" endpoint
router
   .route("/")
   .get(controller.list)   // Handles GET requests for the list of dishes
   .post(controller.create)   // Handles POST requests to create a new dish
   .all(methodNotAllowed);   // Handles all other HTTP methods with a method not allowed response

// Routes for the "/dishes/:dishId" endpoint
router
   .route("/:dishId")
   .get(controller.read)   // Handles GET requests for a specific dish
   .put(controller.update)   // Handles PUT requests to update a specific dish
   .all(methodNotAllowed);   // Handles all other HTTP methods with a method not allowed response

module.exports = router;
