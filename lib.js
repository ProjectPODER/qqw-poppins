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

  console.log(process.env);

  let feed = await parser.parseURL(process.env.FEED_URL);
  return feed.items.slice(0,3);
}

// API
async function getAPI(req,collection,filters) {
  let Qqw = require('qqw');

  var client = new Qqw({rest_base: process.env.API_BASE});

  var params = []; //params recibe fields para filtrar los campos que envia y text que no se que es

  if (collection=="contracts") {
    params.sort="-records.compiledRelease.contracts.value.amount";
  }
  if (collection=="persons" || collection=="organizations") {
    params.sort="-ocds_contract_count";
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
function sendMail(req) {
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

  return smtpTransport.sendMail
}

// Filters
const filterElements = [
	{ htmlFieldName: "filtername", apiFieldNames:["name"], fieldLabel:"Nombre", type:"string" },
	{ htmlFieldName: "proveedor", apiFieldNames:["suppliers_org"], fieldLabel:"Proveedor", type:"string" },
	{ htmlFieldName: "dependencia", apiFieldNames:["buyer.name","parties.memberOf"], fieldLabel:"Dependencia", type:"string" },
	{ htmlFieldName: "size", apiFieldNames:["limit"], fieldLabel:"Resultados por página", type:"integer", hidden: true },
]


function getFilters(query) {
  let filters = {};
  for (filterElement in filterElements) {
  	if (query[filterElements[filterElement].htmlFieldName]) {
		for (apiField in filterElements[filterElement].apiFieldNames) {
			console.log(filterElements[filterElement].apiFieldNames[apiField],filterElements[filterElement].htmlFieldName);
			let value = query[filterElements[filterElement].htmlFieldName];
			if (filterElements[filterElement].type == "string") {
				value = "/"+value+"/i"
			}
  			filters[filterElements[filterElement].apiFieldNames[apiField]] = value;
  		}
  	}
  }
  console.log("getFilters",filters);
  return filters;
}

function cleanFilters(filters) {
  cleanFilters = {};
  for (filterElement in filterElements) {
	for (apiField in filterElements[filterElement].apiFieldNames) {
	  	if (filters[filterElements[filterElement].apiFieldNames[apiField]]) {
	  		cleanField = filterElements[filterElement];
		    cleanField.apiField = filterElements[filterElement].apiFieldNames[apiField];
		    cleanField.value = filters[filterElements[filterElement].apiFieldNames[apiField]]

			if (cleanField.type == "string") {
				cleanField.value = cleanField.value.slice(1,-2);
			}


		    cleanFilters[filterElements[filterElement].htmlFieldName] = cleanField;
	  	}
	}
  }
  // console.log("cleanFilters",cleanFilters);
  return cleanFilters;
}



module.exports = {
	getAPI:getAPI,
	getFeed:getFeed,
	cleanFilters:cleanFilters,
	sendMail:sendMail,
	cleanURL:cleanURL,
	getFilters:getFilters
}
