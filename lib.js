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

  for (f in filters) {
    params[f] = filters[f];
  }

  if (collection=="contracts") {
    params.sort="-amount";
  }
  if (collection=="persons" || collection=="organizations") {
    params.sort="-ocds_contract_count";
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
	{ htmlFieldName: "filtername", apiFieldNames:["name"], fieldLabel:"Nombre" },
	{ htmlFieldName: "proveedor", apiFieldNames:["suppliers_org"], fieldLabel:"Proveedor" },
	{ htmlFieldName: "dependencia", apiFieldNames:["buyer.name","parties.memberOf"], fieldLabel:"Dependencia" },
]


function getFilters(query) {
  let filters = {};
  for (filterElement in filterElements) {
  	if (query[filterElements[filterElement].htmlFieldName]) {
		for (apiField in filterElements[filterElement].apiFieldNames) {
			console.log(filterElements[filterElement].apiFieldNames[apiField],filterElements[filterElement].htmlFieldName);
  			filters[filterElements[filterElement].apiFieldNames[apiField]] = "/"+query[filterElements[filterElement].htmlFieldName]+"/i";
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
		    cleanFilters[filterElements[filterElement].htmlFieldName] = {
		    	fieldLabel:  filterElements[filterElement].fieldLabel,
		    	apiField: filterElements[filterElement].apiFieldNames[apiField],
		    	htmlField: filterElements[filterElement].htmlFieldName,
		    	value: filters[filterElements[filterElement].apiFieldNames[apiField]].slice(1,-2)
		    }
	  	}
	}
  }

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