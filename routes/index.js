var express = require('express');
var router = express.Router();
var lib = require('../lib/lib.js');

/* GET home page. */
router.get('/', lib.homePage());

/* Redirect old search pages */
router.get('/personas', lib.redirectToSearch("persons"));
router.get('/contratos', lib.redirectToSearch("contracts"));
// //Don't bring UCs
router.get('/instituciones-publicas', lib.redirectToSearch("institutions"));
router.get('/unidades-compradoras', lib.redirectToSearch("institutions-uc"));
router.get('/empresas', lib.redirectToSearch("companies"));
router.get('/paises', lib.redirectToSearch("countries"));

/* GET Searcher */
router.get('/buscador', lib.searchPage2020());

/* GET entity pages. */
router.get('/personas/:id', lib.entityPage("persons","perfil","id"));
router.get('/instituciones-publicas/:id', lib.entityPage("institutions","perfil","id"));
router.get('/empresas/:id', lib.entityPage("companies","perfil", "id"));
router.get('/regiones/:id', lib.entityPage("areas","perfil","id"));

/* GET contract pages. */
//TODO: Agregar páginas de expediente
router.get('/contratos/:id', lib.entityPage("contracts","contract","ocid"));

//TODO: Ver cómo hacemos con paises y regiones
router.get('/paises/:id/mujeresenlabolsa', lib.entityPage("countries","country-mujeres","id"));
router.get('/paises/:id', lib.entityPage("countries","country","id"));

//STATIC PAGES

/* GET about */
router.get('/sobre-qqw', lib.staticPage("about"));

/* GET about/sources */
router.get('/entidades-y-fuentes', lib.sourcesPage("sources"));

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

/* GET privacy */
router.get('/licencia', lib.staticPage("license"));

/* GET contact */
router.get('/contacto', lib.staticPage("contact"));

/* POST contact */
router.post('/send', lib.sendMailPage());

/* GET mujeres español */
router.get('/mujeres-en-la-bolsa', lib.staticPage("mujeres-en-la-bolsa",null));
/* GET mujeres inglés */
router.get('/women-in-the-stock-exchange', lib.staticPage("mujeres-en-la-bolsa-english",null));

/* GET gráficos mujeres iframe */
router.get('/mujeres-en-la-bolsa/grafico1', lib.staticPage("graph1", null));
router.get('/mujeres-en-la-bolsa/grafico2', lib.staticPage("graph2", null));

module.exports = router;
