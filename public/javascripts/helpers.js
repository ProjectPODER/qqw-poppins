var register = function(Handlebars) {
  //This should vary according to environment
  const API_DOMAIN = "http://localhost:10010";
  const AUTOCOMPLETE_URL = API_DOMAIN+"/v1/autocomplete";
  const FEED_URL = 'https://www.rindecuentas.org/feed/';
  const API_BASE = API_DOMAIN+"/v1";

  let config = {
    "API_DOMAIN": API_DOMAIN,
    "AUTOCOMPLETE_URL": AUTOCOMPLETE_URL,
    "API_BASE": API_BASE,
    "FEED_URL": FEED_URL
  }

  app.set("config",config);


  var helpers = {
    // put all of your helpers inside this object
    api_domain: function() { return app.get("config").API_DOMAIN; },
    autocomplete_url: function() { return app.get("config").AUTOCOMPLETE_URL; },
    moment: function(date) {
      console.log("moment",date);
      if (date) {
        moment_helper = require('helper-moment');
        return moment_helper(date);
      }
      return "Fecha desconocida";
    },
    format_amount: function(value) {
      if (value) {
        return value.toLocaleString('es-MX',
          {
            style: 'currency',
            currency: "MXN",
            maximumFractionDigits: 2,
          });
      }
      return 'Importe desconocido';
    },
    format_currency: function(value) {
      if (value == "MXN") {
        return "Pesos mexicanos"
      }
      else if (value == "USD") {
        return "Dólares estadounidenses"
      }
      else if (value == "EUR") {
        return "Euros"
      }
      return value;
    }
  };

  if (Handlebars && typeof Handlebars.registerHelper === "function") {
    // register helpers
    for (var prop in helpers) {
        Handlebars.registerHelper(prop, helpers[prop]);
    }
  } else {
      // just return helpers object if we can't register helpers here
      return helpers;
  }

};

module.exports.register = register;
module.exports.helpers = register(null);
