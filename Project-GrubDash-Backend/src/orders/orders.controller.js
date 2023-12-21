const path = require("path");
const orders = require(path.resolve("src/data/orders-data"));
const nextId = require("../utils/nextId");

// Functional Middleware functions:

// Check if an order with the specified ID exists
function orderExists (req, res, next) {
   const orderId = req.params.orderId;
   res.locals.orderId = orderId;
   const foundOrder = orders.find((order) => order.id === orderId);
   if (!foundOrder) {
      return next({
         status: 404,
         message: `Order not found: ${orderId}`,
      });
   }
   res.locals.order = foundOrder;
};

// Validate the presence of deliverTo in the request body
function orderValidDeliverTo (req, res, next) {
   const { data = null } = req.body;
   res.locals.newOD = data;
   const orderDeliverTo = data.deliverTo;
   if (!orderDeliverTo || orderDeliverTo.length === 0) {
      return next({
         status: 400,
         message: "Order must include a deliverTo",
      });
   }

};

// Validate the presence of a mobileNumber in the request body
function orderHasValidMobileNumber (req, res, next) {
   const orderMobileNumber = res.locals.newOD.mobileNumber;
   if (!orderMobileNumber || orderMobileNumber.length === 0) {
      return next({
         status: 400,
         message: "Order must include a mobileNumber",
      });
   }
};

// Validate the presence of dishes in the request body
function orderHasDishes (req, res, next) {
   const orderDishes = res.locals.newOD.dishes;
   if (!orderDishes || !Array.isArray(orderDishes) || orderDishes.length <= 0) {
      return next({
         status: 400,
         message: "Order must include at least one dish",
      });
   }
   res.locals.dishes = orderDishes;
};

// Validate the quantity of each dish in the request body
function orderHasValidDishes (req, res, next) {
   const orderDishes = res.locals.dishes;
   orderDishes.forEach((dish) => {
      const dishQuantity = dish.quantity;
      if (!dishQuantity || typeof dishQuantity !== "number" || dishQuantity <= 0) {
         return next({
            status: 400,
            message: `Dish ${orderDishes.indexOf(dish)} must have a quantity that is an integer greater than 0`,
         });
      }
   });
};

// Check if the order ID in the request body matches the ID in the route parameters
function orderIdMatches (req, res, next) {
   const paramId = res.locals.orderId;
   const { id = null } = res.locals.newOD;
   if (!id || id === null) {
      res.locals.newOD.id = res.locals.orderId;
   } else if (paramId != id) {
      return next({
         status: 400,
         message: `Order id does not match route id. Order: ${id}, Route: ${paramId}`,
      });
   }
};

// Validate the incoming status in the request body
function incomingStatusIsValid (req, res, next) {
   const { status = null } = res.locals.newOD;
   if (!status || status.length === 0 || status === "invalid") {
      return next({
         status: 400,
         message: "Order must have a status of pending, preparing, out-for-delivery, delivered",
      });
   }
};

// Validate that an existing order's status is not "delivered"
function extantStatusIsValid (req, res, next) {
   const { status = null } = res.locals.order;
   if (status === "delivered") {
      return next({
         status: 400,
         message: "A delivered order cannot be changed",
      });
   }
};

// Validate that an existing order's status is "pending"
function extantStatusIsPending (req, res, next) {
   const { status = null } = res.locals.order;
   if (status !== "pending") {
      return next({
         status: 400,
         message: "An order cannot be deleted unless it is pending",
      });
   }
};

// Clarity Middleware Functions

// Middleware for validating inputs during order creation
function createValidation (req, res, next) {
   orderValidDeliverTo(req, res, next);
   orderHasValidMobileNumber(req, res, next);
   orderHasDishes(req, res, next);
   orderHasValidDishes(req, res, next);
   next();
};

// Middleware for validating inputs during order reading
function readValidation (req, res, next) {
   orderExists(req, res, next);
   next();
};

// Middleware for validating inputs during order update
function updateValidation (req, res, next) {
   orderExists(req, res, next);
   orderValidDeliverTo(req, res, next);
   orderHasValidMobileNumber(req, res, next);
   orderHasDishes(req, res, next);
   orderHasValidDishes(req, res, next);
   orderIdMatches(req, res, next);
   incomingStatusIsValid(req, res, next);
   extantStatusIsValid(req, res, next);
   next();
};

// Middleware for validating inputs during order deletion
function deleteValidation (req, res, next) {
   orderExists(req, res, next);
   extantStatusIsPending(req, res, next);
   next();
};

// Handlers:

// Handle the creation of a new order
function create(req, res) {
   const newOrderData = res.locals.newOD;
   newOrderData.id = nextId();
   orders.push(newOrderData);
   res.status(201).json({ data: newOrderData });
}

// Handle reading a specific order
function read(req, res) {
   res.status(200).json({ data: res.locals.order });
}

// Handle updating an existing order
function update(req, res) {
   const newData = res.locals.newOD;
   const oldData = res.locals.order;
   const index = orders.indexOf(oldData);
   for (const key in newData) {
      orders[index][key] = newData[key];
   }
   res.status(200).json({ data: orders[index] });
}

// Handle listing all orders
function list(req, res) {
   res.status(200).json({ data: orders });
}

// Handle the deletion of an existing order
function destroy(req, res) {
   const index = orders.indexOf(res.locals.order);
   orders.splice(index, 1);
   res.sendStatus(204);
}

// Export middleware and handlers
module.exports = {
   create: [createValidation, create],
   read: [readValidation, read],
   update: [updateValidation, update],
   delete: [deleteValidation, destroy],
   list,
};
