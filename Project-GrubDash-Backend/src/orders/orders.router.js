const router = require("express").Router();
const controller = require("./orders.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// Routes for the "/orders" endpoint
router
   .route("/")
   .get(controller.list)   // Handle GET requests for the list of orders
   .post(controller.create)   // Handle POST requests to create a new order
   .all(methodNotAllowed);   // Handle all other HTTP methods with a method not allowed response

// Routes for the "/orders/:orderId" endpoint
router
   .route("/:orderId")
   .get(controller.read)   // Handle GET requests for a specific order
   .put(controller.update)   // Handle PUT requests to update a specific order
   .delete(controller.delete)   // Handle DELETE requests to delete a specific order
   .all(methodNotAllowed);   // Handle all other HTTP methods with a method not allowed response

module.exports = router;
