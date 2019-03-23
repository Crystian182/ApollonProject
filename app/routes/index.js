const measureRoutes = require('./measure_routes');
const userRoutes = require('./user_routes');
module.exports = function(app, db) {
  measureRoutes(app, db);
  userRoutes(app, db);
  // Other route groups could go here, in the future
};