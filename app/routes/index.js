const measureRoutes = require('./measure_routes');
const userRoutes = require('./user_routes');
module.exports = function(app, mongodb) {
  measureRoutes(app, mongodb);
  userRoutes(app);
  // Other route groups could go here, in the future
};