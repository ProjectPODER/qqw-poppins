var express = require('express');
var router = express.Router();
var lib = require('../lib/lib.js');

function createMultiLangRoutes(es,en,callback) {
    router.get(es, lib.redirectToLanguage(es,en));
    router.get('/:lang'+es, callback);
    router.get('/:lang'+en, callback);
}

/* GET home page. */
createMultiLangRoutes('/inicio', "/home", lib.homePage());

router.get('/', lib.redirectToLanguage("/inicio","/home"));

/* Redirect old search pages */
router.get('/personas', lib.redirectToSearch("persons"));
router.get('/contratos', lib.redirectToSearch("contracts"));
router.get('/instituciones-publicas', lib.redirectToSearch("institutions"));
router.get('/unidades-compradoras', lib.redirectToSearch("institutions-uc"));
router.get('/empresas', lib.redirectToSearch("companies"));
router.get('/paises', lib.redirectToSearch("countries"));

/* GET Searcher */
createMultiLangRoutes('/buscador', "/search", lib.searchPage2020());

/* GET entity pages. */
createMultiLangRoutes('/personas/:id', "/persons/:id", lib.entityPage("persons","perfil","id"));
createMultiLangRoutes('/instituciones-publicas/:id', '/institutions/:id', lib.entityPage("institutions","perfil","id"));
createMultiLangRoutes('/empresas/:id', '/companies/:id', lib.entityPage("companies","perfil", "id"));
createMultiLangRoutes('/regiones/:id', '/areas/:id', lib.entityPage("areas","perfil","id"));

/* GET contract pages. */
//TODO: Agregar páginas de expediente
createMultiLangRoutes('/contratos/:id', '/contracts/:id', lib.entityPage("contracts","contract","ocid"));

//TODO: Ver cómo hacemos con paises y regiones
createMultiLangRoutes('/paises/:id/mujeresenlabolsa', '/countries/:id/women-in-the-stock-exchange', lib.entityPage("countries","country-mujeres","id"));
createMultiLangRoutes('/paises/:id', '/countries/:id', lib.entityPage("countries","country","id"));

//STATIC PAGES

/* GET about */
createMultiLangRoutes("/sobre-qqw","about-qqw",lib.staticPage("about"))


/* GET about/sources */
createMultiLangRoutes('/entidades-y-fuentes', '/entities-and-sources', lib.sourcesPage("sources"));

/* GET apis */
createMultiLangRoutes('/herramientas', '/tools', lib.staticPage("apis"));

/* GET about/investigations */
createMultiLangRoutes('/investigaciones', '/research', lib.staticPage("investigations"));

/* GET about/manual */
createMultiLangRoutes('/manual', '/manual', lib.staticPage("manual"));

/* GET about/partners */
createMultiLangRoutes('/aliados', '/allies', lib.staticPage("partners"));

/* GET privacy */
createMultiLangRoutes('/privacidad', '/privacy', lib.staticPage("privacy"));

/* GET privacy */
createMultiLangRoutes('/licencia', '/license', lib.staticPage("license"));

/* GET contact */
createMultiLangRoutes('/contacto', '/contact', lib.staticPage("contact"));

/* POST contact */
createMultiLangRoutes('/enviar', '/send', lib.sendMailPage());

/* GET mujeres español */
createMultiLangRoutes('/mujeres-en-la-bolsa', '/mujeres-en-la-bolsa', lib.staticPage("mujeres-en-la-bolsa",null));
/* GET mujeres inglés */
//TODO: Unify translated page
createMultiLangRoutes('/women-in-the-stock-exchange', '/women-in-the-stock-exchange', lib.staticPage("mujeres-en-la-bolsa-english",null));

/* GET gráficos mujeres iframe */
createMultiLangRoutes('/mujeres-en-la-bolsa/grafico1','/women-in-the-stock-exchange/graph1', lib.staticPage("graph1", null));
createMultiLangRoutes('/mujeres-en-la-bolsa/grafico2','/women-in-the-stock-exchange/graph2', lib.staticPage("graph2", null));

module.exports = router;
