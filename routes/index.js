var express = require('express');
var router = express.Router();
var lib = require('../lib/lib.js');
var constants = require('../lib/const.js');

// console.log(constants.qqw_routes);

function createMultiLangRoutes(es,en,callback) {
    router.get(es, lib.redirectToLanguage(es,en));
    router.get('/:lang'+es, callback);
    router.get('/:lang'+en, callback);
}

/* Create all multilang routes */
constants.qqw_routes.map(route => {
    createMultiLangRoutes('/'+route.es, "/"+route.en, lib[route.view](route.params[0],route.params[1],route.params[2]));
})

router.get('/', lib.redirectToLanguage("/inicio","/home"));

/* Redirect old search pages */
router.get('/personas', lib.redirectToSearch("persons"));
router.get('/contratos', lib.redirectToSearch("contracts"));
router.get('/instituciones-publicas', lib.redirectToSearch("institutions"));
router.get('/unidades-compradoras', lib.redirectToSearch("institutions-uc"));
router.get('/empresas', lib.redirectToSearch("companies"));
router.get('/paises', lib.redirectToSearch("countries"));

module.exports = router;
