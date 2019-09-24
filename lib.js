const nodemailer = require('nodemailer');
const errorCatcher = require('async-error-catcher');
const catchError = errorCatcher.default;
const clone = require('lodash/clone')

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
  let Qqw = require('qqw');

  var client = new Qqw({rest_base: process.env.API_BASE});

  var params = []; //params recibe fields para filtrar los campos que envia y text que no se que es

  if (collection=="contracts") {
    params.sort="-compiledRelease.total_amount";
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
      to: "info@quienesquien.wiki",
      subject: 'Mensaje desde QuienesQuien.Wiki',
      from: "QuienesQuien.Wiki <info@quienesquien.wiki>",
      html:  "From: " + req.body.name + "<br>" + "Subject: " + req.body.subjectMail + "<br>" +
             "User's email: " + req.body.email + "<br>" + "Message: " + req.body.message
  }

  if (req.body.type == "info") {
  // SEND INFORMATION FORM
    mailOptions.subject = 'Información aportada a través de QQW',
    mailOptions.html=  "From: " + req.body.email + "<br>" +
                       "Information: " + req.body.message + "<br>" + "Source: " + req.body.source
  }

  if (req.body.type == "info-uc") {
  // SEND INFORMATION UC
    mailOptions.subject = 'Solicitud de informe a través de QQW',
    mailOptions.html=  "From: " + req.body.email + "<br>" +
                       "Institution: " + req.body.institution + "<br>" + "Name: " + req.body.name
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
  { htmlFieldName: "titulo", apiFieldNames:["compiledRelease.contracts.title"], fieldLabel:"Título", type:"text", collections: ["contracts"] },
  { htmlFieldName: "proveedor", apiFieldNames:["compiledRelease.awards.suppliers.name"], fieldLabel:"Proveedor", type:"string", collections: ["contracts"] },
  { htmlFieldName: "dependencia", apiFieldNames:["compiledRelease.parties.memberOf.name"], fieldLabel:"Dependencia", type:"string", collections: ["contracts"] },
  { htmlFieldName: "from_date_contracts_index", apiFieldNames:["compiledRelease.contracts.period.startDate"], fieldLabel:"Fecha de incio", type:"date",modifier:">", collections: ["contracts"] },
  { htmlFieldName: "to_date_contracts_index", apiFieldNames:["compiledRelease.contracts.period.endDate"], fieldLabel:"Fecha de fin", type:"date",modifier:"<", collections: ["contracts"] },
  { htmlFieldName: "minimo-importe-contrato", apiFieldNames:["compiledRelease.total_amount"], fieldLabel:"Importe mínimo", type:"number",modifier:">=", repeated: true, collections: ["contracts"] },
  { htmlFieldName: "maximo-importe-contrato", apiFieldNames:["compiledRelease.total_amount"], fieldLabel:"Importe máximo", type:"number",modifier:"<=", repeated: true, collections: ["contracts"] },
  { htmlFieldName: "tipo-adquisicion", apiFieldNames:["compiledRelease.tender.procurementMethodMxCnet"], fieldLabel:"Tipo de procedimiento", type:"string", collections: ["contracts"] },
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
  			let value = query[filterElements[filterElement].htmlFieldName];

        if (filterElements[filterElement].type == "string") {
  				value = "/"+value.trim()+"/i"
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
  cleanField.value = value;

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
  for (filterElement in filterElements) {
  	for (apiField in filterElements[filterElement].apiFieldNames) {
      const value = filters[filterElements[filterElement].apiFieldNames[apiField]];
      const hasValue = filters.hasOwnProperty(filterElements[filterElement].apiFieldNames[apiField]);
    	if (value || (filterElements[filterElement].type == "bool" && hasValue)) {
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


function searchPage(collectionName, defaultFilters, templateName) {
  return catchError(async function(req, res, next) {
   if (!templateName) { templateName = collectionName }
   // console.log("searchPage",defaultFilters);
   const filters = getFilters(collectionName, req.query, defaultFilters);
   const current_page = req.query.page || 0;
   const debug = req.query.debug || false;
   const recommendations = []; //TODO
   const result = await getAPI(req, collectionName, filters, debug);
   const arrayNum = [1,2,3,4,5].slice(0, (result.pages < 5 ? result.pages: 5));

   filters.offset = current_page * 25;

   const share_url = encodeURIComponent(req.originalUrl);

   let metaTitle = []
   if (templateName == "contracts"){ metaTitle = "QQW - Contratos" }
   if (templateName == "persons"){ metaTitle = "QQW - Personas" }
   if (templateName == "institutions"){ metaTitle = "QQW - Instituciones Públicas" }
   if (templateName == "companies"){ metaTitle = "QQW - Empresas" }
   if (templateName == "institutions-uc"){ metaTitle = "QQW - Unidades Compradoras" }

   res.render(templateName, {result: result, share_url: share_url, title: metaTitle, pagesArray:arrayNum, current_url: cleanURL(req.originalUrl), current_page: current_page, filters: cleanFilters(filters), "recommendations": recommendations});
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

    let processedResult = {};

    if (collection == "contracts") {
      processedResult = fixContract(result.data[0])
    }
    else {
      processedResult = fixMemberships(result.data[0])
    }

    // console.log(processedResult);

    res.render(templateName, {result: processedResult, type: collection, flag_count: flag_count, title: metaTitle, share_url: share_url});
  })
}

function fixContract(result) {
  //title
  //description
  //startdate y end date
  //dependencia
  return result;
}

function fixMemberships(result) {
  if (result.memberships) {
    const childMemberships = {};
    // console.log("fixMemberships",allMemberships,allMemberships.length);
    if (result.memberships.child.length > 0) {
      for (m in result.memberships.child) {
        let role = getSubclassName(result.memberships.child[m].compiledRelease.parent_subclass || result.memberships.child[m].compiledRelease.parent_class);

        if (!childMemberships[role]) {
          childMemberships[role] = {
            role: role,
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

    res.render('home', { feed: feed, home: true, stats:stats, alert: alert, title: "QuiénEsQuién.Wiki", share_url: share_url});
  })
}

function staticPage(templateName) {
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

   res.render(templateName , { currentSection: templateName, title: metaTitle, share_url: share_url });
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
