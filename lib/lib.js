const nodemailer = require('nodemailer');
const errorCatcher = require('async-error-catcher');
const catchError = errorCatcher.default;
const clone = require('lodash/clone')
const Qqw = require('qqw');
const constants = require('./const');
const Parser = require('rss-parser');


function cleanURL(url) {
  if (url.indexOf("?") == -1) {
    url+="?";
  }
  return url.replace(/&page=[0-9]+/,"");
}

// Feed Home
async function getFeed(req) {
  let parser = new Parser({
    timeout: 3000, //in ms, down from default 60 seconds
    customFields: {
      item: [
        ['enclosure', 'enclosures', {keepArray: true}],
      ]
    }
  });

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

  //We use the autocomplete endpoint to search in all collections
  if (collection=="all") {
    collection = "autocomplete"
  }

  for (f in filters) {
    //Delete collection filter from api requests, pass the rest
    if (f != "_collection") {
      params[f] = filters[f];
    }
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

function getFilters(query, defaultFilters) {
  // console.log("getFilters 1", collection, query, defaultFilters);
  let filters = clone(defaultFilters) || {};

  for (filterElement in constants.filter_elements) {
    // console.log("getFilters 2",constants.filter_elements[filterElement].htmlFieldName,query[constants.filter_elements[filterElement].htmlFieldName],constants.filter_elements[filterElement].collections);
    let filter = clone(constants.filter_elements[filterElement]);

    // Apply default values before display
    // if (!value && filter.default.value) {
    //   value = filter.default.value;
    // }

    let queryValue = query[filter.htmlFieldName] || query[filter.htmlFieldName+"-min"] || query[filter.htmlFieldName+"-max"];

  	if (queryValue) {
  		for (apiField in filter.apiFieldNames) {
  			// console.log(filter.apiFieldNames[apiField],filter.htmlFieldName);
        const apiFieldName = filter.apiFieldNames[apiField];
        let value = encodeURIComponent(queryValue.trim());

        if (filter.type == "string") {
  				value = "/"+value+"/i"
  			}
        if (filter.type == "minmax") {
          value = [
            ">" + encodeURIComponent(query[filter.htmlFieldName+"-min"].trim()),
            "<" + encodeURIComponent(query[filter.htmlFieldName+"-max"].trim())
          ]
  			}
        if (filter.type == "date") {
          //TODO: Dates are multiple
  				value = (new Date(value).toISOString()).replace("Z","");
  			}
        // if (filter.type == "bool") {
        //   if (value == "true") {
        //     value = "";
        //   }
        //   else {
        //     continue;
        //   }
  			// }
        if (apiFieldName == "offset") {
          value = value*25; //TODO: Page size
        }
        if (apiFieldName == "_sortDirection") {
          filters["sort"] = value + filters["sort"];
          value = "";
        }

        if (value) {
          filters[apiFieldName] = value;
        }
        // console.log("getFilters 1",apiFieldName,value);
  		}
  	}
  }
  console.log("getFilters",filters);
  return filters;
}

function cleanField(value,previousValue) {
  let filter = clone(constants.filter_elements[filterElement]);

  let cleanField = filter;
  cleanField.apiField = filter.apiFieldNames[apiField];
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
    //TODO: Dates are multiple
    moment = require('moment');
    cleanField.value = moment(cleanField.value).format("YYYY-MM-DD");
  }
  if (cleanField.type == "minmax") {
    console.log("minmax",previousValue)
    if (previousValue) {
      cleanField.value = {
        min: previousValue.value.substr(1),
        max: cleanField.value.substr(1)
      }
    }
  }


  if (cleanField.htmlFieldName == "sort") {
    //TODO: Sort direction
    if (cleanField.value.indexOf("-") == 0) {
      cleanField.value = cleanField.value.slice(1);
    }
  }

  return cleanField;
}


function cleanFilters(filters) {
  const cleanFilters = {};

  for (filterElement in constants.filter_elements) {
    let filter = clone(constants.filter_elements[filterElement]);

  	for (apiField in filter.apiFieldNames) {
      const value = filters[filter.apiFieldNames[apiField]];
      const hasValue = filters.hasOwnProperty(filter.apiFieldNames[apiField]);
    	if (value || (filter.type == "bool" && hasValue)) {
        if (typeof value == "object") {
          // console.log("cleanFilters array",,\n\t,value);
          for (valueItem in value) {
            // console.log("cleanFilters",,\n\t.htmlFieldName,value[valueItem],,\n\t.modifier);
            if (filter.modifier) {
              if (value[valueItem].indexOf(filter.modifier) == 0) {
                cleanFilters[filter.htmlFieldName] = cleanField(value[valueItem],cleanFilters[filter.htmlFieldName]);
              }
            }
            else {
              cleanFilters[filter.htmlFieldName] = cleanField(value[valueItem],cleanFilters[filter.htmlFieldName]);
            }
          }
        }
        else {
    	    cleanFilters[filter.htmlFieldName] = cleanField(value,cleanFilters[filter.htmlFieldName]);
        }
    	}
  	}
  }
  console.log("cleanFilters",cleanFilters);
  return cleanFilters;
}

function searchPage2020(defaultFilters) {
  return catchError(async function(req, res, next) {
    const filters = getFilters(req.query, defaultFilters);
    const current_page = parseInt(req.query.page) || 0;
    const debug = req.query.debug || false;
    const collection = filters._collection || "all";

    const result = await getAPI(req, collection, filters, debug);

    //TODO generar todas las págias del paginador
    const pagesArray = calculatePages(result.pages,current_page);

	// TODO: Page size
    filters.offset = current_page * 25;

    const share_url = encodeURIComponent(req.originalUrl);

    let processedResult = {};

    processedResult = fixContractResultList(result)

    if (debug) {
      console.log("searchPage processedResult",processedResult);
    }

    console.log("searchPage2020",filters._collection)

    res.render("searcher", {
      collection: collection,
      result: processedResult,
      share_url: share_url,
      title: "buscador", //TODO: Generar título en función de los filtros
      pagesArray:pagesArray,
      current_url: cleanURL(req.originalUrl),
      current_page: current_page,
      filter_values: cleanFilters(filters),
      filter_elements: constants.filter_elements
    });
  })
}

function calculatePages(pages_count,current_page) {
	pagesArray = [];
	
	// Link previous page if we're not in first page 
	pagesArray.push({ type: "prev", value: current_page-1, enabled: (current_page != 0), title: "< Anterior" })

	//If we're more than 4 pages away, add link to first page
	if (current_page > 3) {
		pagesArray.push({ type: "first", value: 0, enabled: true, title: "<< Primera" })								
	}

	for (page=0; page <= pages_count; page++) {		
		//If we're more than 10 pages away, add link previous 10 pages
		if (page == current_page-10) {
			pagesArray.push({ type: "prev10", value: page, enabled: true,  title: page })					
		}

		//If we're more than 5 pages away, add link previous 5 pages
		if (page == current_page-5) {
			pagesArray.push({ type: "prev5", value: page, enabled: true, title: page })					
		}

		//If we're more than 3 pages away, add link to all pages
		if (page > (current_page-3) && page < (current_page+3) ) {
			//Current is disabled
			if (page == current_page) {
				pagesArray.push({ type: "current", value: current_page, enabled: false, title: current_page })		
			}
			else {
				pagesArray.push({ type: "page", value: page, enabled: true, title: page })		
			}
		}	
		//If we have more than 5 pages to go, add link next 5 pages
		if (page == current_page+5) {
			pagesArray.push({ type: "next5", value: page, enabled: true, title: page })					
		}
		//If we have more than 10 pages to go, add link next 10 pages
		if (page == current_page+10) {
			pagesArray.push({ type: "next10", value: page, enabled: true, title: page })					
		}
	}

	//If we are not at the last page, add link to last page
	if (current_page != pages_count) {
		pagesArray.push({ type: "last", value: pages_count, enabled: true, title: "Última >>" })								
	}

	//Next page is linked if we're not at last page
	pagesArray.push({ type: "next", value: current_page+1, enabled: (current_page < pages_count), title: "Siguiente >" })
	
	return pagesArray;
}

//TODO: Deprecate
function searchPage(collection, defaultFilters, templateName) {
  return catchError(async function(req, res, next) {
   if (!templateName) { templateName = collection }
   // console.log("searchPage",defaultFilters);
   req.query.collection = collection;
   const filters = getFilters(req.query, defaultFilters);
   const current_page = req.query.page || 0;
   const debug = req.query.debug || false;
   const recommendations = []; //TODO
   const result = await getAPI(req, collection, filters, debug);
   const arrayNum = [1,2,3,4,5].slice(0, (result.pages < 5 ? result.pages: 5));

   filters.offset = current_page * 25;

   const share_url = encodeURIComponent(req.originalUrl);

   //TODO: Quitar strings de acá

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

//TODO: Quitar strings de acá
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
      console.error("QQW HOME API Error",e);

      //Avoid caching home on error
      res.cacheControl = {
        noStore: true
      }

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
  searchPage2020:searchPage2020,
  homePage:homePage,
  entityPage:entityPage,
  staticPage:staticPage,
  sendMailPage:sendMailPage,
}
