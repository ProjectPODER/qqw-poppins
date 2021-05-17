const _ = require('lodash')
const util = require('util');
const moment_helper = require('helper-moment');
const constants = require('./const');
const countries = require("i18n-iso-countries");
const I18n = require('./i18n');
const { isNumber } = require('lodash');
const { sourcesPage } = require('./lib');

const helpers = {
  _: function(text, options) {
    const bindings = {};
    const lang = helpers.lang(options);

    if (!options) {
      return "helpers._ error, called without options: "+text;
    }

    try {
      if (!options.data.root.settings["i18n-"+lang]) {
        options.data.root.settings["i18n-"+lang] = new I18n(lang);
      }

      if (options.hash) {
        let prop;
        for (prop in options.hash) {
          if (Object.prototype.hasOwnProperty.call(options.hash, prop)) {
              bindings[prop] = options.hash[prop];
          }
        }
      }
      return options.data.root.settings["i18n-"+lang].t(text, bindings);
    }
    catch(e) {
      if (e.message == "Invalid locale") {
        throw("Invalid locale")

      } 
      return text;
    }
  },
  first_key: function(object) {
    let keys = Object.keys(object);
    return keys.sort()[0];
  },
  last_key: function(object) {
    let keys = Object.keys(object);
    return keys.sort()[keys.length-1];
  },
  first_value: function(object) {
    let values = Object.values(object);
    let sortedValues = values.sort(function(a, b){return a - b}); 
    // console.log(sortedValues);
    return sortedValues[0];
  },
  last_value: function(object,property,options) {
    let values = Object.values(object);
    let sortedValues;
    if (property && options) {
      sortedValues = values.sort(function(a, b){return a[property] - b[property]}); 
      return sortedValues[values.length-1][property];
    }
    else {
      sortedValues = values.sort(function(a, b){return a - b});       
      return sortedValues[values.length-1];
    }
    // console.log(sortedValues);
  },
  lang: function(options) {
    if (!options) {
      return "helpers.lang error, called without options";
    }
    if (typeof options == "string") {
      return options;
    }

    const default_lang = options.data.root.general.default_lang ? options.data.root.general.default_lang[0][helpers.env()] : "es";
    const current_lang = options.data.root.lang;
    const lang = current_lang || default_lang;

    return lang;
  },
  url: function(options) {
    function findViewByUrl(url) {
      route = constants.qqw_routes.filter(route => {
        // console.log("findViewByUrl",route);
        if (route.es == url || route.en == url) {
          return true;
        }
      })
      // console.log("findViewByUrl",url,route);
      //Will return only the first match from the qqw_routes array
      return route[0];
    }

    function extract(url) {
      // console.log("url extract",url)
      let split = url.split(/\//)
      let routeWithParams = split[2].split("?");
      let params = (routeWithParams[1] ? routeWithParams[1].split("&") : []);

      components = {
        lang: split[1],
        view: routeWithParams[0]
      };

      params.map(param => {
        paramSplit = param.split("=")
        components[paramSplit[0]] = paramSplit[1];
      } )


      return components;
    }
    function compile(components) {
      // console.log("url compile",components)
      view = findViewByUrl(components.view)
      if (view) {
        view_url = view[components.lang];

        if (!view_url) {
          console.error("url compile","Called view with undefined lang",components.lang)
          view_url = view[helpers.lang(options)];
        }
      }

      if (!view_url) {
        // console.log("url compile helper","unknown route",components);
        view_url = "unknown"
      }

      let parameters = [];
      let anchor = "";
      for (component_index in Object.keys(components)) {
        let component = Object.keys(components)[component_index];
        if (component == "view" || component == "lang") {
          continue;
        }
        //URL params start with underscore
        if (component.slice(0,1)=="_") {
          //Url #anchor starts with underscore too
          if (component == "_anchor") {
            anchor = components[component];
          }
          else {
            let replacementComponent = components[component] ? encodeURIComponent(components[component]) : "";
            view_url = view_url.replace(":"+component.slice(1),replacementComponent);
          }
        }
        else {
          parameters.push(component+"="+components[component])
        }
      }
      let url = "/"+components.lang+"/"+view_url
      url+=(parameters.length > 0 ? "?"+parameters.join("&") : "");
      url+=(anchor.length > 0 ? "#"+anchor : "");
      return url;
    }

    if (!options.data) {
      console.error("url helper called without options.data (check for parameters without name)",options);
      return options;
    }

    let url_components = {};

    // if (!options.hash.view) {
      url_components = extract(options.data.root.current_url);
    // }

    let new_url_components = {};
    Object.assign(new_url_components, url_components, options.hash);

    return compile(new_url_components);
  },
  get_source_description(source,options) {
    return helpers._("source_description_"+source,options);
    current_lang = options.data.root.lang;
    if (options.data.root.general["source_description_"+source]) {
      return options.data.root.general["source_description_"+source][current_lang];
    }
    else { return source }
  },
  get_countries(areas) {
    return _.filter(areas,["classification","country"]);
  },
  fix_url(url) {
    const { URL } = require('url')

    try {
      if (!url.startsWith('https://') && !url.startsWith('http://')) {
        // The following line is based on the assumption that the URL will resolve using https.
        // Ideally, after all checks pass, the URL should be pinged to verify the correct protocol.
        // Better yet, it should need to be provided by the user - there are nice UX techniques to address this.
        url = `https://${url}`
      }

      const normalizedUrl = new URL(url);

      return {
        href: normalizedUrl.href,
        host: normalizedUrl.host
      };

      // Do your thing
    } catch (e) {
      console.error('Invalid url provided', e)
    }

  } ,
  conf: function(option,options) {
    
    if (options.data.root.general && options.data.root.general[option]) {
      return options.data.root.general[option][0][helpers.env()];
    }
    else {
      // console.error("conf","undefined conf",options)
      return;
    }
  },
  api_domain: function() { return process.env.API_DOMAIN; },
  env: function() { return process.env.NODE_ENV || "staging"; },
  autocomplete_url: function() { return process.env.AUTOCOMPLETE_URL; },
  moment: function(date, pattern, options) {
    if (date) {
      try {
        return moment_helper(date, pattern, options);
      }
      catch(e) {
        console.error("moment helper",e);
        return "Fecha desconocida";
      }
    }
    return "Fecha desconocida";
  },
  encode: function(string) {
    return encodeURIComponent(string)
  },
  _number_to_text: function(value) {
    let suffix=""

    value = parseFloat(value);

    if (value >= 1000000000000000000) {value /= 1000000000000000000; suffix="trillones"}
    else if (value >= 1000000000000000) {value /= 1000000000000000; suffix="mil billones"}
    else if (value >= 1000000000000) {value /= 1000000000000; suffix="millones de millones"}
    else if (value >= 1000000000) {value /= 1000000000; suffix="mil millones"}
    else if (value >= 1000000) {value /= 1000000; suffix="millones"}
    // else if (value >= 10000) {value /= 1000; suffix="mil"}

    return {value: value, suffix: suffix}
  },
  format_amount: function(value, currency, options) {
    let formatted = "";
    if (value) {
      nt = helpers._number_to_text(value);
      if (value > 10) {

        formatted = nt.value.toLocaleString('es-MX', {style: "decimal", maximumFractionDigits: 1});
      }
      else {
        formatted = nt.value.toLocaleString('es-MX', {style: "decimal", maximumSignificantDigits: 3});
      }      
      if (nt.suffix) {
        formatted+= " " + nt.suffix
        if (options) {
         formatted+= " de"
        }
      }
      if (options) {
        formatted+= " " + helpers.format_currency(currency, options)
      }
      else {
        formatted+= " " + helpers.format_currency("",currency)
      }

      if (nt.suffix) {
        formatted+= " (" + value.toLocaleString('es-MX')
        if (options) {

          formatted+= " " + currency
        }
        formatted+=")"
      }
      return formatted;
    }
    return 'Importe desconocido';
  },
  j: function(obj) {
    return util.inspect(obj,{ depth: 5, maxArrayLength: 10000 }).replace(RegExp("&#x27;","g"),"\"").replace(RegExp("&#x27;","g"),"\"");
  },
  get_year: function(date) {
    //TODO
    return date;
  },
  flag_name: function (flag_id) {
    return constants.flag_categories[flag_id];
  },
  contract_category_min: function(category) {
    return constants.contract_categories_min_max["min-contract_score-"+category];
  },
  contract_category_max: function(category) {
    return constants.contract_categories_min_max["max-contract_score-"+category];
  },
  party_category_min: function(category) {
    let selector = "";
    switch (category) {
      case "conf": selector = "node_rules-conf"; break;
      case "comp": selector = "node_categories-comp"; break;
      case "traz": selector = "node_categories-traz"; break;
      case "temp": selector = "contract_categories-temp"; break;
      case "trans": selector = "contract_categories-trans"; break;
    }
    return constants.party_categories_min_max["min-"+selector];
  },
  party_category_max: function(category) {
    let selector = "";
    switch (category) {
      case "conf": selector = "node_rules-conf"; break;
      case "comp": selector = "node_categories-comp"; break;
      case "traz": selector = "node_categories-traz"; break;
      case "temp": selector = "contract_categories-temp"; break;
      case "trans": selector = "contract_categories-trans"; break;
    }
    return constants.party_categories_min_max["max-"+selector];
  },
  contract_recommendations: function(flag) {
    return constants.flag_details[flag];
  },
  get_party_categories: function(flags) {
    // console.log(JSON.stringify(flags,null,4));
    if (flags.contract_categories) {
      return {
        "trans": flags.contract_categories.trans,
        "temp": flags.contract_categories.temp,
        "comp": flags.node_categories.comp,
        "traz": flags.node_categories.traz,
        "conf": flags.node_rules.conf,
      }
    }
    else {
      return {"error": "no flags"};
    }
  },
  flag_recommendations: function (org_flags, count) {
    // console.log(JSON.stringify(org_flags,null,4));
    const flagsDiff = [];
    let flagsLimit = count || 3;
    // console.log("flag_recommendations",flagsLimit,count)

    function get_min(flag_id) {
      if (constants.party_categories_min_max["min-node_rules-"+flag_id] !== undefined) {
        return constants.party_categories_min_max["min-node_rules-"+flag_id];
      }
      else {
        return  constants.party_categories_min_max["min-contract_rules-"+flag_id];
      }
    }

    // const allFlags = _.merge(org_flags[0].node_rules,org_flags[0].contract_rules);
    const allFlags = _.merge(org_flags[0].node_rules,org_flags[0].contract_rules);
    // console.log("allFlags",allFlags);
    _.forEach(allFlags,(i,flag_id,flags) => {
      if (flag_id != "total_score") {
        //Seleccionar las 3 más cercanas al mínimo.
        const diff = get_min(flag_id)-parseFloat(flags[flag_id]);
        flagsDiff.push({
          flag_id: flag_id,
          diff: diff
        })
        // console.log(flag_id,"diff",flagsDiff[flag_id],"score",flags[flag_id],"min",flag_minimum);
      }
    })

    // //sort flags
    // okeys = Object.keys(flagsDiff),
    // sortedFlags = {};
    // okeys.sort((p,c) => flagsDiff[p] <= flagsDiff[c]).forEach((p,i) => sortedFlags[okeys[i]] = flagsDiff[p]);
    sortedFlags = _.orderBy(flagsDiff,"diff","desc");
    // console.log("sortedFlags",sortedFlags);
    // const sortedFlagKeys = Object.keys(sortedFlags);

    const recommendations = []

    for (var i = 0;  i < flagsLimit; i++) {
      const flag = sortedFlags[i];
      if (flag && constants.flag_details[flag.flag_id]) {
        if (constants.flag_details[flag.flag_id].hidden_uc) {
          // console.log("hidden",flag.flag_id);
          flagsLimit++;
          continue;
        }
        if (allFlags[flag.flag_id] === 0) {
          // console.log("Saltando cero",flag.flag_id);
          flagsLimit++;
          continue;
        }
        const recommendation = _.clone(constants.flag_details[flag.flag_id]);
        recommendation.score = allFlags[flag.flag_id];
        recommendation.minimum = get_min(flag.flag_id);
        recommendations.push(recommendation);
      }
      else {
        // console.error("flag_recommendations","Asked for too many flags",i); //,flag.flag_id,constants.flag_details[flag.flag_id]);
      }
    }
    return recommendations;
  },
  lower: function(string) {
    if (!string) return "";
    return string.toLowerCase();
  },
  filter_array: function(haystack,property,needle) {
    const search = {};
    search[property] = needle;
    const item = _.find(haystack,search);
    // console.log("filter_array",search,item);
    return item;
  },
  get_object_element: function(object,element) {
    console.log("get_object_element - replace with lookup - called for",object,element)
    if (object) {
      return object[element]
    }
  },
  or: function(a,b) {
    return a || b;
  },
  format_score: function(value) {
    //TODO
    if (value || value === 0) {
      return (value*100).toLocaleString('es-MX',
        {
          style: 'decimal',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })+"%";
    }
    return '(no evaluado)';
  },
  format_currency: function(value, options) {
    if (["MX", "MXN"].includes(value)) {
      return "pesos mexicanos"
    }
    else if (value == "USD") {
      return "dólares estadounidenses"
    }
    else if (value == "EUR") {
      return "euros"
    }
    else {
      return '<i class="fas fa-info-circle text-gray"  title="'+helpers._("Este importe no especifica moneda, los valores podrían estar en varias monedas.",options)+'"></i>';

    }
  },
  limit: function (arr, limit) {
    if (!Array.isArray(arr)) {
      return []; }
    return arr.slice(0, limit);
  },
  'var': function(name, value){
    this[name] = value;
  },
  math: function(lvalue, operator, rvalue) {

    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
  },
  ifCond: function (v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '!!':
            return (!v1 && !v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
  },
  hidden_claves: function() {
    return ["999.999.9999.99","000.000.0000.00"];
  },
  isArray: function(obj) {
    return typeof obj == "object";
  },
  indexOf: function(needle,haystack) {
    return haystack.indexOf(needle);
  },
  format_percentage: function(value) {
    // console.log("format_percentage", value*100);
    formatted = helpers.format_number(value*100);
    if (formatted == "Valor desconocido") {
      return "-"
    }
    else {
      return helpers.format_number(value*100) + " %"
    }
  },
  fix_number: function(value) {
    if (isNumber(value)) {
      return value;
    }
    else {
      return 0;
    }
  },
  format_number: function(value) { 
    if (value || value === 0)  {
      nt = helpers._number_to_text(value);
      let formatted = "";
      if (value > 10) {

        formatted = nt.value.toLocaleString('es-MX', {style: "decimal", maximumFractionDigits: 1});
      }
      else {
        formatted = nt.value.toLocaleString('es-MX', {style: "decimal", maximumSignificantDigits: 3});
      }
      // console.log("format_number",value, formatted);
      if(formatted == "NaN") {
        return "-"
      }

      return formatted + " " + nt.suffix;
    }
    return 'Valor desconocido';
  },
  hilight: function(needle, haystack) {
    if (haystack && needle) {
      const r = new RegExp("("+needle+")","i");
      // console.log("hilight",r,haystack);
      return haystack.replace(r, "<span class='hilight'>$1</span>");
    }
    else {
      console.error("hilight error:",needle,haystack);
      return haystack;
    }
  },
  match: function(needle, haystack) {
    const r = new RegExp("("+needle+")","i");
    // console.log("match",r,haystack);
    if (haystack && haystack.toString().match(r)) {
      return true;
    }
    else if (haystack && typeof haystack[0] == "object") {
      for (e in haystack) {
        // console.log("match",haystack[e],haystack[e].name.toString(),r);
        if (haystack[e].name && haystack[e].name.toString().match(r)) {
          return true;
        }
      }
    }
    return false;
  },
  match_filter: function(needle, haystack) {
    console.log("match_filter",needle)
    const r = new RegExp("("+needle.replace(/\(/g,"\\(").replace( /\)/g, "\\)" ) + ")","i");
    // console.log("match",r,haystack);
    if (haystack && haystack.toString().match(r)) {
      return haystack;
    }
    else if (haystack && typeof haystack[0] == "object") {
      for (e in haystack) {
        // console.log("match",haystack[e],haystack[e].name.toString(),r);
        if (haystack[e].name && haystack[e].name.toString().match(r)) {
          return haystack[e];
        }
      }
    }
    return false;
  },
  get_record_flags: function(contract_flags) {
    // console.log("get_record_flags 1",contract_flags);
    const record_flags = {
      total_score: 0,
      trans: 0,
      temp: 0,
      comp: 0,
      traz: 0,
      rules: []
    }
    const rules = {};

    for (contract in contract_flags) {
      record_flags.total_score += contract_flags[contract].contract_score.total_score;
      record_flags.trans += contract_flags[contract].contract_score.trans;
      record_flags.temp += contract_flags[contract].contract_score.temp;
      record_flags.comp += contract_flags[contract].contract_score.comp;
      record_flags.traz += contract_flags[contract].contract_score.traz;

      for (category in contract_flags[contract].rules_score) {
        for (rule in contract_flags[contract].rules_score[category]) {
          if (contract_flags[contract].rules_score[category][rule] === 0) {
            if (!rules[rule]) {
              rules[rule] = 1;
            }
            else {
              rules[rule]++;
            }
          }
        }
      }
    }
    record_flags.total_score = record_flags.total_score/contract_flags.length
    record_flags.trans = record_flags.trans/contract_flags.length;
    record_flags.temp = record_flags.temp/contract_flags.length;
    record_flags.comp = record_flags.comp/contract_flags.length;
    record_flags.traz = record_flags.traz/contract_flags.length;
    for (rule in rules) {
      let rule_obj = {
        name: rule,
        count: rules[rule]
      };
      record_flags.rules.push(rule_obj);
    }

    // console.log("get_record_flags 2",record_flags);

    return record_flags;
  },
  get_subclass_name: function(subclass,options) {
    if (constants.subclass_names[subclass]) {
      return helpers._(constants.subclass_names[subclass],options);
    }
    else {
      console.log("get_type_singular unknown",subclass);
      return helpers._("Entidad",options);
    }
  },
  get_classification_type: function(classification) {
    if (typeof classification == "object") {
      classification = classification[0];
    }
    switch (classification) {
      case "person": return "persons";
      case "funcionario": return "persons";
      case "proveedor": return "persons";
      case "boardmember": return "persons";
      case "shareholder": return "persons";
      case "purchase": return "contracts";
      case "contract": return "contracts";
      case "company": return "companies";
      case "banco": return "companies";
      case "institution": return "institutions";
      case "dependencia": return "institutions";
      case "unidad-compradora": return "institutions";
      case "city": return "areas";
      case "municipality": return "areas";
      case "state": return "areas";
      case "country": return "areas";
      case "Ropa y Telas": return "products";
      case "Material médico": return "products";
      case "Artículos de consumo": return "products";
      case "Medicinas y vacunas": return "products";
      case "Mobiliario": return "products";
      
      
      default:
        console.error("get_classification_type: Unknown classification:",classification);
        return false;
    }
  },
  cobranding: function(sources, unique_field) {
    const brands = []
    const sources_list = []
    if (typeof unique_field == "object") { unique_field = "data_name" }
    
    for (s in sources) {
      let source_name = sources[s].id;
      if (constants.cobranding_sources.hasOwnProperty(source_name)) {
        // console.log("cobranding",sources_list.indexOf(source_name),source_name,sources_list)
        let brand = constants.cobranding_sources[source_name];
        if (sources_list.indexOf(brand[unique_field]) == -1) {
          sources_list.push(brand[unique_field]);
          brands.push(brand);
        }
      }
    }
    return brands;
    
  },
  get_classification_name: function(type,classification,subclassification,govLevel,options) {

    //Fix product subclassifications. If there's only undefined, use that.
    if (constants.classification_names[type] && constants.classification_names[type][classification]) {
      if (!constants.classification_names[type][classification][subclassification] && constants.classification_names[type][classification]["undefined"]) {
        subclassification = "undefined";
      }
    }
    if (constants.classification_names[type] && constants.classification_names[type][classification] && constants.classification_names[type][classification][subclassification] && constants.classification_names[type][classification][subclassification][govLevel]) {

      return helpers._(constants.classification_names[type][classification][subclassification][govLevel],options);
    }
    else {
      console.log("get_classification_name unknown:",type,classification,subclassification,govLevel);
      return helpers._("Entidad",options)+" "+type+" "+classification+" "+subclassification+" "+govLevel;
    }
  },
  get_classification_icon: function(classification,subclassification,govLevel) {
    function getValue(value) {
      if (typeof value =="object" && value.length == 1) {
        return value[0]
      }
      else {
        return value;
      }
    }
    const product_classifications =  ["Artículos de consumo","Material médico","Medicinas y vacunas","Mobiliario","Ropa y Telas"];

    if (product_classifications.indexOf(classification[0]) > -1) {
      subclassification = "undefined";
    }

    
    if (constants.classification_icons[getValue(classification)] && constants.classification_icons[getValue(classification)][getValue(subclassification)] && constants.classification_icons[getValue(classification)][getValue(subclassification)][getValue(govLevel)]) {
      // console.log("get_classification_name found",type,role_names[type][directionality].label);
      icon = constants.classification_icons[classification][subclassification][govLevel];
    }
    else {
      console.log("get_classification_icon unknown:",classification,subclassification,govLevel);
      icon = "fa-circle";
    }
    return "<i class='fas "+icon+"'></i> ";
  },

  get_role_name: function(type,directionality,options) {
    // console.log("get_role_name 1",type,directionality)
    if (constants.role_names[type] && constants.role_names[type][directionality]) {
      // console.log("get_role_name found",type,role_names[type][directionality].label);
      return helpers._(constants.role_names[type][directionality].label,options);
    }
    else {
      console.log("get_role_name unknown",directionality,type);
      return type;
    }
  },
  get_role_icon: function(type,directionality) {

    if (constants.role_names[type] && constants.role_names[type][directionality]) {
      icon = constants.role_names[type][directionality].icon;
      // console.log("get_role_icon found",type,icon);
    }
    else {
      console.log("get_role_icon unknown",type);
      icon = "fa-building";
    }
    return "<i class='fas "+icon+"'></i> ";
  },
  get_type_collection: function(type, short=false) {
    switch(type) {
      case "company":
        return "companies";
      case "institution":
        return "institutions";

      case "person":
        return "persons";

      case "contract":
        return "contracts";

      default:
        console.log("get_type_collection unknown",type);
        return "entities";
    }
  },
  get_type_plural: function(type, short=false, options) {
    // console.log("get_type_plural",type, short)
    if (constants.type_names[type]) {
      if (short) {
        return helpers._(constants.type_names[type].plural_short,options);
      }
      else {
        return helpers._(constants.type_names[type].plural,options);
      }
    }
    else {
      console.log("get_type_plural unknown",type);
      return helpers._("Todas",options);
    }
  },
  get_type_singular: function(type,options) {
    if (constants.type_names[type]) {
      return helpers._(constants.type_names[type].singular,options);
    }
    else {
      console.log("get_type_singular unknown",type);
      return helpers._("Entidad",options);
    }
  },
  get_type_url: function(type,classification,recursion) {
    if (!type) {
      if (!isNumber(recursion)) {
        recursion = 0;
      }
      else {
        recursion++;
      }
      if (recursion > 2) {
        console.error("get_type_url error",classification,recursion)
        return "error";
      }
      return helpers.get_type_url(classification,"",recursion);
    }

    //Dealing with arrays in the data
    if (typeof type == "object") {
      type = type[0]
    }

    switch(type) {
      case "organizations": return helpers.get_type_url(classification);
      case "institutions": return "instituciones-publicas/:id";
      case "institution": return "instituciones-publicas/:id";
      case "municipality": return "regiones/:id";
      case "city": return "regiones/:id";
      case "state": return "regiones/:id";
      case "country": return "regiones/:id";
      case "areas": return "regiones/:id";
      case "company": return "empresas/:id";
      case "companies": return "empresas/:id";
      case "contract": return "contratos/:id";
      case "contracts": return "contratos/:id";
      case "person": return "personas/:id";
      case "persons": return "personas/:id";
      case "shareholder": return "personas/:id";
      case "boardmember": return "personas/:id";
      case "proveedor": return "personas/:id";
      case "owner": return "personas/:id";
      case "funcionario": return "personas/:id";
      case "funder": return "instituciones-publicas/:id";
      case "countries": return "regiones/:id";
      case "products": return "productos/:id";
      default: console.log("get_type_url unknown. Type: ",type, ". Classification: ",classification); return "unknown";
    }
  },
  get_contract_by_awardid: function(contracts,awardId) {
    // console.log("get_contract_by_awardid",awardId,contracts);
    return _.find(contracts,{"awardID": awardId})
  },
  get_party: function(records,party_id) {
    let party;
    if (records) {
      party = _.find(records.parties,{id: party_id});
      // console.log("get_party_type records parties", records.parties);
      if (!party) {
        party = _.find(records.parties,(party) => {
          // console.log(party.memberOf,party_id);
          if (party.memberOf) { return party.memberOf[0].id == party_id }
          // console.log("get_party_type memberOf",party);
        })
        // console.log("get_party_type",party)
        if (party) {
          return party;
        }
      }
      if (party && party.details) {
        return party;
      }
      else {
        console.log("get_party not found",party_id);
        return "unknown";
      }
    }
    else {
      console.log("get_party no record");
      return "unknown";

    }
  },
  get_record_funder: function(records) {
    let party;
    if (records) {
      party = _.find(records.compiledRelease.parties,{roles: ["funder"]});
      if (party) {
        return party;
      }
      else {
        console.log("get_record_funder not found");
        return null;
      }
    }
    else {
      // console.log("get_record_funder no record");
      return null;

    }
  },
  get_contract_funder: function(records) {
    let party;
    if (records) {
      party = _.find(records.parties,{roles: ["funder"]});
      if (party) {
        return party;
      }
      else {
        console.log("get_record_funder not found");
        return null;
      }
    }
    else {
      console.log("get_record_funder no record");
      return null;

    }
  },
  url_csv: function(url) {
    if (url) {
      return url+="&format=csv"
    }
  },
  url_page: function(url) {
    if (url) {
      return url
    }
  },
  concat: function(a,b) {
    return a+b;
  },
  translate_area: function(value,lang) {
    //TODO: multilang
    if (value == "Mexico") {
      return "México"
    }
    else if (value == "Mexico City") {
      return "Ciudad de México"
    }
    else if (countries.isValid(value)) {
      return countries.getName(value,"es");
    }
    else  {
      // console.log("translate_area unknown:",value);
      return value;
    }
  },
  get_govlevel_name: function(govlevel,options) {
    return helpers._(constants.govlevel_names[govlevel],options) || govlevel+helpers._(" (desconocido)",options);
  },
  get_bool: function(bool,options) {
    if (bool) { return helpers._("Si",options) }
    else { return helpers._("No",options) }
  },
  get_variation_direction_more_better: function(new_value,old_value) {
    if (old_value == new_value) {
      return "equals";
    }
    if (old_value > new_value) {
      return "chevron-down";
    }
    if (old_value < new_value) {
      return "chevron-up";
    }
  },
  get_variation_direction_more_worst: function(new_value,old_value) {
    if (old_value == new_value) {
      return "equals";
    }
    if (old_value > new_value) {
      return "chevron-up";
    }
    if (old_value < new_value) {
      return "chevron-down";
    }
  },
  generate_consejeras_por_empresa: function(result) {
    const ec = (result.id == "ec"); //Ecuador no tiene 2019
    let response = {};
    let buckets = {};
    response.summaries = [];
    // console.log(JSON.stringify(result.summaries))
    for (b in result.summaries["2020"].consejeras_por_empresa) {
      let newBucket = {};
      newBucket.consejeras_count = result.summaries["2020"].consejeras_por_empresa[b].consejeras_count;
      newBucket.datos2020 = result.summaries["2020"].consejeras_por_empresa[b].companies_count;
      newBucket.datos2019 = 0;
      buckets[newBucket.consejeras_count] = newBucket;
    }
    if (!ec) {
      for (b in result.summaries["2019"].consejeras_por_empresa) {
        let consejeras_count = result.summaries["2019"].consejeras_por_empresa[b].consejeras_count;
        if (buckets[consejeras_count]) {
          buckets[consejeras_count].datos2019 = result.summaries["2019"].consejeras_por_empresa[b].companies_count;
        }
        else {
          let newBucket = {};
          newBucket.consejeras_count = result.summaries["2019"].consejeras_por_empresa[b].consejeras_count;
          newBucket.datos2020 = 0;
          newBucket.datos2019 = result.summaries["2019"].consejeras_por_empresa[b].companies_count;
          buckets[newBucket.consejeras_count] = newBucket;
        }
      }
    }
    for (b in buckets) {
      response.summaries.push(buckets[b]);
    }
    return response;
  },
  get_publisher_logo: function(publisher_name) {
    if (constants.publisher_logos[publisher_name]) {
      return "/mujeresenlabolsa/images/"+constants.publisher_logos[publisher_name];
    }
    else {
      console.error("get_publisher_logo",publisher_name);
      return "Medio desconocido";
    }
  },
  last_consejeras_count: function(consejeras) {
    return consejeras[consejeras.length-1].consejeras_count;
  },
  pageStats: function() {
    var pjson = require('../package.json');

    return "QQW v"+pjson.version+ " - Generated: "+ new Date();
  },
  get_first_year: function(yearSummary) {
    // console.log("get_first_year",Object.keys(yearSummary)[0],Object.keys(yearSummary))
    return Object.keys(yearSummary).sort()[0];
  },
  get_last_year: function(yearSummary) {
    // console.log("get_last_year",Object.keys(yearSummary)[Object.keys(yearSummary).length -1],Object.keys(yearSummary))
    return Object.keys(yearSummary).sort()[Object.keys(yearSummary).length -1];
  },
  toloco_get_ranking: function(ranking,type) {
    if (ranking) {
      return ranking[type];
    }
    else {
      console.log("toloco_get_ranking",ranking,type);
    }
  },

  toloco_get_concat_item: function (array,c1,c2) {
    // array = [];
    item = array[c1+c2];

    // For things that came directly from mongo
    if (item && item[0]) {
      if (item[0].id) {
        return item;
      }
      else {
        const newitems = [];
        for (i in item) {
          obj = {
            id: item[i].party.id,
            name: item[i].party.id,
            flags: [item[i]]
          }
          newitems.push(obj);
        }
        return newitems;
      }
    }
    else {
      return null;
    }
  }  
}

module.exports = {"helpers": helpers};
