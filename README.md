## GrubDash-BackEnd
As a backend developer for GrubDash, this project aims to build an API for handling dishes and orders. It's designed to demonstrate skills in working with Express, implementing RESTful design principles, validation, and middleware functions.

# Tasks:
## Dishes
* dishes.controller.js: Implement handlers and middleware for CRUD operations on dishes.
* dishes.router.js: Define routes /dishes and /dishes/:dishId and attach corresponding handlers.
## Orders
* orders.controller.js: Implement handlers and middleware for CRUD operations on orders.
* orders.router.js: Define routes /orders and /orders/:orderId and attach corresponding handlers.
## Validation
* Implement validation logic for each route. Ensure appropriate error messages and status codes for validation failures.

  
# Routes
## Dishes
* GET /dishes: Retrieve a list of all existing dishes.
* POST /dishes: Create a new dish.
* GET /dishes/:dishId: Retrieve a specific dish.
* PUT /dishes/:dishId: Update a specific dish.
## Orders
* GET /orders: Retrieve a list of all existing orders.
* POST /orders: Create a new order.
* GET /orders/:orderId: Retrieve a specific order.
* PUT /orders/:orderId: Update a specific order.
* DELETE /orders/:orderId: Delete a specific order.
## Validation
* Ensure validation for properties like name, description, price, image_url, deliverTo, mobileNumber, status, and dishes.
* Handle validation failures with proper error messages and status codes (e.g., 400).
