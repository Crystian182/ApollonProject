const misurazioneRoutes = require('./misurazione_routes');
const personaRoutes = require('./persona_routes');
const recapitoRoutes = require('./recapito_routes');
const centralinaRoutes = require('./centralina_routes');

module.exports = function(app, mongodb) {
  misurazioneRoutes(app, mongodb);
  centralinaRoutes(app, mongodb);
  personaRoutes(app);
  recapitoRoutes(app);
  // Other route groups could go here, in the future
};