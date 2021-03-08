var express = require('express');
var router = express.Router();
var lib = require('../lib/lib.js');
var constants = require('../lib/const.js');

// console.log(constants.qqw_routes);

function createMultiLangRoutes(es,en,callback,method) {
    router.get(es, lib.redirectToLanguage(es,en));

    if (method == "post") {
        console.log("creating post route",es)
        router.post('/:lang'+es, callback);
        router.post('/:lang'+en, callback);
    
    }
    else {
        console.log("creating get route",es)
        router.get('/:lang'+es, callback);
        router.get('/:lang'+en, callback);
    
    }
}


/* Redirect old search pages */
router.get('/personas', lib.redirectToSearch("persons"));
router.get('/contratos', lib.redirectToSearch("contracts"));
router.get('/instituciones-publicas', lib.redirectToSearch("institutions"));
router.get('/unidades-compradoras', lib.redirectToSearch("institutions-uc"));
router.get('/empresas', lib.redirectToSearch("companies"));
router.get('/paises', lib.redirectToSearch("countries"));

/* Redirect old profile pages */
router.get('/personas/:id', lib.redirectToSearch("persons"));
router.get('/contratos/:id', lib.redirectToSearch("contracts"));
router.get('/instituciones-publicas/:id', lib.redirectToSearch("institutions"));
router.get('/unidades-compradoras/:id', lib.redirectToSearch("institutions-uc"));
router.get('/empresas/:id', lib.redirectToSearch("companies"));
router.get('/paises/:id', lib.redirectToSearch("countries"));


/* Create all multilang routes */
constants.qqw_routes.map(route => {
    createMultiLangRoutes('/'+route.es, "/"+route.en, lib[route.view](route.params[0],route.params[1],route.params[2]), route.method);
})

router.get('/', lib.redirectToLanguage("/inicio","/home"));


module.exports = router;
