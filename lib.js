const nodemailer = require('nodemailer');
const errorCatcher = require('async-error-catcher');
const catchError = errorCatcher.default;

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
async function getAPI(req,collection,filters) {
  let Qqw = require('qqw');

  var client = new Qqw({rest_base: process.env.API_BASE});

  var params = []; //params recibe fields para filtrar los campos que envia y text que no se que es

  if (collection=="contracts") {
    params.sort="-compiledRelease.total_amount";
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

  console.log("getApi",collection,params);

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
	{ htmlFieldName: "filtername", apiFieldNames:["name"], fieldLabel:"Nombre", type:"string", collections: ["persons","institutions","companies"] },
  { htmlFieldName: "importe-minimo", apiFieldNames:["contract_amount"], fieldLabel:"Importe mínimo", type:"number",modifier:">", repeated: true, collections: ["persons","institutions","companies"] },
  { htmlFieldName: "importe-maximo", apiFieldNames:["contract_amount"], fieldLabel:"Importe máximo", type:"number",modifier:"<", repeated: true, collections: ["persons","institutions","companies"] },
  { htmlFieldName: "cantidad-minima", apiFieldNames:["contract_count"], fieldLabel:"Cantidad mínima", type:"number",modifier:">", repeated: true, collections: ["persons","institutions","companies"] },
  { htmlFieldName: "cantidad-maxima", apiFieldNames:["contract_count"], fieldLabel:"Cantidad máxima", type:"number",modifier:"<", repeated: true, collections: ["persons","institutions","companies"] },
	{ htmlFieldName: "proveedor", apiFieldNames:["compiledRelease.awards.suppliers.name"], fieldLabel:"Proveedor", type:"string", collections: ["contracts"] },
  { htmlFieldName: "dependencia", apiFieldNames:["compiledRelease.parties.memberOf.name"], fieldLabel:"Dependencia", type:"string", collections: ["contracts"] },
  { htmlFieldName: "from_date_contracts_index", apiFieldNames:["compiledRelease.contracts.period.startDate"], fieldLabel:"Fecha de incio", type:"date",modifier:">", collections: ["contracts"] },
  { htmlFieldName: "to_date_contracts_index", apiFieldNames:["compiledRelease.contracts.period.endDate"], fieldLabel:"Fecha de fin", type:"date",modifier:"<", collections: ["contracts"] },
  { htmlFieldName: "importe-minimo", apiFieldNames:["compiledRelease.contracts.value.amount"], fieldLabel:"Importe mínimo", type:"number",modifier:">", repeated: true, collections: ["contracts"] },
  { htmlFieldName: "importe-maximo", apiFieldNames:["compiledRelease.contracts.value.amount"], fieldLabel:"Importe máximo", type:"number",modifier:"<", repeated: true, collections: ["contracts"] },
  { htmlFieldName: "tipo-adquisicion", apiFieldNames:["compiledRelease.tender.procurementMethodMxCnet"], fieldLabel:"Tipo de procedimiento", type:"string", collections: ["contracts"] },
	{ htmlFieldName: "size", apiFieldNames:["limit"], fieldLabel:"Resultados por página", type:"integer", hidden: true, collections: ["all"] },
]


function getFilters(collection,query,defaultFilters) {
  let filters = defaultFilters || {};
  for (filterElement in filterElements) {
  	if (query[filterElements[filterElement].htmlFieldName] && (filterElements[filterElement].collections.includes(collection) || filterElements[filterElement].collections == ["all"]) ) {
  		for (apiField in filterElements[filterElement].apiFieldNames) {
  			// console.log(filterElements[filterElement].apiFieldNames[apiField],filterElements[filterElement].htmlFieldName);
  			let value = query[filterElements[filterElement].htmlFieldName];
        if (filterElements[filterElement].type == "string") {
  				value = "/"+value+"/i"
  			}
        if (filterElements[filterElement].type == "date") {
  				value = (new Date(value).toISOString());
  			}
        if (filterElements[filterElement].modifier) {
          value = filterElements[filterElement].modifier+value;
        }
        const apiFieldName = filterElements[filterElement].apiFieldNames[apiField];
        if (filterElements[filterElement].repeated) {
          if (!filters[apiFieldName]) {
            filters[apiFieldName] = [];
          }
          filters[apiFieldName].push(value);
        }
        else {
          filters[apiFieldName] = value;
        }
        console.log(apiFieldName,value);
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
    	if (value) {
        if (typeof value == "object") {
          console.log("cleanFilters array",filterElements[filterElement],value);
          for (valueItem in value) {
            console.log("cleanFilters",filterElements[filterElement].htmlFieldName,value[valueItem],filterElements[filterElement].modifier);
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
  console.log("cleanFilters",cleanFilters);
  return cleanFilters;
}


function searchPage(collectionName,defaultFilters) {
  return catchError(async function(req, res, next) {
   const filters = getFilters(collectionName, req.query,defaultFilters);
   const current_page = req.query.page || 0;
   const recommendations = []; //TODO
   const result = await getAPI(req, collectionName, filters);
   const arrayNum = [1,2,3,4,5].slice(0, (result.pages < 5 ? result.pages: 5));

   filters.offset = current_page * 25;

   res.render(collectionName, {result: result, pagesArray:arrayNum, current_url: cleanURL(req.originalUrl), current_page: current_page, filters: cleanFilters(filters), "recommendations": recommendations});
 })
}


function entityPage(collection,templateName,idFieldName) {
  return catchError(async function(req, res, next) {
    let filters = {
      limit: 1,
      sort: ""
    };
    filters[idFieldName] = req.params.id;

    result = await getAPI(req,collection,filters);
    if (!result.data[0]) {
      let err = new Error("No encontrado: "+collection);
      err.status = 404;
      throw(err);
    }
    res.render(templateName, {result: result.data[0], type: collection});
  })
}

function homePage() {
  return catchError(async function(req, res, next) {
    let feed, stats, alert;

    // Always render home even without API
    try {
      feed = await getFeed(req);
      persons = await getAPI(req,"persons",{limit:1, sort:"-date"});
      institutions = await getAPI(req,"institutions",{limit:1, sort:"-date"});
      companies = await getAPI(req,"companies",{limit:1, sort:"-date"});
      contracts = await getAPI(req,"contracts",{limit:1, sort:"-compiledRelease.date"});

      stats = {
        persons: {
          count: persons.count,
          lastModified: persons.data[0] ? persons.data[0].date : "API ERROR"
        },
        institutions: {
          count: institutions.count,
          lastModified: institutions.data[0] ?  institutions.data[0].date : "API ERROR"
        },
        companies: {
          count: companies.count,
          lastModified: companies.data[0] ?  companies.data[0].date : "API ERROR"
        },
        contracts: {
          count: contracts.count,
          lastModified: contracts.data[0] ? contracts.data[0].records[0].compiledRelease.date : "Error de API"
        }
      }
    }
    catch(e) {
      alert = "No se pudieron recuperar algunas fuentes de datos, por favor contáctenos si este error le afecta.";
      console.error("Error",e);
    }


    res.render('home', { feed: feed, home: true, stats:stats, alert: alert  });
  })
}

function staticPage(templateName) {
  return catchError(async function(req, res, next) {
   res.render(templateName , { currentSection: templateName });
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
            res.end('{"status": "error"}');
        } else {
            console.log("Message sent: " + response.message);
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
