var express = require('express');
var router = express.Router();
var lib = require('../lib/lib.js');

/* GET home page. */
router.get('/', lib.homePage());

/* GET contratcs index. */
router.get('/contratos', lib.searchPage("contracts"));

/* GET persons index */
//TODO: Default filters
router.get('/personas', lib.searchPage("persons",{sort: "-compiledRelease.contract_amount.supplier"}));

/* GET institutions index */
//Don't bring UCs
router.get('/instituciones-publicas', lib.searchPage("institutions",{"compiledRelease.subclassification": "!unidad-compradora", "compiledRelease.classification": "state,institution,municipality", "sort": "-compiledRelease.contract_amount.buyer"}));

router.get('/unidades-compradoras', lib.searchPage("institutions",{"compiledRelease.subclassification": "unidad-compradora", "sort": "-flags.total_score", "embed": true},"institutions-uc"));

/* GET companies index */
router.get('/empresas', lib.searchPage("companies",{sort: "-compiledRelease.contract_amount.supplier"}));

/* GET countries index */
router.get('/paises', lib.searchPage("countries", "countries"));

/* GET contract view */
router.get('/contratos/:id', lib.entityPage("contracts","contract","ocid"));

/* GET person view. */
router.get('/personas/:id', lib.entityPage("persons","perfil","id"));

/* GET organization view. */
router.get('/instituciones-publicas/:id', lib.entityPage("institutions","perfil","id"));

router.get('/empresas/:id', lib.entityPage("companies","perfil", "id"));

router.get('/pais', lib.staticPage("profiles"));


/* GET about */
router.get('/sobre-qqw', lib.staticPage("about"));

/* GET about/sources */
router.get('/entidades-y-fuentes', lib.staticPage("sources"));

/* GET apis */
router.get('/herramientas', lib.staticPage("apis"));

/* GET about/investigations */
router.get('/investigaciones', lib.staticPage("investigations"));

/* GET about/manual */
router.get('/manual',lib.staticPage("manual"));

/* GET about/partners */
router.get('/aliados', lib.staticPage("partners"));

/* GET privacy */
router.get('/privacidad', lib.staticPage("privacy"));

/* GET contact */
router.get('/contacto', lib.staticPage("contact"));

router.post('/send', lib.sendMailPage());



module.exports = router;
