const constants = require('./const');
const i18n = require('./i18n');
var moment_helper = require('helper-moment');
var _ = require('lodash')
const util = require('util');
const countries = require("i18n-iso-countries");


const helpers = {
  t: function(text, options) {
    const bindings = {};
    let prop;
    for (prop in options.hash) {
        if (Object.prototype.hasOwnProperty.call(options.hash, prop)) {
            bindings[prop] = options.hash[prop];
        }
    }
    return i18n.t(text, bindings);
  },
  api_domain: function() { return process.env.API_DOMAIN; },
  autocomplete_url: function() { return process.env.AUTOCOMPLETE_URL; },
  moment: function(date,a,b,c) {
    if (date) {
      try {
        return moment_helper(date,a,b,c);
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
  format_amount: function(value) {
    if (value) {
      return "$"+value.toLocaleString('es-MX',
        {
          style: 'decimal',
          maximumFractionDigits: 0
        });
    }
    return 'Importe desconocido';
  },
  j: function(obj) {
    return util.inspect(obj,{ depth: 5, maxArrayLength: 1000 }).replace(RegExp("&#x27;","g"),"\"").replace(RegExp("&#x27;","g"),"\"");
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
    console.log("flag_recommendations",flagsLimit,count)

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
    console.log(allFlags);
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
    console.log("sortedFlags",sortedFlags);
    // const sortedFlagKeys = Object.keys(sortedFlags);

    const recommendations = []

    for (var i = 0;  i < flagsLimit; i++) {
      const flag = sortedFlags[i];
      if (flag && constants.flag_details[flag.flag_id]) {
        if (constants.flag_details[flag.flag_id].hidden_uc) {
          console.log("hidden",flag.flag_id);
          flagsLimit++;
          continue;
        }
        if (allFlags[flag.flag_id] === 0) {
          console.log("Saltando cero",flag.flag_id);
          flagsLimit++;
          continue;
        }
        const recommendation = _.clone(constants.flag_details[flag.flag_id]);
        recommendation.score = allFlags[flag.flag_id];
        recommendation.minimum = get_min(flag.flag_id);
        recommendations.push(recommendation);
      }
      else {
        console.error("flag_recommendations","Asked for too many flags",i,flag.flag_id,constants.flag_details[flag.flag_id]);
      }
    }
    return recommendations;
  },
  filter_array: function(haystack,property,needle) {
    const search = {};
    search[property] = needle;
    const item = _.find(haystack,search);
    // console.log("filter_array",search,item);
    return item;
  },
  get_object_element: function(object,element) {
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
  format_currency: function(value) {
    if (value == "MX") {
      return "Pesos mexicanos"
    }
    else if (value == "USD") {
      return "Dólares estadounidenses"
    }
    else if (value == "EUR") {
      return "Euros"
    }
    return value;
  },
  limit: function (arr, limit) {
    if (!Array.isArray(arr)) {
      return []; }
    return arr.slice(0, limit);
  },
  'var': function(name, value){
    this[name] = value;
  },
  math: function(lvalue, operator, rvalue) {lvalue = parseFloat(lvalue);
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
  isArray: function(obj) {
    return typeof obj == "object";
  },
  indexOf: function(needle,haystack) {
    return haystack.indexOf(needle);
  },
  format_number: function(value) {
    if (value || value === 0) {
       const formatted = value.toLocaleString('es-MX', {style: "decimal", maximumFractionDigits: 2});
       // console.log("format_number", formatted);
       return formatted;
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
    const r = new RegExp("("+needle.replace("(","\\(")+")","i");
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
  get_subclass_name: function(subclass) {
    if (constants.subclass_names[subclass]) {
      return constants.subclass_names[subclass];
    }
    else {
      console.log("get_type_singular unknown",subclass);
      return "Entidad";
    }
  },  
  get_classification_name: function(type,classification,subclassification,govLevel) {
    if (constants.classification_names[type] && constants.classification_names[type][classification] && constants.classification_names[type][classification][subclassification] && constants.classification_names[type][classification][subclassification][govLevel]) {
      // console.log("get_classification_name found",type,role_names[type][directionality].label);
      return constants.classification_names[type][classification][subclassification][govLevel];
    }
    else {
      console.log("get_classification_name unknown:",type,classification,subclassification,govLevel);
      return "Entidad"+" "+type+" "+classification+" "+subclassification+" "+govLevel;
    }
  },
  get_classification_icon: function(type,classification,subclassification,govLevel) {
    if (constants.classification_icons[type] && constants.classification_icons[type][classification] && constants.classification_icons[type][classification][subclassification] && constants.classification_icons[type][classification][subclassification][govLevel]) {
      // console.log("get_classification_name found",type,role_names[type][directionality].label);
      icon = constants.classification_icons[type][classification][subclassification][govLevel];
    }
    else {
      console.log("get_classification_icon unknown:",type,classification,subclassification,govLevel);
      icon = "fa-building";
    }
    return "<i class='fas "+icon+"'></i> ";
  },

  get_role_name: function(type,directionality) {
    // console.log("get_role_name 1",type,directionality)
    if (constants.role_names[type] && constants.role_names[type][directionality]) {
      // console.log("get_role_name found",type,role_names[type][directionality].label);
      return constants.role_names[type][directionality].label;
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
  get_type_plural: function(type, short=false) {
    if (constants.type_names[type]) {
      if (short) {
        return constants.type_names[type].plural_short;
      }
      else {
        return constants.type_names[type].plural;
      }
    }
    else {
      console.log("get_type_plural unknown",type);
      return "Entidades";
    }
  },
  get_type_singular: function(type) {
    if (constants.type_names[type]) {
      return constants.type_names[type].singular;
    }
    else {
      console.log("get_type_singular unknown",type);
      return "Entidad";
    }
  },
  get_type_url: function(type) {
    switch(type) {
      case "institutions": return "instituciones-publicas";
      case "institution": return "instituciones-publicas";
      case "municipality": return "instituciones-publicas";
      case "state": return "instituciones-publicas";
      case "company": return "empresas";
      case "companies": return "empresas";
      case "contract": return "contratos";
      case "contracts": return "contratos";
      case "persons": return "personas";
      case "person": return "personas";
      case "funder": return "instituciones-publicas";
      case "countries": return "paises";
      default: console.log("get_type_url",type); return "unknown";
    }
  },
  get_party: function(records,party_id) {
    let party;
    if (records && records.compiledRelease) {
      party = _.find(records.compiledRelease.parties,{id: party_id});
      // console.log("get_party_type not", party);
      if (!party) {
        party = _.find(records.compiledRelease.parties,(party) => {
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
        console.log("get_party_type not found",party_id);
        return "unknown";
      }
    }
    else {
      console.log("get_party_type no record");
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
      console.log("get_record_funder no record");
      return null;

    }
  },
  url_csv: function(url) {
    if (url) {
      return url.replace("v2/","v2/csv/");
    }
  },
  url_page: function(url) {
    if (url) {
      return url
    }
  },
  translate_area: function(value) {
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
      console.log("translate_area unknown:",value);
      return value;
    }
  },
  get_govlevel_name: function(govlevel) {
    return constants.govlevel_names[govlevel] || govlevel+" (desconocido)";
  },
  get_bool: function(bool) {
    if (bool) { return "Si" }
    else { return "No" }
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
  }
}

module.exports = {"helpers": helpers};
