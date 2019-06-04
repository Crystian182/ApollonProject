const misurazioneRoutes = require('./misurazione_routes');
const personaRoutes = require('./persona_routes');

module.exports = function(app, mongodb) {
  misurazioneRoutes(app, mongodb);
  personaRoutes(app);
  // Other route groups could go here, in the future
};