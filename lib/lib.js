const nodemailer = require('nodemailer');
const errorCatcher = require('async-error-catcher');
const catchError = errorCatcher.default;
const clone = require('lodash/clone')
const Qqw = require('qqw');
const constants = require('./const');
const Parser = require('rss-parser');
const moment = require('moment');
const helpers = require('./helpers').helpers;
const _ = require('lodash')
const https = require("https");
var csv = require('@vanillaes/csv');


// Get settings from csv and set to app.locals.
// Parameters:
// - namespace: string, representing the name of the property used to store the values of this CSV file
// - CSVurl: URL from which to retrieve the CSV file
// - fields: array with column names for the CSV, each line in the CSV will be an object in an array of values. First field is the index.
function appLocalsFromCSV(app,namespace,CSVurl,fields) {
  if (!CSVurl) {
    console.error("appLocalsFromCSV error: Missing CSVurl for namespace",namespace);
    return false;
  }

  //Create the namespace object
  app.locals[namespace] = {};

  //Perform request
  https.get(CSVurl, response => {
    response.on("data", function(data) {
      parsedCSV = csv.parse(data);

      // console.log("appLocalsFromCSV data",CSVurl,data,csv);      
      for(line in parsedCSV) {
        //Only parse lines with a first value present, and ignore the first one
        if (line > 0 && parsedCSV[line][0]) {

          //Create values object for this line
          const values = {}

          //Iterate each field
          for (f in fields) {
            // console.log(f,fields,linearray);
            //Only parse existent values
            if (parsedCSV[line][f]) {
              //First field is the id
              if (f==0) {
                id = parsedCSV[line][f];
              }
              //All other fields are part of the values object
              else {
                values[fields[f]] = parsedCSV[line][f];
              }
            }
            else {
              console.error("appLocalsFromCSV","Field '",f,fields[f],"' not present in CSV line",line,"when loading",namespace,"from",CSVurl);
            }
          }
          //Add the values object to the array for this id 
          if (!app.locals[namespace][id]) { app.locals[namespace][id] = [] }
          app.locals[namespace][id].push(values);
        }
      }
      // console.log("appLocalsFromCSV app locals",namespace, app.locals[namespace])
      console.log("Loaded config", namespace)
    });
  });
}


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
    // if (filters['compiledRelease.contracts.title'] || filters['compiledRelease.parties.contactPoint.name']) {
    //   delete params.sort;
    // }
    // else {
    //   params.sort="-compiledRelease.total_amount";
    // }
    // console.log("getAPI contract filters", filters,Object.keys(filters),Object.keys(filters).length);

    //Only hide hidden contracts when there's no other filter
    if (Object.keys(filters).length<1) {
      filters.hidden="false";
    }
  }
  // if (collection=="persons" || collection=="organizations" || collection=="companies") {
  //   params.sort="-contract_amount.supplier";
  // }
  // if (collection=="institutions") {
  //   params.sort="-contract_amount.buyer";
  // }

  //We use the autocomplete endpoint to search in all collections
  if (collection=="all") {
    collection = "search"
  }

  for (f in filters) {
    //Delete collection filter from api requests, pass the rest
    // if (f != "_collection") {
      params[f] = filters[f];
    // }
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
  const newLine = "\r\n\r\n<br>" +"\r\n\r\n<br>";
  // CONTACT PAGE FORM
  var mailOptions = {
      to: process.env.EMAIL_MESSAGE_ADDRESS,
      subject: 'Contacto: ' + req.body.subjectMail,
      from: "QuienesQuien.Wiki <info@quienesquien.wiki>",
      html: "From: " + req.body.name + newLine +
			"Subject: " + req.body.subjectMail + newLine +
			"User's email: " + req.body.email + newLine +
			"Message: " + req.body.message + newLine
  }

  if (req.body.type == "info") {
  // SEND INFORMATION FORM
    mailOptions.subject = 'Información sobre: '+ req.body.url,
    mailOptions.html=   "From: " + req.body.email + newLine +
                        "Information: " + req.body.message + newLine +
						"Source: " + req.body.source + newLine +
						"Url: " + req.body.url
  }

  if (req.body.type == "info-uc") {
  // SEND INFORMATION UC
    mailOptions.subject = 'Solicitud de informe a través de QQW',
    mailOptions.html=   "From: " + req.body.email + newLine +
                        "Information: " + req.body.message + newLine +
                        "Name: " + req.body.name + newLine +
						"Url: " + req.body.url
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

  let userMailOpions = {
      to: req.body.email,
      subject: 'Muchas gracias por su mensaje',
      from: "QuienesQuien.Wiki <info@quienesquien.wiki>",
      html:  "Hola " + (req.body.name || "") + "\n\n<br>" + "Hemos recibido su correo y nuestro equipo lo revisará. Sólo contestaremos si necesitamos información adicional.\n\n<br>" +
             "\n\n<br>Muchas gracias, equipo de QuienEsQuien.wiki"
  }

  //Enviar correo al usuario
  smtpTransport.sendMail(userMailOpions,callback)

  //Enviar correo a nosotros
  return smtpTransport.sendMail(mailOptions,callback)
}

function getFilters(query, collection, defaultFilters) {
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

    //Check if this filter applies for this collection
    filter.applies = false;
    if (filter.collections.indexOf(collection) > -1 || filter.collections.indexOf("all") > -1 ) {
      filter.applies = true;
    }

  	if (queryValue && filter.applies) {
      const apiFieldName = filter.apiFilterName
      // console.log("queryValue",typeof queryValue, queryValue);
      //TODO: This throws an error is an URL parameter is set more than once
      let value = encodeURIComponent(queryValue.trim());

      if (filter.type == "minmax") {
        if (query[filter.htmlFieldName+"-min"]) {
          filters[filter.apiFilterName.min] = encodeURIComponent((query[filter.htmlFieldName+"-min"] || "").trim());
        }
        if (query[filter.htmlFieldName+"-max"]) {
          filters[filter.apiFilterName.max] = encodeURIComponent((query[filter.htmlFieldName+"-max"] || "").trim());
        }
      }
      if (filter.type == "date") {
        filters[filter.apiFilterName.min] = (query[filter.htmlFieldName+"-min"] || "1900-01-01 00:00:01").trim();
        filters[filter.apiFilterName.max] = (query[filter.htmlFieldName+"-max"] || "9999-12-31 23:59:59").trim();
        // console.log("getFilters date",min,max);
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
        //TODO: Get pagesize from filter
        let pageSize = 25;

        value = value*pageSize; 

        if (value+pageSize > 10000) {
          filters.error = "morethan10k"
        }
      }
      // if (apiFieldName == "_sortDirection") {
      //   filters["sort"] = value + filters["sort"];
      //   value = "";
      //   console.log("sortDirection",filters["sort"])
      // }

      if (value && typeof apiFieldName == "string") {
        filters[apiFieldName] = value;
      }
//         console.log("getFilters 1",filter.collections);
  		
  	}
  }
  console.log("getFilters",filters);
  return filters;
}

function cleanFilters(filters, collection) {            
  const allFilters = clone(constants.filter_elements);
  // console.log("allFilters",allFilters);
  let cleanFilters = [];

  for (filterElement in allFilters) {
    let filter = clone(allFilters[filterElement]);

    
    //Check if this filter applies for this collection
    filter.applies = false;
    if (filter.collections.indexOf(collection) > -1 || filter.collections.indexOf("all") > -1 ) {
      filter.applies = true;
    }
    
    //Only process filters for the current collection
    if (!filter.applies) {
      continue;
    }

    let value;

    if (filter.type=="date") {
      if (filters[filter.apiFilterName.min] || filters[filter.apiFilterName.max]) {
        value = {}
        if (filters[filter.apiFilterName.min]) {
          value.min = moment(filters[filter.apiFilterName.min]).format("YYYY-MM-DD")
        }
        if (filters[filter.apiFilterName.max]) {
          value.max = moment(filters[filter.apiFilterName.max]).format("YYYY-MM-DD")
        }

      }
    }
    else if (filter.type=="minmax") {
      console.log(filter.apiFilterName.min,filters);
      if (filters[filter.apiFilterName.min] || filters[filter.apiFilterName.max]) {
        value = {}
        if (filters[filter.apiFilterName.min]) {
          value.min = decodeURIComponent(decodeURIComponent(filters[filter.apiFilterName.min]));
        }
        if (filters[filter.apiFilterName.max]) {
          value.max = decodeURIComponent(decodeURIComponent(filters[filter.apiFilterName.max]));
        }

      }
    }
    else {
      value = filters[filter.apiFilterName];
    }

    if (typeof value == "string" ) {
      value = decodeURIComponent(decodeURIComponent(value));
    }
  
    if (filter.type == "bool" && filters.hasOwnProperty(filter.apiFilterName)) {
      value = value ? false : true;
    }    

    if (value) {
      filter.value = value;
    }

    cleanFilters.push(filter);
  }
  // console.log("cleanFilters",cleanFilters);
  return cleanFilters;
}

function getCollection(query) {
  return query.collection || "all";
}


function searchPage2020(defaultFilters, templateName) {
  return catchError(async function(req, res, next) {
    let moreThan10k = false;
    let processedResult = {};
    let pagesArray = [1]

    //Set language for this response
    res.locals.lang = req.params.lang;

    const collection = getCollection(req.query);

    const current_page = parseInt(req.query.page) || 0;
    const debug = req.query.debug || false;

    const filters = getFilters(req.query, collection, defaultFilters);
    
    if (!filters.error) {
      //If no filters, ask for default results
      if (Object.keys(filters).length == 0) {
        if (res.app.locals.buscadores[collection]) {
          filters.ids = res.app.locals.buscadores[collection].map((item) => { return item.id }).join(",")
        }
      }
      console.log("filters",filters);
      const result = await getAPI(req, collection, filters, debug);
  
      //Check if search has more than 10000 results because of api limits
      if (result.count == 10000 && result.count_precission == "gte") {
        moreThan10k = true;
      }
  
      pagesArray = calculatePages(result.pages,current_page,moreThan10k);
  
      // TODO: Page size
      filters.offset = current_page * 25;
  
      processedResult = fixContractResultList(result)
  
      if (debug) {
        console.log("searchPage processedResult",processedResult);
      }
    }
    else if (filters.error == "morethan10k") {
      moreThan10k = true;
      processedResult = {count: 10000, count_precission: "gte"}
      pagesArray = calculatePages(0,current_page,moreThan10k);
      
    }


    // console.log("searchPage2020",filters._collection)
    const filters_cleaned = cleanFilters(filters,collection);

    const title = generateSearchTitle(filters_cleaned);

    const share_url = encodeURIComponent(req.originalUrl);
    const current_url = cleanURL(req.originalUrl.replace(/\&\&/g,"&"));

    res.render("searcher", {
      collection: collection,
      result: processedResult,
      share_url: share_url,
      title: title,
      pagesArray:pagesArray,
      current_url: current_url,
      current_page: current_page,
      filters: filters_cleaned,
      templateName: "searcher",
      morethan10k: moreThan10k
    });
  })
}

function generateSearchTitle(filters) {
  let title = "QQW - ";
  for (f in filters) {
    let filter = filters[f]
    if (filter.apiField == "_collection") {
      title += helpers.get_type_plural(filter.value,true);
    }
    else {
      if (!filter.hidden && filter.apiFilterName != "sort" && filter.value) {
        if (filter.type=="select") {
          title+= " - " + filter.fieldLabel + ": " + filter.options[filter.value];

        }
        if (filter.type=="minmax") {
          console.log("generateSearchTitle",filter.fieldLabel,filter.value);
          title+= " - " + filter.fieldLabel + ": " + filter.value.min+" a "+filter.value.max;
        }
        else {
          title+= " - " + filter.fieldLabel + ": " + filter.value;
        }
      }
    }
    // console.log("generateSearchTitle",filters[f]);
  }
  return title;
}

function calculatePages(pages_count,current_page,moreThan10k) {
	pagesArray = [];

	//If we're more than 4 pages away, add link to first page
	if (current_page > 3) {
		pagesArray.push({ type: "first", value: 0, enabled: true, title: "<< Primera" })
	}

  // Link previous page if we're not in first page
	pagesArray.push({ type: "prev", value: current_page-1, enabled: (current_page != 0), title: "< Anterior" })


	for (page=0; page < pages_count; page++) {
		//If we're more than 10 pages away, add link previous 10 pages
		if (page == current_page-10) {
			pagesArray.push({ type: "prev10", value: page, enabled: true,  title: page+1 })
		}

		//If we're more than 5 pages away, add link previous 5 pages
		if (page == current_page-5) {
			pagesArray.push({ type: "prev5", value: page, enabled: true, title: page+1 })
		}

		//If we're more than 3 pages away, add link to all pages
		if (page > (current_page-3) && page < (current_page+3) ) {
			//Current is disabled
			if (page == current_page) {
				pagesArray.push({ type: "current", value: current_page, enabled: false, title: current_page+1 })
			}
			else {
				pagesArray.push({ type: "page", value: page, enabled: true, title: page+1 })
			}
		}
		//If we have more than 5 pages to go, add link next 5 pages
		if (page == current_page+5) {
			pagesArray.push({ type: "next5", value: page, enabled: true, title: page+1 })
		}
		//If we have more than 10 pages to go, add link next 10 pages
		if (page == current_page+10) {
			pagesArray.push({ type: "next10", value: page, enabled: true, title: page+1 })
		}
	}

  //Next page is linked if we're not at last page
  pagesArray.push({ type: "next", value: current_page+1, enabled: (current_page < (pages_count-1)), title: "Siguiente >" })

  //If we are not at the last page, add link to last page
  //on searches with less than 10.000 results (because of the API limtis)
	if (current_page != (pages_count-1) && !moreThan10k) {
		pagesArray.push({ type: "last", value: (pages_count-1), enabled: true, title: "Última >>" })


  }

	return pagesArray;
}

function entityPage(collection,templateName,idFieldName) {
  return catchError(async function(req, res, next) {
    // console.log("entityPage",collection,templateName,idFieldName,req,res,next);

    //Set language for this response
    res.locals.lang = req.params.lang;
   
    let filters = {
      limit: 1,
      sort: null,
      embed: true
    };
    const flag_count = req.query.flag_count || 3;
    const debug = req.query.debug || false;
    filters[idFieldName] = req.params.id;

    if (collection == "institutions") {
      filters["classification"] = "institution,state,municipality";
    }
    if (collection == "countries" && templateName != "country-mujeres") {
      filters["embed"] = false;
    }

    const result = await getAPI(req,collection,filters,debug);
    if (!result || !result.data || !result.data[0]) {
      let err = new Error("entityPage: Entity not found: "+collection+" "+req.params.id);
      err.status = 404;
      throw(err);
    }

    //Todo: Paralellize
    let summaries = {};
    if (collection != "contracts" && collection != "record") {
      summaries = await getAPI(req,"summaries",filters,debug);
    }
    // console.log(summariesResult);
    // const summaries = summariesResult.data ? summariesResult.data[0]: {};

    const share_url = req.originalUrl;

    let metaTitle = "";
    if (collection == "record"){ metaTitle = result.data[0].records.compiledRelease.contracts[0].title + " < " + helpers._("Expediente",res.locals.lang) + " < QuiénEsQuién.Wiki"}
    if (collection == "contracts"){ metaTitle = result.data[0].contracts.title + " < " + helpers._("Expediente",res.locals.lang) + "Contrato < QuiénEsQuién.Wiki"}
    if (collection == "persons"){ metaTitle = result.data[0].name + " < " + helpers._("Persona",res.locals.lang) + " < QuiénEsQuién.Wiki" }
    if (collection == "institutions"){ metaTitle = result.data[0].name + " < " + helpers._("Institución Pública",res.locals.lang) + " < QuiénEsQuién.Wiki" }
    if (collection == "companies"){ metaTitle = result.data[0].name + " < " + helpers._("Empresa",res.locals.lang) + " < QuiénEsQuién.Wiki" }
    if (collection == "countries"){ metaTitle = result.data[0].name  + " < " + helpers._("Mujeres en la bolsa < País",res.locals.lang) + " < QuiénEsQuién.Wiki" }

    let processedResult = {};

    if (collection == "record" || collection=="contracts" ) {
      processedResult = fixContractResultList(result).data[0]
    }
    else {
      processedResult = fixMemberships(result.data[0])
    }
    processedResult.api_url = result.api_url;

    // console.log(processedResult);

    res.render(templateName, {
      result: processedResult, 
      summaries: summaries,
      type: collection, 
      flag_count: flag_count, 
      title: metaTitle, 
      share_url: share_url
    });
  })
}

function fixContractResultList(result) {
  // console.log(result);
  // if (result && result.data && result.data[0] && result.data[0].records && result.data[0].records.length > 0) {
  //   for (let c in result.data[0].records) {
  //     result.data[0].records[c] = fixRecord(result.data[0].records[c]);
  //   }
  // }
  return result;
}
function fixSummaryContractResultList(top_contracts) {
  // console.log(result);
  if (top_contracts && top_contracts.length > 0) {
    for (let c in top_contracts) {
      top_contracts[c] = fixRecord(top_contracts[c]);
    }
  }
  return top_contracts;
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

    //Supplier summaries
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

    //Award contracts 
    record.compiledRelease.awards[c].contract = _.find(record.compiledRelease.contracts,{awardID: record.compiledRelease.awards[c].id });
    record.compiledRelease.awards[c].contract.award = record.compiledRelease.awards[c];
  }
  record.supplier_count = Object.keys(record.supplier_summary).length;
  return record;
}

function fixMemberships(result) {
  if (result.summaries) {
    result.summaries.buyer.top_contracts = fixSummaryContractResultList(result.summaries.buyer.top_contracts)
    result.summaries.supplier.top_contracts = fixSummaryContractResultList(result.summaries.supplier.top_contracts)
    result.summaries.funder.top_contracts = fixSummaryContractResultList(result.summaries.funder.top_contracts)
  }
  if (result.memberships) {
    const childMemberships = {};
    // console.log("fixMemberships",allMemberships,allMemberships.length);
    if (result.memberships.child.length > 0) {
      for (m in result.memberships.child) {
        let role = result.memberships.child[m].role;

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
        let role = result.memberships.parent[m].role;

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

    if (result.memberships.parent["Unidad Compradora"]) {
      result.membership_uc_parent = result.memberships.parent["Unidad Compradora"];
      delete result.memberships.parent["Unidad Compradora"];
    }
    if (result.memberships.child["Unidad Compradora"]) {
      result.membership_uc_child = result.memberships.child["Unidad Compradora"];
      delete result.memberships.child["Unidad Compradora"];
    }

    console.log("fixMemberships RR",result.memberships);
  }
  return result;
}

function redirectToSearch(page) {
  return catchError(async function(req, res, next) {
    const newURL = req.originalUrl
    .replace("/contratos?","/buscador/?collection=contracts&")
    .replace("/personas?","/buscador/?collection=persons&")
    .replace("/empresas?","/buscador/?collection=companies&")
    //TODO: Add subclassification filtres to unidades compradoras
      // router.get('/instituciones-publicas', lib.searchPage("institutions",{"compiledRelease.subclassification": "!unidad-compradora", "compiledRelease.classification": "state,institution,municipality", "sort": "-compiledRelease.contract_amount.buyer"}));
      // router.get('/unidades-compradoras', lib.searchPage("institutions",{"compiledRelease.subclassification": "unidad-compradora", "sort": "-flags.total_score", "embed": true},"institutions-uc"));
    .replace("/instituciones-publicas?","/buscador/?collection=institutions&")
    .replace("/unidades-compradoras?","/buscador/?collection=institutions&")
    .replace("/paises?","/buscador/?collection=countries&")

    console.log("redirectToSearch",newURL);

    return res.redirect(newURL);
  });
}

function redirectToLanguage(es,en) {
  return catchError(async function(req, res, next) {

    //Detect current lang is pointless here, this code only executes when there's no lang in url
    let current_lang = req.params.lang || req.app.locals.general.default_lang[0].es;
    let current_url = req.url ;

    //Fix for home
    if (current_url == "/") {
      current_url = es;
    }

    let newURL = "";
    if (current_lang == "es") {
      newURL = "/es"+current_url;
    }
    if (current_lang == "en") {
      newURL = "/en"+current_url.replace(es,en);
    }

    console.log("redirectToLanguage",newURL);

    return res.redirect(newURL);
  });
}

function homePage() {
  return catchError(async function(req, res, next) {
    let feed, stats, alert;

    //Set language for this response
    res.locals.lang = req.params.lang;


    const debug = req.query.debug || false;

    // Always render home even without API
    try {
      feed = await getFeed(req);
      sources = await getAPI(req,"sources");
      console.log("homePage sources",sources)
      stats = sources.data;
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

    //Set language for this response
    res.locals.lang = req.params.lang;
    
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
    const querySubject = req.query.subject;

   res.render(templateName , { 
     currentSection: templateName, 
     title: metaTitle, 
     share_url: share_url, 
     querySubject: querySubject,
     layout: layout,
     currentTemplate: "about" 
    });
 })
}

function sourcesPage() {
  return catchError(async function(req, res, next) {
    let stats, alert;
    
    //Set language for this response
    res.locals.lang = req.params.lang;
    
    // Always render sources even without API
    try {
      sources = await getAPI(req,"sources");
      stats = sources.data[0].collections;
      source = sources.data[0].sources;
    }
    catch(e) {
      alert = "No se pudieron recuperar algunas fuentes de datos, por favor contáctenos si este error le afecta.";
      console.error("QQW Sources API Error",e);

      //Avoid caching home on error
      res.cacheControl = {
        noStore: true
      }

    }
    res.render('sources', { stats:stats, alert: alert, source:source, currentSection: "sources", title:"QQW - Entidades y fuentes"});
  })
}

function sendMailPage() {
  return function (req, res) {

    //TODO: Protegernos del SPAM

    //Set language for this response
    res.locals.lang = req.params.lang;

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
  searchPage2020:searchPage2020,
  redirectToSearch:redirectToSearch,
  redirectToLanguage:redirectToLanguage,
  homePage:homePage,
  sourcesPage:sourcesPage,
  entityPage:entityPage,
  staticPage:staticPage,
  sendMailPage:sendMailPage,
  appLocalsFromCSV: appLocalsFromCSV
}
