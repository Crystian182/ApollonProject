const measureRoutes = require('./measure_routes');
module.exports = function(app, db) {
  measureRoutes(app, db);
  // Other route groups could go here, in the future
};