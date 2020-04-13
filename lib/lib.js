const nodemailer = require('nodemailer');
const errorCatcher = require('async-error-catcher');
const catchError = errorCatcher.default;
const clone = require('lodash/clone')
const Qqw = require('qqw');
const constants = require('./const');


function cleanURL(url) {
  if (url.indexOf("?") == -1) {
    url+="?";
  }
  return url.replace(/&page=[0-9]+/,"");
}

// Feed Home
async function getFeed(req) {
  let Parser = require('rss-parser');
  let parser = new Parser();

  // console.log(process.env);

  let feed = await parser.parseURL(process.env.FEED_URL);
  return feed.items.slice(0,3);
}

// API
async function getAPI(req,collection,filters,debug) {
  var client = new Qqw({rest_base: process.env.API_BASE});

  var params = []; //params recibe fields para filtrar los campos que envia y text que no se que es

  if (collection=="contracts") {
    //Contract search with title do not sort -- because of mongo memory restrictions
    //ContactPoint Filter does not sort either
    console.log("getAPI filters",filters);
    if (filters['compiledRelease.contracts.title'] || filters['compiledRelease.parties.contactPoint.name']) {
      delete params.sort;
    }
    else {
      params.sort="-compiledRelease.total_amount";
    }
    // console.log("getAPI contract filters", filters,Object.keys(filters),Object.keys(filters).length);

    //Only hide hidden contracts when there's no other filter
    if (Object.keys(filters).length<1) {
      filters.hidden="false";
    }
  }
  if (collection=="persons" || collection=="organizations" || collection=="companies") {
    params.sort="-contract_amount.supplier";
  }
  if (collection=="institutions") {
    params.sort="-contract_amount.buyer";
  }

  for (f in filters) {
    params[f] = filters[f];
  }

  if (debug) {
    params.debug="true";
    console.log("getApi",collection,params);
  }


  try {
    result = await client.get_promise(collection, params);
  }
  catch(e) {
    throw(new Error(e));
  }

  if (result.error) {
    err = new Error(result.error);
    err.status=500;
    throw(err);
  }
  // console.log("result",result);
  return result.data;
}

// Contact and Send Information Form
function sendMail(req, callback) {
  // CONTACT PAGE FORM
  var mailOptions = {
      to: process.env.EMAIL_MESSAGE_ADDRESS,
      subject: 'Contacto: ' + req.body.subjectMail,
      from: "QuienesQuien.Wiki <info@quienesquien.wiki>",
      html:  "```\nFrom: " + req.body.name + "\n\n<br>" + "Subject: " + req.body.subjectMail + "\n\n<br>" +
             "User's email: " + req.body.email + "\n\n<br>" + "Message: " + req.body.message+"\n```"
  }

  if (req.body.type == "info") {
  // SEND INFORMATION FORM
    mailOptions.subject = 'Información sobre: '+ req.body.url,
    mailOptions.html=  "```\nFrom: " + req.body.email + "\n\n<br>" +
                       "Information: " + req.body.message + "\n\n<br>" + "Source: " + req.body.source + "\n\n<br>"+"\n```\n" + "Url: " + req.body.url
  }

  if (req.body.type == "info-uc") {
  // SEND INFORMATION UC
    mailOptions.subject = 'Solicitud de informe a través de QQW',
    mailOptions.html=  "```\nFrom: " + req.body.email + "\n\n<br>" +
                       "Information: " + req.body.message + "\n\n<br>" +
                       "Name: " + req.body.name + "\n\n<br>"+"\n```\n" + "Url: " + req.body.url
  }

  if (req.body.type == "mujeres-contact") {
  // SEND INFORMATION UC
    mailOptions.subject = 'Contacto Mujeres en la bolsa';
  }

  let smtpTransport = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER || "",
        port: process.env.EMAIL_PORT || "587",
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER || "", // generated ethereal user
            pass: process.env.EMAIL_PASS || "" // generated ethereal password
        }
  });

  //Enviar correo al usuario
  smtpTransport.sendMail({
      to: req.body.email,
      subject: 'Muchas gracias por su mensaje',
      from: "QuienesQuien.Wiki <info@quienesquien.wiki>",
      html:  "Hola " + req.body.name + "\n\n<br>" + "Hemos recibido su correo y nuestro equipo lo revisará. Sólo contestaremos si necesitamos información adicional.\n\n<br>" +
             "\n\n<br>Muchas gracias, equipo de QuienEsQuien.wiki"
  },callback)

  //Enviar correo a nosotros
  return smtpTransport.sendMail(mailOptions,callback)
}

// Filters
const filterElements = [
	{ htmlFieldName: "filtername", apiFieldNames:["compiledRelease.name"], fieldLabel:"Nombre", type:"string", collections: ["persons","institutions","companies"] },
  { htmlFieldName: "minimo-importe-proveedor", apiFieldNames:["compiledRelease.contract_amount.supplier"], fieldLabel:"Importe mínimo proveedor", type:"number",modifier:">", repeated: true, collections: ["persons","institutions","companies"] },
  { htmlFieldName: "maximo-importe-proveedor", apiFieldNames:["compiledRelease.contract_amount.supplier"], fieldLabel:"Importe máximo proveedor", type:"number",modifier:"<", repeated: true, collections: ["persons","institutions","companies"] },
  { htmlFieldName: "minimo-cantidad-proveedor", apiFieldNames:["compiledRelease.contract_count.supplier"], fieldLabel:"Cantidad mínima proveedor", type:"number",modifier:">", repeated: true, collections: ["persons","institutions","companies"] },
  { htmlFieldName: "maximo-cantidad-proveedor", apiFieldNames:["compiledRelease.contract_count.supplier"], fieldLabel:"Cantidad máxima proveedor", type:"number",modifier:"<", repeated: true, collections: ["persons","institutions","companies"] },
  { htmlFieldName: "minimo-importe-comprador", apiFieldNames:["compiledRelease.contract_amount.buyer"], fieldLabel:"Importe mínimo comprador", type:"number",modifier:">", repeated: true, collections: ["institutions"] },
  { htmlFieldName: "maximo-importe-comprador", apiFieldNames:["compiledRelease.contract_amount.buyer"], fieldLabel:"Importe máximo comprador", type:"number",modifier:"<", repeated: true, collections: ["institutions"] },
  { htmlFieldName: "minimo-cantidad-comprador", apiFieldNames:["compiledRelease.contract_count.buyer"], fieldLabel:"Cantidad mínima comprador", type:"number",modifier:">", repeated: true, collections: ["institutions"] },
  { htmlFieldName: "maximo-cantidad-comprador", apiFieldNames:["compiledRelease.contract_count.buyer"], fieldLabel:"Cantidad máxima comprador", type:"number",modifier:"<", repeated: true, collections: ["institutions"] },
  { htmlFieldName: "tipo-institucion", apiFieldNames:["compiledRelease.classification"], fieldLabel:"Tipo de institución", type:"string", collections: ["institutions"] },
  { htmlFieldName: "titulo", apiFieldNames:["compiledRelease.contracts.title"], fieldLabel:"Título", type:"text", collections: ["contracts"] },
  { htmlFieldName: "proveedor", apiFieldNames:["compiledRelease.awards.suppliers.name"], fieldLabel:"Proveedor", type:"string", collections: ["contracts"] },
  { htmlFieldName: "dependencia", apiFieldNames:["compiledRelease.parties.memberOf.name"], fieldLabel:"Dependencia", type:"string", collections: ["contracts"] },
  { htmlFieldName: "financiador", apiFieldNames:["funder"], fieldLabel:"Financiador", type:"string", collections: ["contracts"] },
  { htmlFieldName: "pais", apiFieldNames:["compiledRelease.area.id"], fieldLabel:"País", type:"string", collections: ["persons","companies"] },
  { htmlFieldName: "uc_id", apiFieldNames:["compiledRelease.buyer.id"], fieldLabel:"Unidad compradora", type:"id", collections: ["contracts"] },
  { htmlFieldName: "responsable", apiFieldNames:["compiledRelease.parties.contactPoint.name"], fieldLabel:"Responsable", type:"string", collections: ["contracts"] },
  { htmlFieldName: "from_date_contracts_index", apiFieldNames:["compiledRelease.contracts.period.startDate"], fieldLabel:"Fecha de incio", type:"date",modifier:">", collections: ["contracts"] },
  { htmlFieldName: "to_date_contracts_index", apiFieldNames:["compiledRelease.contracts.period.endDate"], fieldLabel:"Fecha de fin", type:"date",modifier:"<", collections: ["contracts"] },
  { htmlFieldName: "minimo-importe-contrato", apiFieldNames:["compiledRelease.total_amount"], fieldLabel:"Importe mínimo", type:"number",modifier:">=", repeated: true, collections: ["contracts"] },
  { htmlFieldName: "maximo-importe-contrato", apiFieldNames:["compiledRelease.total_amount"], fieldLabel:"Importe máximo", type:"number",modifier:"<=", repeated: true, collections: ["contracts"] },
  { htmlFieldName: "tipo-adquisicion", apiFieldNames:["compiledRelease.tender.procurementMethod"], fieldLabel:"Tipo de procedimiento", type:"string", collections: ["contracts"] },
  { htmlFieldName: "size", apiFieldNames:["limit"], fieldLabel:"Resultados por página", type:"integer", hidden: true, collections: ["all"] },
  { htmlFieldName: "page", apiFieldNames:["offset"], fieldLabel:"Página", type:"integer", hidden: true, collections: ["all"] },
]


function getFilters(collection, query, defaultFilters) {
  // console.log("getFilters 1", collection, query, defaultFilters);
  let filters = clone(defaultFilters) || {};

  for (filterElement in filterElements) {
    // console.log("getFilters 2",filterElements[filterElement].htmlFieldName,query[filterElements[filterElement].htmlFieldName],filterElements[filterElement].collections);
  	if ((query[filterElements[filterElement].htmlFieldName] || filterElements[filterElement].type === "bool") && (filterElements[filterElement].collections.includes(collection) || filterElements[filterElement].collections.includes("all")) ) {
  		for (apiField in filterElements[filterElement].apiFieldNames) {
  			// console.log(filterElements[filterElement].apiFieldNames[apiField],filterElements[filterElement].htmlFieldName);
        const apiFieldName = filterElements[filterElement].apiFieldNames[apiField];
  			let value = encodeURIComponent(query[filterElements[filterElement].htmlFieldName].trim());

        if (filterElements[filterElement].type == "string") {
  				value = "/"+value+"/i"
  			}
        if (filterElements[filterElement].type == "date") {
  				value = (new Date(value).toISOString()).replace("Z","");
  			}
        if (filterElements[filterElement].type == "bool") {
          if (value == "true") {
            value = "";
          }
          else {
            continue;
          }
  			}
        if (apiFieldName == "offset") {
          value = value*25;
        }
        if (filterElements[filterElement].modifier) {
          value = filterElements[filterElement].modifier+value;
        }
        if (filterElements[filterElement].repeated) {
          if (!filters[apiFieldName]) {
            filters[apiFieldName] = [];
          }
          filters[apiFieldName].push(value);
        }
        else {
          filters[apiFieldName] = value;
        }
        // console.log(apiFieldName,value);
  		}
  	}
  }
  console.log("getFilters",filters);
  return filters;
}

function cleanField(value) {
  let cleanField = filterElements[filterElement];
  cleanField.apiField = filterElements[filterElement].apiFieldNames[apiField];
  cleanField.value = decodeURIComponent(decodeURIComponent(value));

  if (cleanField.modifier) {
    cleanField.value = cleanField.value.substr(cleanField.modifier.length);
  }

  if (cleanField.type == "string") {
    cleanField.value = cleanField.value.slice(1,-2);
  }
  if (cleanField.type == "bool") {
    cleanField.value = value ? false : true;
  }
  if (cleanField.type == "date") {
    moment = require('moment');
    cleanField.value = moment(cleanField.value).format("YYYY-MM-DD");
  }
  return cleanField;
}


function cleanFilters(filters) {
  const cleanFilters = {};
  cleanFilters.filters_active = {
     hidden: true,
     value: false
   };
  for (filterElement in filterElements) {
  	for (apiField in filterElements[filterElement].apiFieldNames) {
      const value = filters[filterElements[filterElement].apiFieldNames[apiField]];
      const hasValue = filters.hasOwnProperty(filterElements[filterElement].apiFieldNames[apiField]);
    	if (value || (filterElements[filterElement].type == "bool" && hasValue)) {
        cleanFilters.filters_active = {
           hidden: true,
           value: true
         };

        if (typeof value == "object") {
          // console.log("cleanFilters array",filterElements[filterElement],value);
          for (valueItem in value) {
            // console.log("cleanFilters",filterElements[filterElement].htmlFieldName,value[valueItem],filterElements[filterElement].modifier);
            if (filterElements[filterElement].modifier) {
              if (value[valueItem].indexOf(filterElements[filterElement].modifier) == 0) {
                cleanFilters[filterElements[filterElement].htmlFieldName] = cleanField(value[valueItem]);
              }
            }
            else {
              cleanFilters[filterElements[filterElement].htmlFieldName] = cleanField(value[valueItem]);
            }
          }
        }
        else {
    	    cleanFilters[filterElements[filterElement].htmlFieldName] = cleanField(value);
        }
    	}
  	}
  }
  // console.log("cleanFilters",cleanFilters);
  return cleanFilters;
}


function searchPage(collection, defaultFilters, templateName) {
  return catchError(async function(req, res, next) {
   if (!templateName) { templateName = collection }
   // console.log("searchPage",defaultFilters);
   const filters = getFilters(collection, req.query, defaultFilters);
   const current_page = req.query.page || 0;
   const debug = req.query.debug || false;
   const recommendations = []; //TODO
   const result = await getAPI(req, collection, filters, debug);
   const arrayNum = [1,2,3,4,5].slice(0, (result.pages < 5 ? result.pages: 5));

   filters.offset = current_page * 25;

   const share_url = encodeURIComponent(req.originalUrl);

   let metaTitle = []
   if (templateName == "contracts"){ metaTitle = "QQW - Contratos" }
   if (templateName == "persons"){ metaTitle = "QQW - Personas" }
   if (templateName == "institutions"){ metaTitle = "QQW - Instituciones Públicas" }
   if (templateName == "companies"){ metaTitle = "QQW - Empresas" }
   if (templateName == "institutions-uc"){ metaTitle = "QQW - Unidades Compradoras" }
   if (templateName == "countries"){ metaTitle = "QQW - Países" }

   let processedResult = {};

   if (collection == "contracts") {
     processedResult = fixContractResultList(result)
   }
   else {
     processedResult = result;
   }

   if (debug) {
     console.log("searchPage processedResult",processedResult);
   }

   res.render(templateName, {result: processedResult, share_url: share_url, title: metaTitle, pagesArray:arrayNum, current_url: cleanURL(req.originalUrl), current_page: current_page, filters: cleanFilters(filters), "recommendations": recommendations});
 })
}

function entityPage(collection,templateName,idFieldName) {
  return catchError(async function(req, res, next) {
    // console.log("entityPage",collection,templateName,idFieldName,req,res,next);
    let filters = {
      limit: 1,
      sort: null,
      embed: true
    };
    const flag_count = req.query.flag_count || 3;
    const debug = req.query.debug || false;
    filters[idFieldName] = req.params.id;

    if (collection == "institutions") {
      filters["compiledRelease.classification"] = "institution,state,municipality";
    }
    if (collection == "countries" && templateName != "country-mujeres") {
      filters["embed"] = false;
    }

    const result = await getAPI(req,collection,filters,debug);
    if (!result || !result.data || !result.data[0]) {
      let err = new Error("No encontrado: "+collection);
      err.status = 404;
      throw(err);
    }

    const share_url = req.originalUrl;

    let metaTitle = "";
    if (collection == "contracts"){ metaTitle = result.data[0].records[0].compiledRelease.contracts[0].title + " < Contrato < QuiénEsQuién.Wiki"}
    if (collection == "persons"){ metaTitle = result.data[0].compiledRelease.name + " < Persona < QuiénEsQuién.Wiki" }
    if (collection == "institutions"){ metaTitle = result.data[0].compiledRelease.name + " < Institución Pública < QuiénEsQuién.Wiki" }
    if (collection == "companies"){ metaTitle = result.data[0].compiledRelease.name + " < Empresa < QuiénEsQuién.Wiki" }
    if (collection == "countries"){ metaTitle = (result.data[0].compiledRelease ? result.data[0].compiledRelease.name  + " < País < QuiénEsQuién.Wiki" : result.data[0].name  + " < Mujeres en la bolsa < País < QuiénEsQuién.Wiki") }

    let processedResult = {};

    if (collection == "contracts") {
      processedResult = fixContractResultList(result).data[0]
    }
    else {
      processedResult = fixMemberships(result.data[0])
    }

    // console.log(processedResult);

    res.render(templateName, {result: processedResult, type: collection, flag_count: flag_count, title: metaTitle, share_url: share_url});
  })
}

function fixContractResultList(result) {
  // console.log(result);
  if (result && result.data && result.data[0] && result.data[0].records && result.data[0].records.length > 0) {
    for (let c in result.data[0].records) {
      result.data[0].records[c] = fixRecord(result.data[0].records[c]);
    }
  }
  return result;
}


function fixRecord(record) {
  // Para elegir el título del proceso de contratación haría la siguiente toma de decisión:
  //   Si hay un título repetido usar el repetido (este sería el caso del proceso de contratación que nos ocupa) https://www.quienesquien.wiki/contratos/ocds-0ud2q6-18164038-004-08
  //   Si no hay título repetido usar el contrato con más importe.
  //   Si todos tienen el mismo valor y son distitos, usar el primer contrato.
  function getFirst(contracts,field) {
    for (c in contracts) {
      if (field && contracts[c][field]) {
        return contracts[c][field];
      }
    }
    return "";
  }

  function getMostRepeated(contracts,field) {
    let field_values = {};
    let most_repeated_count = 0;
    let most_repeated_value = "";
    for (c in contracts) {
      if (field && contracts[c][field]) {
        if (!field_values[contracts[c][field]]) {
          field_values[contracts[c][field]] = 0;
        }
        field_values[contracts[c][field]]++;
        if (field_values[contracts[c][field]] > most_repeated_count) {
          most_repeated_count = field_values[contracts[c][field]];
          if (most_repeated_count > 1) {
            most_repeated_value = contracts[c][field];
          }
        }
      }
    }
    return most_repeated_value;
  }

  function getMostExpensive(contracts,field) {
    let field_value = "";
    let max_value = 0;
    for (c in contracts) {
      if (contracts[c].value.amount > max_value) {
        if (field && contracts[c][field]) {
          field_value = contracts[c][field];
        }
      }
    }
    return field_value;
  }

  function getFieldWithCriteria(contracts,field) {
    return getMostRepeated(contracts,field) || getMostExpensive(contracts,field) || getFirst(contracts,field) || "";
  }

  function getDateWithCriteria(contracts,field,comparison) {
    date = "";
    for (c in contracts) {
      if (contracts[c].period && contracts[c].period[field]) {
        contract_date = new Date(contracts[c].period[field]);
        if (!date && contract_date.valueOf()) {
          date = contract_date
        }
        // console.log(c,contract_date);
        // console.log("getDateWithCriteria",comparison,contract_date,date)
        if (comparison == "<") {
          if (contract_date < date) {
            date = contract_date;
          }
        }
        else {
          if (contract_date > date) {
            date = contract_date;
          }
        }
      }
    }
    return date;
  }

  //title - repeated contract title
  //description - repeated contract description
  record.title = getFieldWithCriteria(record.compiledRelease.contracts,"title");
  record.description = getFieldWithCriteria(record.compiledRelease.contracts,"description");

  //startdate y end date - first and last
  record.startDate = getDateWithCriteria(record.compiledRelease.contracts,"startDate","<");
  record.endDate = getDateWithCriteria(record.compiledRelease.contracts,"endDate",">") || getDateWithCriteria(record.compiledRelease.contracts,"startDate",">");

  //dependencia - que hacer con multiples compradoras?

  //supplier_summary
  record.supplier_summary = {};

  let supplier_template = {
    id: "",
    "name": "",
    "type": "",
    contract_count: 0,
    contract_amount: 0
  }

  for (let c in record.compiledRelease.awards) {
    let awardSuppliers = record.compiledRelease.awards[c].suppliers;
    for (let s in awardSuppliers) {
      // console.log("iter",c,s,awardSuppliers[s].id);
      let supplier_object = clone(supplier_template);

      if (record.supplier_summary[awardSuppliers[s].id]) {
        supplier_object = record.supplier_summary[awardSuppliers[s].id];
      }
      else {
        supplier_object.id = awardSuppliers[s].id;
        supplier_object.name = awardSuppliers[s].name;
      }
      supplier_object.contract_count++;
      supplier_object.contract_amount += record.compiledRelease.awards[c].value.amount;

      record.supplier_summary[supplier_object.id] = supplier_object;
    }
  }
  record.supplier_count = Object.keys(record.supplier_summary).length;
  return record;
}

function fixMemberships(result) {
  if (result.memberships) {
    const childMemberships = {};
    // console.log("fixMemberships",allMemberships,allMemberships.length);
    if (result.memberships.child.length > 0) {
      for (m in result.memberships.child) {
        let role = result.memberships.child[m].compiledRelease.role;

        if (!childMemberships[role]) {
          childMemberships[role] = {
            role: role,
            directionality: "child",
            memberships: []
          }
        }
        childMemberships[role].memberships.push(result.memberships.child[m]);
      }
      result.memberships.child = childMemberships;
    }
    const parentMemberships = {};

    if (result.memberships.parent.length > 0) {
      for (m in result.memberships.parent) {
        let role = result.memberships.parent[m].compiledRelease.role;

        if (!parentMemberships[role]) {
          parentMemberships[role] = {
            role: role,
            directionality: "parent",
            memberships: []
          }
        }
        parentMemberships[role].memberships.push(result.memberships.parent[m]);
      }
      result.memberships.parent = parentMemberships;
    }

    console.log("fixMemberships RR",result.memberships);
  }
  return result;
}

function getSubclassName(subclass) {
  switch (subclass) {
    case "dependencia": return "Dependencia"; break;
    case "unidad-compradora": return "Unidad compradora"; break;
    case "state": return "Estado"; break;
    case "municipality": return "Municipio"; break;
    default: console.error("getSubclassName: Unknown subclass:",subclass); return subclass;
  }

}

function homePage() {
  return catchError(async function(req, res, next) {
    let feed, stats, alert;

    const debug = req.query.debug || false;

    // Always render home even without API
    try {
      feed = await getFeed(req);
      sources = await getAPI(req,"sources");
      stats = sources.data[0].collections;
    }
    catch(e) {
      alert = "No se pudieron recuperar algunas fuentes de datos, por favor contáctenos si este error le afecta.";
      console.error("Error",e);
    }

    const share_url = req.originalUrl;

    const feed_basado = constants.feed_basado;

    res.render('home', { feed_rindecuentas: feed, feed_basado: feed_basado, home: true, stats:stats, alert: alert, title: "QuiénEsQuién.Wiki", share_url: share_url});
  })
}

function staticPage(templateName, layout="layout") {
  return catchError(async function(req, res, next) {

       let metaTitle = []
       if (templateName == "about"){ metaTitle = "QQW - Sobre QQW" }
       if (templateName == "sources"){ metaTitle = "QQW - Entidades y fuentes" }
       if (templateName == "apis"){ metaTitle = "QQW - Herramientas" }
       if (templateName == "investigations"){ metaTitle = "QQW - Investigaciones" }
       if (templateName == "manual"){ metaTitle = "QQW - Manual" }
       if (templateName == "partners"){ metaTitle = "QQW - Aliados" }
       if (templateName == "privacy"){ metaTitle = "QQW - Privacidad" }
       if (templateName == "contact"){ metaTitle = "QQW - Contacto" }

   const share_url = req.originalUrl;

   res.render(templateName , { currentSection: templateName, title: metaTitle, share_url: share_url, layout: layout });
 })
}

function sendMailPage() {
  return function (req, res) {

    //TODO: Protegernos del SPAM

    let fieldsWidthError = []
    if (!req.body.email || req.body.email.indexOf("@") == -1) {
        fieldsWidthError.push("email");
    }
    if (!req.body.message) {
        fieldsWidthError.push("message");
    }
    if (fieldsWidthError.length>0) {
      let result = {
        "status": "error",
        "message": "Some fields have errors",
        "fieldsWidhError": fieldsWidthError
      }
      res.end(JSON.stringify(result));
      return false;
    }


    sendMail(req, function (err, response) {
        if (err) {
            console.log(err);
            res.end('{"status": "error"}',response);
        } else {
            console.log("Message sent: ",response);
            res.end('{"status": "sent"}');
        }
    });

  }
}

module.exports = {
  searchPage:searchPage,
  homePage:homePage,
  entityPage:entityPage,
  staticPage:staticPage,
  sendMailPage:sendMailPage,
}
