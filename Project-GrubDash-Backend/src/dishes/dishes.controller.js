const path = require("path");
const dishes = require(path.resolve("src/data/dishes-data"));
const nextId = require("../utils/nextId");

// Middleware functions for checking dish-related conditions

// Check if a dish with the specified ID exists
const dishExists = (req, res, next) => {
   const dishId = req.params.dishId;
   res.locals.dishId = dishId;
   const foundDish = dishes.find((dish) => dish.id === dishId);
   if (!foundDish) {
      return next({
         status: 404,
         message: `Dish not found: ${dishId}`,
      });
   }
   res.locals.dish = foundDish;
};

// Validate the presence of a dish name in the request body
const dishValidName = (req, res, next) => {
   const { data = null } = req.body;
   res.locals.newDD = data;
   const dishName = data.name;
   if (!dishName || dishName.length === 0) {
      return next({
         status: 400,
         message: "Dish must include a name",
      });
   }
};

// Validate the presence and validity of a dish description
const dishHasValidDescription = (req, res, next) => {
   const dishDescription = res.locals.newDD.description;
   if (!dishDescription || dishDescription.length === 0) {
      return next({
         status: 400,
         message: "Dish must include a description",
      });
   }
};

// Validate the presence and validity of a dish price
const dishHasValidPrice = (req, res, next) => {
   const dishPrice = res.locals.newDD.price;
   if (!dishPrice || typeof dishPrice !== "number" || dishPrice <= 0) {
      return next({
         status: 400,
         message: "Dish must have a price that is an integer greater than 0",
      });
   }
};

// Validate the presence of a dish image URL
const dishHasValidImage = (req, res, next) => {
   const dishImage = res.locals.newDD.image_url;
   if (!dishImage || dishImage.length === 0) {
      return next({
         status: 400,
         message: "Dish must include an image_url",
      });
   }
};

// Check if the dish ID in the request body matches the ID in the route parameters
const dishIdMatches = (req, res, next) => {
   const paramId = res.locals.dishId;
   const { id = null } = res.locals.newDD;
   if (paramId != id && id) {
      return next({
         status: 400,
         message: `Dish id does not match route id. Dish: ${id}, Route: ${paramId}`,
      });
   }
};

// Clarity Middleware Functions

// Middleware for validating inputs during dish creation
const createValidation = (req, res, next) => {
   dishValidName(req, res, next);
   dishHasValidDescription(req, res, next);
   dishHasValidPrice(req, res, next);
   dishHasValidImage(req, res, next);
   next();
};

// Middleware for validating inputs during dish reading
const readValidation = (req, res, next) => {
   dishExists(req, res, next);
   next();
};

// Middleware for validating inputs during dish update
const updateValidation = (req, res, next) => {
   dishExists(req, res, next);
   dishValidName(req, res, next);
   dishHasValidDescription(req, res, next);
   dishHasValidPrice(req, res, next);
   dishHasValidImage(req, res, next);
   dishIdMatches(req, res, next);
   next();
};

// Handlers

// Handle the creation of a new dish
function create(req, res) {
   const newDishData = res.locals.newDD;
   newDishData.id = nextId();
   dishes.push(newDishData);
   res.status(201).json({ data: newDishData });
}

// Handle reading a specific dish
function read(req, res) {
   res.status(200).json({ data: res.locals.dish });
}

// Handle updating an existing dish
function update(req, res) {
   const newData = res.locals.newDD;
   const oldData = res.locals.dish;
   const index = dishes.indexOf(oldData);
   for (const key in newData) {
      dishes[index][key] = newData[key];
   }
   res.status(200).json({ data: dishes[index] });
}

// Handle listing all dishes
function list(req, res) {
   res.status(200).json({ data: dishes });
}

// Export middleware and handlers
module.exports = {
   create: [createValidation, create],
   read: [readValidation, read],
   update: [updateValidation, update],
   list,
};
