const measureRoutes = require('./measure_routes');
const userRoutes = require('./user_routes');
const personaRoutes = require('./persona_routes');
const recapitoRoutes = require('./recapito_routes');

module.exports = function(app, mongodb) {
  measureRoutes(app, mongodb);
  userRoutes(app);
  personaRoutes(app);
  recapitoRoutes(app);
  // Other route groups could go here, in the future
};