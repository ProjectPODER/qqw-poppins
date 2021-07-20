// const { loadSettings } = require("./lib");

//Partners
const cobranding_sources = {
  "cbmei": {
    description: "Con datos de Salud, Dinero y Corrupción",
    image:"/images/saluddineroycorrupcionpng.png",
    data_name: "Salud, Dinero y Corrupción",
    data_url: "https://saluddineroycorrupcion.mx",
    org_name: "PODER",
    org_url: "https://www.poderlatam.org"
  },
  "comprasimss": {
    description: "Con datos de Salud, Dinero y Corrupción",
    image:"/images/saluddineroycorrupcionpng.png",
    data_name: "Salud, Dinero y Corrupción",
    data_url: "https://saluddineroycorrupcion.mx",
    org_name: "PODER",
    org_url: "https://www.poderlatam.org"
  },
  "compranet": {
    description: "Con datos de TodosLosContratos.mx",
    image:"/images/co-branding/todosloscontratosmx.png",
    data_name: "TodosLosContratos.mx",
    data_url: "https://TodosLosContratos.mx",
    org_name: "PODER",
    org_url: "https://www.poderlatam.org"
  },
  "compranet3": {
    description: "Con datos de TodosLosContratos.mx",
    image:"/images/co-branding/todosloscontratosmx.png",
    data_name: "TodosLosContratos.mx",
    data_url: "https://TodosLosContratos.mx",
    org_name: "PODER",
    org_url: "https://www.poderlatam.org"
  },
  "latam_offshore": {
    description: "Con datos de América Latina Offshore",
    image:"/images/co-branding/al-offshore.png",
    data_name: "América Latina Offshore",
    data_url: "https://americalatinaoffshore.org/",
    org_name: "FundaciónSES",
    org_url: "https://fundses.org.ar/"
  },
  "mujeres2019": {
    description: "Con datos de MujeresEnLaBolsa.org",
    image:"/images/logo-mujeresenlabolsa.png",
    data_name: "MujeresEnLaBolsa.org",
    data_url: "https://MujeresEnLaBolsa.org",
    org_name: "PODER",
    org_url: "https://www.poderlatam.org"
  },
  "mujeres2020": {
    description: "Con datos de MujeresEnLaBolsa.org",
    image:"/images/logo-mujeresenlabolsa.png",
    data_name: "MujeresEnLaBolsa.org",
    data_url: "https://MujeresEnLaBolsa.org",
    org_name: "PODER",
    org_url: "https://www.poderlatam.org"
  },
  "pot": {
    description: "Con datos de TodosLosContratos.mx",
    image:"/images/co-branding/todosloscontratosmx.png",
    data_name: "TodosLosContratos.mx",
    data_url: "https://TodosLosContratos.mx",
    org_name: "PODER",
    org_url: "https://www.poderlatam.org"
  },
  "tdc": {
    description: "Con datos de TorreDeControl.org",
    image:"/images/co-branding/torre.png",
    data_name: "TorreDeControl.org",
    data_url: "https://TorreDeControl.org",
    org_name: "PODER",
    org_url: "https://www.poderlatam.org"
  }
};


const publisher_logos = {
  "Cuestión Pública": "CP_B3.png",
  "El Faro": "EFBW-01.png",
  "El Desconcierto": "eldesconcierto.png",
  "El País": "el-pais.png",
  "El Surtidor": "elsurtidor.png",
  "La Nación": "la-nacion.png",
  "Datasketch": "logo-datasketch.png",
  "La Diaria": "logo-ladiaria.png",
  "Managua Furiosa": "logo-nicaragua.png",
  "Plaza Pública": "logo-plazapublica.png",
  "PODER": "logo_poder_2018.png",
  "Los Tiempos": "los-tiempos.png",
  "Metro Libre": "metro-libre.png",
  "Semanario Universidad": "semanario.png",
  "Tierra de Nadie": "TDN-LOGO.png",
  "Wayka": "wayka.png",
  "Ojo Público": "ojo-publico.png"
}

const feed_basado = [
  {
    "media": { "$": { url: "/images/basadas/poplab_museo.jpg", medium: "image/jpeg"} },
    "title": "PopLab.mx: Hay prioridades en UG: 31 millones a museo, mientras OSUG...",
    "link": "https://poplab.mx/article/HayprioridadesenUG31millonesamuseomientrasOSUGyprepasbatallan",
  },
  {
    "media": { "$": { url: "/images/basadas/elclarinete_amlo.jpg", medium: "image/jpeg"} },
    "title": "El Clarinete: Más de medio millón de pesos han costado visitas de AMLO...",
    "link": "http://www.elclarinete.com.mx/mas-de-medio-millon-de-pesos-han-costado-visitas-de-amlo-a-aguascalientes/",
  },
  {
    "media": { "$": { url: "/images/basadas/emeequis_pena.png", medium: "image/png"} },
    "title": "Emeequis: El chef de las estrellas era el favorito de Peña Nieto",
    "link": "https://www.m-x.com.mx/al-dia/el-chef-de-las-estrellas-era-el-favorito-de-pena-nieto",
  }
];

// Filters
const filter_elements = [
	{
    htmlFieldName: "collection",
    apiFilterName: "collection",
		fieldLabel:"Tipo",
		type:"select",
		collections: ["all"],
    default: { label: "Todas" },
    options: [
      {id: "", label: "Todas", description: "Búsqueda de personas, empresas, instituciones, áreas y contratos."},
      {id: "companies", label: "Empresas y Sociedades", description: "Empresas proveedoras del estado, titulares de marcas y cotizando en la bolsa"},
      {id: "persons", label: "Personas", description: "Proveedores del estado, funcionaries, accionistas y directives."},
      {id: "contracts", label: "Contratos y compras", description: "Contratos públicos y compras de medicamentos de instituciones públicas a proveedores."},
      {id: "institutions", label: "Instituciones públicas", description: "Entidades y dependencias del gobierno, incluyendo empresas productivas del estado y Bancos de inversión"},
      {id: "areas", label: "Países y estados", description: "Regiones geográficas en que existan personas, empresas, instituciones públicas o contratos."},
      {id: "products", label: "Productos y medicinas", description: "Productos presentes en los contratos. Medicinas compradas por el IMSS."},
    ]
	},
	{
    htmlFieldName: "name",
    apiFilterName: "name",
		fieldLabel:"Nombre",
		type:"string",
    collections: ["all"],
    guidanceText: "Filtrar resultados por nombre, título de contrato.",
		placeholder: "Ingrese parte del nombre",
		default: { label: "Todos" },
    autocomplete_enabled: true
	},
	{
    htmlFieldName: "identifier",
    apiFilterName: "identifier",
		fieldLabel:"Identificador (RFC, RUPC, etc)",
		type:"string",
		collections: ["companies"],
		placeholder: "Ingrese número de regisro, RFC, RUPC u otro...",
		guidanceText: "Solo tenemos esta información de aquellas empresas que han recibido contratos en 2019",
		default: { label: "Todos" },
  },
  /*
      "values" : {
        "0.0" : 0.0,
        "25.0" : 66943.09477156443, 10000
        "50.0" : 299313.7097091035, 30000
        "80.0" : 2919115.319770987, 3000000
        "90.0" : 1.1475505304414432E7,
        "100.0" : 5.285298569216E12
      }
      */
  {
    htmlFieldName: "importe-proveedor",
    apiFilterName: {
      min: "contract_amount_supplier_min",
      max: "contract_amount_supplier_max",
    },
		fieldLabel:"Importe proveedor",
		type:"minmax",
    guidanceText: "No se tendran en cuenta puntos, comas o espacios. No se aceptan números decimales.",
		collections: ["persons","institutions","companies"],
		options: [
      { min: "", max: "", label: "Todos" },
			{ min: "0", max: 1E5, label: "Hasta 100,000 MXN" },
			{ min: 1e5, max: 1e6, label: "Hasta 1 millón" },
			{ min: 1e6, max: 1e7, label: "Hasta 10 millones" },
			{ min: 1e6, max: 1e8, label: "Hasta 100 millones" },
			{ min: 1e8, max: "", label: "Más de 100 millones" }
    ],
		default: { label: "Todos" },
	},
  {
    htmlFieldName: "cantidad-proveedor",
    apiFilterName: {
      min: "contract_count_supplier_min",
      max: "contract_count_supplier_max",
    },
		fieldLabel:"Cantidad proveedor",
		type:"minmax",
    guidanceText: "No se tendran en cuenta puntos, comas o espacios. No se aceptan números decimales.",
		collections: ["persons","institutions","companies"],
		options: [
      { min: "", max: "", label: "Todos" },
			{ min: "0", max: "1", label: "Sin contratos" },
			{ min: "1", max: "10", label: "1 a 10 contratos" },
			{ min: "10", max: "100", label: "10 a 100 contratos" },
			{ min: "100", max: "1000", label: "100 a 1,000 contratos" },
			{ min: "1000", max: "", label: "Más de 1,000 contratos" },
		],
		default: { label: "Todas" },
	},
  {
    htmlFieldName: "importe-comprador",
    apiFilterName: {
      min: "contract_amount_buyer_min",
      max: "contract_amount_buyer_max",
    },
		fieldLabel:"Importe comprador",
    type:"minmax",
    guidanceText: "No se tendran en cuenta puntos, comas o espacios. No se aceptan números decimales.",

		align: "center",

		collections: ["institutions"],
		options: [
      { min: "", max: "", label: "Todos" },
			{ min: 0, max: 1e6, label: "Hasta 1 millón" },
			{ min: 1e6, max: 1E7, label: "Hasta 10 millones" },
			{ min: 1e7, max: 1e8, label: "Hasta 100 millones" },
			{ min: 1e8, max: 1e9, label: "Hasta 1,000 millones" },
			{ min: 1e9, max: "", label: "Más de 1,000 millones" }
    ],
		default: { label: "Todos" },
	},
  {
    htmlFieldName: "cantidad-comprador",
    apiFilterName: {
      min: "contract_count_buyer_min",
      max: "contract_count_buyer_max",
    },
		fieldLabel:"Cantidad comprador",
		type:"minmax",
    guidanceText: "No se tendran en cuenta puntos, comas o espacios. No se aceptan números decimales.",

		collections: ["institutions"],
		options: [
      { min: "", max: "", label: "Todos" },
			{ min: "0", max: "1", label: "Sin contratos" },
			{ min: "1", max: "10", label: "1 a 10 contratos" },
			{ min: "10", max: "100", label: "10 a 100 contratos" },
			{ min: "100", max: "1000", label: "100 a 1,000 contratos" },
			{ min: "1000", max: "", label: "Más de 1,000 contratos" },
		],
		default: { label: "Todas" },
  },
  {
    htmlFieldName: "tipo-institucion",
    apiFilterName: "classification",
		fieldLabel:"Tipo de institución",
		type:"string",
    collections: ["institutions"],
		default: { value: "" },
		hidden: true,
	},

  {
    htmlFieldName: "subtipo-entidad",
    apiFilterName: "subclassification",
		fieldLabel:"Tipo de institución",
		type:"select",
    collections: ["institutions"],
    options: {
      "banco": "Banco de inversión",
      "dependencia": "Dependencia",
      "unidad-compradora": "Unidad compradora",
      "": "Todas"
    },
		default: { value: "" },
	},
  {
    htmlFieldName: "subtipo-entidad",
    apiFilterName: "subclassification",
		fieldLabel:"Tipo de empresa",
		type:"select",
    collections: ["companies"],
    options: {
      "offshore": "Empresa off-shore",
      "non-profit": "Sin fines de lucro",
      "profit": "Empresa",
      "stock-exchange": "Bolsa de valores",
      "": "Todos"
    },
		default: { value: "" },
  },
  {
    htmlFieldName: "tipo-entidad",
    apiFilterName: "classification",
		fieldLabel:"Tipo de entidad",
		type:"select",
    collections: ["all-only"],
    options: {
      "shareholder": "Accionista",
      "boardmember": "Consejero/a",
      "funcionario": "Funcionario/a",
      "proveedor": "Proveedor/a",
      "state": "Estado o provincia",
      "country": "País",
      "contract": "Contrato",
      "purchase": "Compra",
      "company": "Empresa",
      "owner": "Dueño/a",
      "city": "Ciudad",
      "institution": "Institución pública",
      "Material médico": "Material médico",
      "Artículos de consumo": "Artículos de consumo",
      "Ropa y Telas": "Ropa y Telas",
      "Medicinas y vacunas": "Medicinas y vacunas",
      "Mobiliario": "Mobiliario",
      "": "Todas"
    },
		default: { value: "" },
	},
  {
    htmlFieldName: "tipo-entidad",
    apiFilterName: "classification",
		fieldLabel:"Tipo de producto",
		type:"select",
    collections: ["products"],
    options: {
      "Material médico": "Material médico",
      "Artículos de consumo": "Artículos de consumo",
      "Ropa y Telas": "Ropa y Telas",
      "Medicinas y vacunas": "Medicinas y vacunas",
      "Mobiliario": "Mobiliario",
      "Otros productos": "Otros productos",
      "": "Todas"
    },
		default: { value: "" },
	},

  {
    htmlFieldName: "producto-indicacion",
    apiFilterName: "indications",
		fieldLabel:"Indicaciones",
		type:"string",
    collections: ["products"],
		default: { label: "Todas" },
	},

  {
    htmlFieldName: "tipo-entidad",
    apiFilterName: "classification",
		fieldLabel:"Tipo de persona",
		type:"select",
    collections: ["persons"],
    options: {
      "shareholder": "Accionista",
      "boardmember": "Consejero/a",
      "funcionario": "Funcionario/a",
      "proveedor": "Proveedor/a",
      "": "Todas"
    },
		default: { value: "" },
  },
  {
    htmlFieldName: "tipo-entidad",
    apiFilterName: "classification",
		fieldLabel:"Tipo de área",
		type:"select",
    collections: ["areas"],
    options: {
      "city": "Ciudad",
      "state": "Estado o provincia",
      "country": "País",
      "": "Todas"
    },
		default: { value: "" },
	},
  {
    htmlFieldName: "tipo-entidad",
    apiFilterName: "classification",
		fieldLabel:"Tipo de adquisición",
		type:"select",
    collections: ["contracts"],
    options: {
      "purchase": "Compras de medicinas",
      "contract": "Contratos públicos",
      "": "Todas"
    },
		default: { value: "" },
	},
	// {
  //   htmlFieldName: "titulo",
  //   apiFilterName: "title",
	// 	fieldLabel:"Título",
	// 	type:"string",
	// 	collections: ["contracts"],
	// 	default: { label: "Todos" },
	// },
	{
    htmlFieldName: "contrato-id",
    apiFilterName: "id",
		fieldLabel:"Identificador",
		type:"id",
		collections: ["contracts"],
		guidanceText: "Es el identificador del contrato en la fuente, no el OCID.",
		default: { label: "Todos" },
	},
  {
    htmlFieldName: "proveedor",
    apiFilterName: "supplier_name",
		fieldLabel:"Proveedor",
		type:"string",
		collections: ["contracts"],
    default: { label: "Todos" },
    autocomplete_enabled: true,
    autocomplete_parameters: "subclassification=profit"
	},
  {
    htmlFieldName: "producto",
    apiFilterName: "product_name",
		fieldLabel:"Producto",
		type:"string",
		collections: ["contracts"],
    default: { label: "Todos" },
    autocomplete_enabled: true,
    api_request: {
      collection: "products",
      filters:
      {
        "sort": "name.keyword",
        "sort_direction": "asc"
      }
    },
    options: {
      "": "Todos"
    },
		default: { label: "Todos" },    
	},  
  {
		htmlFieldName: "dependencia",
    apiFilterName: "buyer_name",
		fieldLabel:"Dependencia",
		type:"string",
		collections: ["contracts"],
    default: { label: "Todas" },
    autocomplete_enabled: true,
    autocomplete_parameters: "subclassification=dependencia"
	},
  {
    htmlFieldName: "financiador",
    apiFilterName: "funder_name",
		fieldLabel:"Financiador",
		type:"select",
		collections: ["contracts"],
    options: {
      "": "Todos"
    },
		default: { value: "" },
    api_request: {
      collection: "institutions",
      filters:
      {
        "limit": 100,
        "subclassification": "banco"
      }
    },
	},
  {
    htmlFieldName: "pais",
    apiFilterName: "country",
		fieldLabel:"País",
		type:"select",
		collections: ["all-only","companies","institutions","areas","persons"],
    api_request: {
      collection: "areas",
      filters:
      {
        "limit": 100,
        "classification": "country",
        "rank": "summaries.classification.company",
      }
    },
    options: {
      "": "Todos"
    },
		default: { value: "" },
	},
  {
    htmlFieldName: "estado",
    apiFilterName: "state",
		fieldLabel:"Estado",
    type:"select",
    show_if: "country",
		collections: ["all-only","institutions","areas","companies"],
    api_request: {
      collection: "areas",
      filters:
      {
        "classification": "state",
        "limit": 100,
        "country": "#ref/country",
        "rank": "summaries.classification.institution",
      }
		},
    options: {
      "": "Todos"
    },
		default: { value: "" },
	},
  {
    htmlFieldName: "ciudad",
    apiFilterName: "city",
		fieldLabel:"Ciudad",
    type:"string",
    show_if: "estado",
		collections: ["all-only","institutions","companies"],
    autocomplete_enabled: true,
    autocomplete_parameters: "classification=city&rank=summaries.classification.institution",
		default: { label: "Todas" },
	},
  // {
  //   htmlFieldName: "pais-c",
  //   apiFilterName: "country",
	// 	fieldLabel:"País",
	// 	type:"select",
	// 	collections: ["contracts"],
  //   options: {
  //     "mx": "México",
  //     "": "Todos"
  //   },
	// 	default: { value: "" },
	// },
  {
    htmlFieldName: "estado-c",
    apiFilterName: "state",
		fieldLabel:"Estado",
    type:"select",
    show_if: "country",
		collections: ["contracts"],
    options: {
      "Ciudad de México":"Ciudad de México",
      "Jalisco": "Jalisco",
      "Sonora": "Sonora",
      "Baja California": "Baja California",
      "Nuevo León": "Nuevo León",
      "Coahuila": "Coahuila",
      "Chihuahua": "Chihuahua",
      "Sinaloa": "Sinaloa",
      "Guanajuato": "Guanajuato",
      "Estado de México": "Estado de México",
      "Puebla": "Puebla",
      "Oaxaca": "Oaxaca",
      "Baja California Sur": "Baja California Sur",
      "Durango": "Durango",
      "San Luis Potosi": "San Luis Potosi",
      "Chiapas": "Chiapas",
      "Colima": "Colima",
      "Tamaulipas": "Tamaulipas",
      "Morelos": "Morelos",
      "Quintana Roo": "Quintana Roo",
      "Aguascalientes": "Aguascalientes",
      "Hidalgo": "Hidalgo",
      "Tabasco": "Tabasco",
      "Querétaro": "Querétaro",
      "Guerrero": "Guerrero",
      "Michoacán": "Michoacán",
      "Campeche": "Campeche",
      "Veracruz": "Veracruz",
      "Nayarit": "Nayarit",
      "Zacatecas": "Zacatecas",
      "Veracruz de Ignacio de la Llave": "Veracruz de Ignacio de la Llave",
      "Michoacán de Ocampo": "Michoacán de Ocampo",
      "México": "México",
      "Coahuila de Zaragoza": "Coahuila de Zaragoza",
      "Yucatán": "Yucatán",
      "San Luis Potosí": "San Luis Potosí",
      "Tlaxcala": "Tlaxcala",
      "": "Todos"
    },
		default: { value: "" },
	},
  {
    htmlFieldName: "ciudad-c",
    apiFilterName: "city",
		fieldLabel:"Ciudad",
    type:"string",
    show_if: "estado-c",
		collections: ["contracts"],
    autocomplete_enabled: false,
		default: { label: "Todas" },
	},
  {
    htmlFieldName: "responsable",
    apiFilterName: "contact_point_name",
		fieldLabel:"Responsable",
		type:"string",
		collections: ["contracts"],
		default: { label: "Todos" },
    autocomplete_enabled: true,
    autocomplete_parameters: "classification=funcionario"
	},
  {
    htmlFieldName: "fecha-inicio",
    apiFilterName: {
      min: "start_date_min",
      max: "start_date_max"
    },
		fieldLabel:"Fecha",
		type:"date",
		collections: ["contracts"],
		default: { label: "Todas" },
  },
  /*
    "values" : {
    "0.0" : 0.0,
    "25.0" : 23795.53653112353,
    "50.0" : 99694.95633732928,
    "80.0" : 625061.2300808853,
    "90.0" : 1970868.1788513407,
    "100.0" : 3.975745110016E12
  }
  */
  {
    htmlFieldName: "importe-contrato",
    apiFilterName: {
      min: "amount_min",
      max: "amount_max"
    },
		fieldLabel:"Importe",
		type:"minmax",
    guidanceText: "No se tendran en cuenta puntos, comas o espacios. No se aceptan números decimales.",
    collections: ["contracts"],
    align: "text-center",
		options: [
      { min: "", max: "", label: "Todos" },
			{ min: 0, max: 1e5, label: "Hasta 100.000 MXN" },
			{ min: 1e5, max: 1E6, label: "Hasta 1 millón" },
			{ min: 1e6, max: 1e8, label: "Hasta 100 millones" },
			{ min: 1e8, max: 1e9, label: "Hasta 1,000 millones" },
			{ min: 1e9, max: "", label: "Más de 1,000 millones" }
    ],
		default: { label: "Todos" },
	},
  {
    htmlFieldName: "tipo-adquisicion",
    apiFilterName: "procurement_method",
		fieldLabel:"Tipo de procedimiento",
		type:"select",
		collections: ["contracts"],
		options: {
      "": "Todos",
      "open": "Licitación abierta",
      "direct": "Adjudicación directa",
      "limited": "Limitado"
		},
		default: { value: "" },
  },
  {
    htmlFieldName: "fuente",
    apiFilterName: "source",
    fieldLabel: "Fuente",
    type: "select",
    guidanceText: "Filtar las entidades por el orígen de los datos. No todas las entidades existen en todas las fuentes. Para más detalle visite nuestra página de fuentes.",
    collections: ["all"],
    options: {
      "": "Todas",
    },
    api_request: {
      collection: "sourcesList",
		},

    default: { value: "" },
  },
  {
    htmlFieldName: "size",
    apiFilterName: "limit",
	 fieldLabel:"Resultados por página",
	 type:"integer",
	 hidden: true,
	 collections: ["all"],
	 default: { label: "Todos" },
  },
	{
    htmlFieldName: "sort-all",
    apiFilterName: "rank",
		fieldLabel:"Orden",
    guidanceText: "Para ver más opciones de orden, por favor utilice primero el filtro de TIPO.",
    type:"select",
		collections: ["all-only"],
		align: "right",
		default: {
			value: "summaries.classification.company,contract_amount.supplier,purchase_amount.product,summaries.classification.shareholder,summaries.classification.boardmember,contracts.value.amount,contract_amount.buyer"
		},
		options: {
      "summaries.classification.company,contract_amount.supplier,purchase_amount.product,summaries.classification.shareholder,summaries.classification.boardmember,contracts.value.amount,contract_amount.buyer": "Destacadas"
		}
	},
  //Sort products
	{
    htmlFieldName: "sort-pr",
    apiFilterName: "sort",
		fieldLabel:"Orden",
    type:"select",
		collections: ["products"],
		align: "right",
		default: {
			value: "purchase_amount.product"
		},
		options: {
      // "": "Destacadas",
			"purchase_amount.product": "Importe comprado",
			"purchase_count.product": "Cantidad de compras",
			"purchase_quantity.product": "Cantidad de unidades compradas",
			"name.keyword": "Nombre"
		}
	},
	{
    htmlFieldName: "sort-cp",
    apiFilterName: "sort",
		fieldLabel:"Orden",
    type:"select",
		collections: ["companies","persons"],
		align: "right",
		default: {
			value: "contract_amount.supplier"
		},
		options: {
      // "": "Destacadas",
			"contract_amount.supplier": "Importe proveedor",
			"contract_amount.buyer": "Importe comprador",
			"name.keyword": "Nombre",
			"area.id.keyword": "Pais"
		}
	},
	{
    htmlFieldName: "sort-i",
    apiFilterName: "sort",
		fieldLabel:"Orden",
    type:"select",
		collections: ["institutions"],
		align: "right",
		default: {
			value: "contract_amount.buyer"
		},
		options: {
      // "": "Destacadas",
			"contract_amount.supplier": "Importe proveedor",
			"contract_amount.buyer": "Importe comprador",
			"name.keyword": "Nombre",
			"area.id.keyword": "Pais"
		}
	},
	{
    htmlFieldName: "sort-a",
    apiFilterName: "sort",
		fieldLabel:"Orden",
    type:"select",
		collections: ["areas"],
		align: "right",
		default: {
			value: "summaries.classification.company"
		},
		options: {
			"summaries.classification.company": "Cantidad de empresas",
			"summaries.classification.institution": "Cantidad de instituciones púlicas",
			"summaries.classification.shareholder": "Cantidad de accionistas",
			"summaries.classification.proveedor": "Cantidad de proveedores (personas)",
			"summaries.classification.boardmember": "Cantidad de consejeros/as",
			"summaries.classification.funcionario": "Cantidad de funcionarios/as",
			"name.keyword": "Nombre",
			"parent_id.keyword": "Pais"
		}
	},
	{
		htmlFieldName: "sort-c",
    apiFilterName: "sort",
		fieldLabel:"Orden",
		type:"select",
		collections: ["contracts"],
		align: "right",
		default: {
			value: "contracts.value.amount"
		},
		options: {
      // "": "Destacadas",
      "contracts.value.amount": "Importe",
      "contracts.period.startDate": "Fecha de inicio",
      "contracts.title.keyword": "Título",
      "awards.suppliers.id.keyword": "Proveedor",
      "buyer.id.keyword": "Comprador",
		}
	},
	{
    htmlFieldName: "sortDirection",
    apiFilterName: "sort_direction",
		fieldLabel:"Dirección del orden",
		type:"toggle",
		collections: ["areas","persons","contracts","companies","institutions"],
		align: "right",
		options: [
			{ value: "desc", label: "Mayor a menor", icon:"fa-sort-amount-down" },
			{ value: "asc", label: "Menor a mayor", icon:"fa-sort-amount-up" },
	 	],
		default: { value: "desc" },
	},
	{
    htmlFieldName: "page",
    apiFilterName: "offset",
		fieldLabel:"Página",
		type:"integer",
		hidden: true,
		collections: ["all"],
	}

]

//Sites 
const qqw_sites = {
  "saluddineroycorrupcion": {
    "es": "/salud",
    "en": "/salud"
  },
  "mujeresenlabolsa": {
    "es": "/mujeres-en-la-bolsa",
    "en": "/women-in-the-stock-exchange"
  },
  "todosloscontratos": {
    "es": "/todos-los-contratos",
    "en": "/todos-los-contratos"
  },
}

//Routes
const qqw_routes = [
  /* GET home page. */
  { es: "inicio", en: "home", view: "homePage", params: [] },

  /* GET Searcher */
  { es: "buscador", en: "search", view: "searchPage2020", params: [] },

  /* GET entity pages. */
  { es: "personas/:id", en: "persons/:id", view: "entityPage", params: ["persons","perfil","id"] },
  { es: "instituciones-publicas/:id", en: "institutions/:id", view: "entityPage", params: ["institutions","perfil","id"] },
  { es: "empresas/:id", en: "companies/:id", view: "entityPage", params: ["companies","perfil","id"] },
  { es: "regiones/:id", en: "areas/:id", view: "entityPage", params: ["areas","perfil","id"] },

  /* GET contract pages. */
  { es: "contratos/:id", en: "contracts/:id", view: "entityPage", params: ["contracts","contract","id"] },
  { es: "expediente/:id", en: "record/:id", view: "entityPage", params: ["record","record","ocid"] },

   /* GET about/sources */
   { es: "entidades-y-fuentes", en: "entities-and-sources", view: "sourcesPage", params: ["sources"] },

  /* GET product pages - tolome. */
  { es: "productos/:id", en: "products/:id", view: "entityPage", params: ["products","product","id"] },


  //STATIC PAGES

  /* GET about */
  { es: "sobre-qqw", en: "about-qqw", view: "staticPage", params: ["about"]},



  /* GET apis */
  { es: "herramientas", en: "tools", view: "staticPage", params: ["apis"] },

  /* GET about/investigations */
  { es: "investigaciones", en: "research", view: "staticPage", params: ["investigations"] },

  /* GET about/manual */
  { es: "manual", en: "manual", view: "staticPage", params: ["manual"] },

  /* GET about/partners */
  { es: "aliados", en: "allies", view: "staticPage", params: ["partners"] },

  /* GET privacy */
  { es: "privacidad", en: "privacy", view: "staticPage", params: ["privacy"] },

  /* GET privacy */
  { es: "licencia", en: "license", view: "staticPage", params: ["license"] },

  /* GET contact */
  { es: "contacto", en: "contact", view: "staticPage", params: ["contact"] },

  /* POST contact */
  { es: "enviar", en: "send", view: "sendMailPage", params: [], method: "post" },

  //Mujeres en la bolsa
  { es: "regiones/:id/mujeresenlabolsa", en: "areas/:id/women-in-the-stock-exchange", view: "entityPage", params: ["areas","country-mujeres","id"] },

  /* GET toloco */
  { es: "todos-los-contratos", en: "todos-los-contratos", view: "staticPage", params: ["todos-los-contratos",null] },

  /* GET mujeres español */
  { es: "mujeres-en-la-bolsa", en: "mujeres-en-la-bolsa", view: "staticPage", params: ["mujeres-en-la-bolsa",null] },
  /* GET mujeres inglés */
  //TODO: Unify translated page
  { es: "women-in-the-stock-exchange", en: "women-in-the-stock-exchange", view: "staticPage", params: ["mujeres-en-la-bolsa-english",null] },

  /* GET gráficos mujeres iframe */
  { es: "mujeres-en-la-bolsa/grafico1", en: "women-in-the-stock-exchange/graph1", view: "staticPage", params: ["graph1", null]},
  { es: "mujeres-en-la-bolsa/grafico2", en: "women-in-the-stock-exchange/graph2", view: "staticPage", params: ["graph2", null]},

  /* GET tolome */
  { es: "salud", en: "salud", view: "staticPage", params: ["salud", "salud"] },
  /* GET tolome */
  { es: "salud-estados", en: "salud-estados", view: "staticPage", params: ["salud-estados", "salud-estados"] },

  // { es: "sadico-1", en: "sadico-1", view: "staticPage", params: ["salud1",null] },
  // { es: "sadico-2", en: "sadico-2", view: "staticPage", params: ["salud2",null] },
  // { es: "sadico-3", en: "sadico-3", view: "staticPage", params: ["salud3",null] },

  { es: "configuracion", en: "settings", view: "reloadSettingsView", params: []}

];

//Contracts and flags
const contract_categories_min_max = {
    "max-contract_score-total_score" : 0.8145347394540943,
    "min-contract_score-total_score" : 0.3652233250620347,
    "max-contract_score-trans" : 0.5169727047146402,
    "min-contract_score-trans" : 0.3414474772539289,
    "max-contract_score-temp" : 1,
    "min-contract_score-temp" : 0,
    "max-contract_score-comp" : 1,
    "min-contract_score-comp" : 0,
    "max-contract_score-traz" : 0.75,
    "min-contract_score-traz" : 0.25,
    "max-rules_score-trans-ov" : 0,
    "min-rules_score-trans-ov" : 0,
    "max-rules_score-trans-sc" : 1,
    "min-rules_score-trans-sc" : 0.8333333333333334,
    "max-rules_score-trans-cc" : 0.2,
    "min-rules_score-trans-cc" : 0.12923076923076923,
    "max-rules_score-trans-ccm" : 0.8709677419354839,
    "min-rules_score-trans-ccm" : 0.4032258064516129,
    "max-rules_score-temp-cft" : 1,
    "min-rules_score-temp-cft" : 0,
    "max-rules_score-temp-tipo" : 1,
    "min-rules_score-temp-tipo" : 0,
    "max-rules_score-temp-dl" : 1,
    "min-rules_score-temp-dl" : 0,
    "max-rules_score-temp-fs" : 1,
    "min-rules_score-temp-fs" : 0,
    "max-rules_score-comp-cfc" : 1,
    "min-rules_score-comp-cfc" : 0,
    "max-rules_score-comp-pf" : 1,
    "min-rules_score-comp-pf" : 0,
    "max-rules_score-traz-ei" : 1,
    "min-rules_score-traz-ei" : 0,
    "max-rules_score-traz-cft" : 0,
    "min-rules_score-traz-cft" : 0,
    "max-rules_score-traz-mc" : 1,
    "min-rules_score-traz-mc" : 0,
    "max-rules_score-traz-ip" : 0,
    "min-rules_score-traz-ip" : 0,
    "max-rules_score-traz-pf" : 1,
    "min-rules_score-traz-pf" : 0,
    "max-rules_score-traz-ir" : 1,
    "min-rules_score-traz-ir" : 0,
    "max-rules_score-traz-ct" : 1,
    "min-rules_score-traz-ct" : 0,
    "max-rules_score-traz-fro" : 1,
    "min-rules_score-traz-fro" : 0
}

const party_categories_min_max = {
    "max-contract_categories-total_score" : 0.8149193548387097,
    "min-contract_categories-total_score" : 0.43852253928866836,
    "max-contract_categories-trans" : 0.5185111662531018,
    "min-contract_categories-trans" : 0.3414474772539289,
    "max-contract_categories-temp" : 1,
    "min-contract_categories-temp" : 0,
    "max-contract_categories-comp" : 1,
    "min-contract_categories-comp" : 0.5,
    "max-contract_categories-traz" : 0.75,
    "min-contract_categories-traz" : 0.25,
    "max-contract_rules-trans-ov" : 0,
    "min-contract_rules-trans-ov" : 0,
    "max-contract_rules-trans-sc" : 1,
    "min-contract_rules-trans-sc" : 0.833333333333307,
    "max-contract_rules-trans-ccm" : 0.8709677419354839,
    "min-contract_rules-trans-ccm" : 0.4032258064516129,
    "max-contract_rules-trans-cc" : 0.20615384615384616,
    "min-contract_rules-trans-cc" : 0.12923076923076923,
    "max-contract_rules-temp-cft" : 1,
    "min-contract_rules-temp-cft" : 0,
    "max-contract_rules-temp-tipo" : 1,
    "min-contract_rules-temp-tipo" : 0,
    "max-contract_rules-temp-dl" : 1,
    "min-contract_rules-temp-dl" : 0,
    "max-contract_rules-temp-fs" : 1,
    "min-contract_rules-temp-fs" : 0,
    "max-contract_rules-comp-cfc" : 1,
    "min-contract_rules-comp-cfc" : 0,
    "max-contract_rules-comp-pf" : 1,
    "min-contract_rules-comp-pf" : 0,
    "max-contract_rules-traz-ei" : 1,
    "min-contract_rules-traz-ei" : 0,
    "max-contract_rules-traz-cft" : 0,
    "min-contract_rules-traz-cft" : 0,
    "max-contract_rules-traz-mc" : 1,
    "min-contract_rules-traz-mc" : 0,
    "max-contract_rules-traz-ip" : 0,
    "min-contract_rules-traz-ip" : 0,
    "max-contract_rules-traz-pf" : 1,
    "min-contract_rules-traz-pf" : 0,
    "max-contract_rules-traz-ir" : 1,
    "min-contract_rules-traz-ir" : 0,
    "max-contract_rules-traz-ct" : 1,
    "min-contract_rules-traz-ct" : 0,
    "max-contract_rules-traz-fro" : 1,
    "min-contract_rules-traz-fro" : 0,
    "max-node_rules-conf" : 0.8129032258064516,
    "min-node_rules-conf" : 0.47116521918941273,
    "max-node_rules-aepm" : 1,
    "min-node_rules-aepm" : 0,
    "max-node_rules-aepc" : 1,
    "min-node_rules-aepc" : 0,
    "max-node_rules-tcr10" : 1,
    "min-node_rules-tcr10" : 0,
    "max-node_rules-mcr10" : 1,
    "min-node_rules-mcr10" : 0,
    "max-node_rules-celp" : 1,
    "min-node_rules-celp" : 0,
    "max-node_rules-rla" : 1,
    "min-node_rules-rla" : 0,
    "max-node_rules-ncap3" : 1,
    "min-node_rules-ncap3" : 0,
    "max-node_categories-comp" : 1,
    "min-node_categories-comp" : 0,
    "max-node_categories-traz" : 1,
    "min-node_categories-traz" : 0,
    "max-node_categories-total_score" : 1,
    "min-node_categories-total_score" : 0,
    "max-category_score-comp" : 1,
    "min-category_score-comp" : 0.25,
    "max-category_score-traz" : 0.875,
    "min-category_score-traz" : 0.125,
    "max-total_score" : 0.898266129032258,
    "min-total_score" : 0.21926126964433418
}

const flag_categories = {

  conf: {
    name: "Confiabilidad",
    info: "Una organización es tan confiable como el promedio de aquellas con las que se relaciona."
  } ,
  traz: {
    name: "Trazabilidad",
    info: "Se puede seguir el dinero del presupuesto al ítem y se conocen los detalles de todos los actores involucrados."
  },
  trans: {
    name: "Transparencia",
    info: "Cumple con estándares internacionales de contrataciones abiertas."
  },
  comp: {
    name: "Competitividad",
    info: "El proceso de contratación fue una competencia justa y abierta."
  },
  temp: {
    name: "Temporalidad",
    info: "Se respetan los tiempos de los distintos procesos dentro la contratación."
  },
  total_score: {
    name: "Puntaje total",
    info: "Promedio de todas categorías."
  }
}

const flag_details = {
  "trans-ov": {
    id: "trans-ov",
    name: "OCDS válido",
    category: "Transparencia",
    level: "contract",
    description: "Es un documento válido OCDS o no.",
    type: "bool",
    contract_string: "No cumple con el estándar de datos de contrataciones abiertas - OCDS.",
    uc_string: "",
    hidden_uc: true,
  },
  "trans-sc": {
    id: "trans-sc",
    name: "Secciones completas",
    category: "Transparencia",
    level: "contract",
    description: "Contiene todas las secciones principales de OCDS.",
    type: "percent",
    contract_string: "Le falta información en una o más de las cinco secciones principales del estándar OCDS.",
    uc_string: "",
    hidden_uc: true,
  },
  "trans-cc": {
    id: "trans-cc",
    name: "Campos completos",
    category: "Transparencia",
    level: "contract",
    description: "Porcentaje de campos de OCDS que existen y tienen valor en el contrato.",
    type: "percent",
    contract_string: "No tiene datos en todos los campos definidos por el OCDS.",
    uc_string: "",
    hidden_uc: true,
  },
  "temp-cft": {
    id: "trans-cft",
    level: "contract",
    category: "Temporalidad",
    name: "Campos fundamentales para la temporalidad",
    description: "Existe una fecha valida en los campos: publicación de la oportunidad, adjudicación de contrato, inicio contrato y fin de contrato.",
    type: "percent",
    contract_string: "Le falta una o más fechas fundamentales para el proceso de contratración.",
    uc_string: "Se deben reportar todas las fechas relevantes del contrato: fecha de apertura y cierre de recepción de propuestas, fecha de adjudicación, fecha inicio y fecha fin del contrato. También para procesos restringidos como adjudicación directa o invitación a tres.",
    hidden_uc: false,
  },
  "temp-dl": {
    id: "temp-dl",
    level: "contract",
    category: "Temporalidad",
    name: "Duración larga",
    description: "La diferencia entre el inicio y fin de contrato supera los 1000 días.",
    type: "bool",
    contract_string: "La diferencia entre el inicio y fin de contrato supera los 1000 días.",
    uc_string: "Se realizan contratos por un tiempo demasiado largo, se recomienda hacer contratos más cortos ya que permiten un mejor seguimiento.",
    hidden_uc: false,
  },
  "temp-tipo": {
    id: "temp-tipo",
    level: "contract",
    category: "Temporalidad",
    name: "Tiempo insuficiente de preparación de ofertas",
    description: "La diferencia entre la fecha de publicación y cierre de recepción de ofertas es menor a 15 días.",
    type: "bool",
    contract_string: "La diferencia entre la fecha de publicación y cierre de recepción de ofertas es menor a 15 días.",
    uc_string: "En varios contratos el tiempo para preparar la oferta es insuficiente, esto genera ineficiencias en el proceso de contratación y podría ir contra lo estipulado en la ley.",
    hidden_uc: false,
  },
  "temp-fs": {
    id: "temp-fs",
    level: "contract",
    category: "Temporalidad",
    name: "Fechas sospechosas",
    description: "El contrato se celebra en fechas no laborales del gobierno o feriados oficiales.",
    type: "bool",
    contract_string: "El contrato se ha celebrado en feriados oficiales o fechas no laborales del gobierno.",
    uc_string: "Demasiados contratos firmados en festivo o feriado. Se recomienda trabajar de forma más eficiente y hacer las cosas en sus debidos tiempos.",
    hidden_uc: false,
  },
  "comp-cfc": {
    id: "comp-cfc",
    level: "contract",
    category: "Competitividad",
    name: "Campos fundamentales para la competitividad",
    description: "Existe un proveedor con nombre válido y especifican el tipo de procedimiento del contrato. Bandera en porcentaje.",
    type: "percent",
    contract_string: "Le falta el tipo de procedimiento o el nombre del proveedor.",
    uc_string: "Ser más cuidadosos y poner siempre el método del contrato y el nombre del proveedor.",
    hidden_uc: false,
  },
  "comp-pf": {
    id: "comp-pf",
    level: "contract",
    category: "Competitividad",
    name: "Paraísos fiscales",
    description: "El proveedor está basado en uno de los países con score > 65 en el global secrecy index.",
    type: "bool",
    contract_string: "El proveedor tiene su residencia en un paraíso fiscal.",
    uc_string: "Establecer una nueva cláusula que penalice aquellas empresas que tienen su residencia legal en un paraíso fiscal.",
    hidden_uc: false,
  },
  "traz-cft": {
    id: "traz-cft",
    level: "contract",
    category: "Trazabilidad",
    name: "Campos fundamentales para la trazabilidad",
    description: "Tiene algún dato que relaciona al contrato con presupuesto y los distintos actores que participan en el contrato están identificados.",
    type: "percent",
    contract_string: "Falta uno o más datos para vincular el contrato con el presupuesto y los actores participantes.",
    uc_string: "Siempre poner la información necesaria para vincular el contrato con el presupuesto.",
    hidden_uc: false,
  },
  "traz-ei": {
    id: "traz-ei",
    level: "contract",
    category: "Trazabilidad",
    name: "Escala inconsistente",
    description: "La escala reportada por el comprador y proveedor no coinciden.",
    type: "bool",
    contract_string: "Inconsistencia entre la escala de la demanda y la escala de la empresa ganadora.",
    uc_string: "Ser más coherentes entre la escala de la empresa (micro-pequeña-mediana-grande) demandada y la escala que tiene la empresa que ganó el contrato.",
    hidden_uc: false,
  },
  "traz-fro": {
    id: "traz-fro",
    level: "contract",
    category: "Trazabilidad",
    name: "Falta de referencia oficial",
    description: "No se incluye un enlace a la publicación oficial.",
    type: "bool",
    contract_string: "No tiene un enlace para verificar los datos que están en la base de datos.",
    uc_string: "Asociar todos los contratos publicados en la base de datos un enlace donde se pueda conseguir más información.",
    hidden_uc: false,
  },
  "traz-ir": {
    id: "traz-ir",
    level: "contract",
    category: "Trazabilidad",
    name: "Importe redondeado",
    description: "El importe del contrato es un múltiplo de 10,000.",
    type: "bool",
    contract_string: "El contrato es un importe redondeado.",
    uc_string: "Ser más exhaustivos en los costes del contrato para no acabar dando un importe redondeado -y probablemente aproximado- como bueno.",
    hidden_uc: false,
  },
  "traz-ip": {
    id: "traz-ip",
    level: "contract",
    category: "Trazabilidad",
    name: "Información de las partes",
    description: "Cada parte involucrada tiene información de contacto de algún tipo.",
    type: "bool",
    contract_string: "Cada una de las partes involucradas tiene algún tipo de información de contacto.",
    uc_string: "Las empresas con las que trabajan deben tener algún tipo de contacto más allá del nombre.",
    hidden_uc: false,
  },
  "traz-mc": {
    id: "traz-mc",
    level: "contract",
    category: "Trazabilidad",
    name: "Modificaciones al contrato",
    description: "El contrato ha sufrido modificaciones desde su publicación.",
    type: "bool",
    contract_string: "El contrato ha sufrido modificaciones.",
    uc_string: "Demasiados contratos que sufren modificaciones una vez ya se han publicado.",
    hidden_uc: false,
  },
  "traz-pf": {
    id: "traz-pf",
    level: "contract",
    category: "Trazabilidad",
    name: "Proveedor fantasma",
    description: "El proveedor no tiene código RUPC, o éste no viene incluido",
    type: "bool",
    contract_string: "El proveedor no se dio de alta en el registro de proveedores únicos.",
    uc_string: "Las empresas con las que trabajan no se dan de alta en el Registro Único de Proveedores y Contratistas.",
    hidden_uc: false,
  },
  "traz-ct": {
    id: "traz-ct",
    level: "contract",
    category: "Trazabilidad",
    name: "Comprensión del título",
    description: "El título es descriptivo y claro, no consiste solamente de códigos o abreviaciones.",
    type: "bool",
    contract_string: "El título es genérico y no refleja con precisión el propósito del contrato.",
    uc_string: "Los títulos de los contratos contienen códigos o palabras vacías que los hacen incomprensibles para la ciudadanía.",
    hidden_uc: false,
  },
  "conf": {
    id: "conf",
    level: "party",
    category: "Confiabilidad",
    name: "Confiabilidad",
    description: "Score que se calcula con base a las partes con las cuales un comprador/proveedor se relaciona.",
    type: "percent",
    contract_string: "Los actores involucrados en el contrato tienen puntuaciones bajas.",
    uc_string: "Se realizan contratos con empresas que participan en contratos con datos de baja calidad.",
    hidden_uc: false,
  },
  "aepm": {
    id: "aepm",
    level: "node",
    category: "Competitividad",
    name: "% Agente Económico Preponderante (AEP) por monto.",
    description: "Alto porcentaje del monto total de adjudicaciones de una dependencia/UC al mismo proveedor.",
    type: "percent",
    contract_string: "",
    uc_string: "No contratar importes tan altos con un único proveedor para evitar que este tenga una posición preponderante dentro de la institución.",
    hidden_uc: false,
  },
  "aepc": {
    id: "aepc",
    level: "node",
    category: "Competitividad",
    name: "% AEP por cantidad de contratos",
    description: "Alto porcentaje de la cantidad de adjudicaciones de una dependencia/UC al mismo proveedor.",
    type: "percent",
    contract_string: "",
    uc_string: "No realizar un porcentaje de contratos tan alto con un único proveedor para evitar que este tenga una posición preponderante dentro de la institución.",
    hidden_uc: false,
  },
  "tcr10": {
    id: "tcr10",
    level: "node",
    category: "Trazabilidad",
    name: "Títulos de contrato repetidos",
    description: "El nombre del contrato se repite en un 10% de los casos. Bandera no aplica si hay diez o menos contratos al año. ",
    type: "percent",
    contract_string: "",
    uc_string: "Ser más específicos con los nombres de los contratos y no repetir nombres como “Servicios profesionales”.",
    hidden_uc: false,
  },
  "mcr10": {
    id: "mcr10",
    level: "node",
    category: "Trazabilidad",
    name: "Montos de contratos repetidos",
    description: "El monto del contrato se repite en un 10% de los casos. Bandera no aplica si hay diez o menos contratos al año. ",
    type: "percent",
    contract_string: "",
    uc_string: "Ser más exhaustivos con los presupuestos presentados y tareas contratadas para evitar repetir montos de contrato el mismo año.",
    hidden_uc: false,
  },
  "celp": {
    id: "celp",
    level: "node",
    category: "Competitividad",
    name: "Concentración de excepciones a la licitación púb.",
    description: "El 33% del importe total de las adjudicaciones/invitaciones a tres de una dependencia van hacia la misma empresa.",
    type: "percent",
    contract_string: "",
    uc_string: "Abrir los procesos de contratación y no abusar de las adjudicaciones e invitaciones a tres.",
    hidden_uc: false,
  },
  "rla": {
    id: "rla",
    level: "node",
    category: "Competitividad",
    name: "Rebasa el límite asignado",
    description: "Una dependencia/UC contrata más del 30% del importe total por adjudicación e invitación a tres.",
    type: "percent",
    contract_string: "",
    uc_string: "Esta bandera es más que una recomendación, se podría estar vulnerado la ley al haber contratado más del 30% del importe anual por adjudicación directa.",
    hidden_uc: false,
  },
  "ncap3": {
    id: "ncap3",
    level: "node",
    category: "Competitividad",
    name: "Número de contratos arriba del promedio",
    description: "Una dependencia realiza el 30% de sus contratos del año en un mismo dia. Bandera no aplica si hay diez o menos contratos al año. ",
    type: "percent",
    contract_string: "",
    uc_string: "Los momentos con mucho trabajo son complicados, mejor realiza las contrataciones espaciadas y no concentradas todas en un mismo dia.",
    hidden_uc: false,
  },
}

//Names and icons
const array_proveedor_funcionario = [ 'funcionario', 'proveedor' ];
const array_funcionario_proveedor = [ 'proveedor', 'funcionario' ];


const classification_icons = {
  "company": {
    "stock-exchange": {
      "undefined": "fa-chart-line",
    },
    "non-profit": {
      "undefined": "fa-globe",
    },
    "offshore": {
      "undefined": "fa-building",
    },
    "profit": {
      "undefined": "fa-building",
    },
    "undefined":  {
      "undefined": "fa-building",
    },
  },
  "companies": {
    "stock-exchange": {
      "undefined": "fa-chart-line",
    },
    "non-profit": {
      "undefined": "fa-globe",
    },
    "offshore": {
      "undefined": "fa-building",
    },
    "profit": {
      "undefined": "fa-building",
    },
    "undefined":  {
      "undefined": "fa-building",
    },
  },
  "organizations": {
    "Private Company": {
      "undefined": "fa-building",
    },
    "Public Company": {
      "undefined": "fa-building",
    },
    "stock-exchange": {
      "undefined": "fa-chart-line",
    },
    "non-profit": {
      "undefined": "fa-globe",
    },
    "offshore": {
      "undefined": "fa-building",
    },
    "profit": {
      "undefined": "fa-building",
    },
    "undefined":  {
      "undefined": "fa-circle",
    },
    "dependencia": {
      "region": "fa-landmark",
      "city": "fa-landmark",
      "country": "fa-landmark",
      "undefined": "fa-landmark",
    },
    "unidad-compradora": {
      "regional": "fa-shopping-cart",
      "region": "fa-shopping-cart",
      "city": "fa-shopping-cart",
      "country": "fa-shopping-cart",
      "undefined": "fa-shopping-cart",
    },

  },
  "shareholder": {
    "individual-person-with-significant-control": {
      "undefined": "fa-user"
    },
    "undefined": {
      "undefined": "fa-user"
    }
  },
  "boardmember": {
    "undefined": {
      "undefined": "fa-user"
    },
    "director": {
      "undefined": "fa-user"
    }
  },
  "person": {
    "person":  {
      "undefined": "fa-user",
    },
    "undefined": {
      "undefined": "fa-user",
    },
  },
  "persons": {
    "person":  {
      "undefined": "fa-user",
    },
    "undefined": {
      "undefined": "fa-user",
    },
  },
  ["proveedor"]: {
    "undefined": {
      "undefined": "fa-user-cog",
    },
  },
  ["funcionario"]: {
    "undefined": {
      "undefined": "fa-user-tie",
    },
  },
  [array_proveedor_funcionario] : {
    "undefined": {
      "undefined": "fa-user-friends",
    },
  },
  [array_funcionario_proveedor] : {
    "undefined": {
      "undefined": "fa-user-friends",
    },
  },
  "institution": {
    "dependencia": {
      "region": "fa-landmark",
      "city": "fa-landmark",
      "country": "fa-landmark",
      "undefined": "fa-landmark",
    },
    "unidad-compradora": {
      "regional": "fa-shopping-cart",
      "region": "fa-shopping-cart",
      "city": "fa-shopping-cart",
      "country": "fa-shopping-cart",
      "undefined": "fa-shopping-cart",
    },
    "banco": {
      "undefined": "fa-landmark"
    },
    "undefined": {
      "undefined": "fa-landmark",
    }
  },
  "institutions": {
    "dependencia": {
      "region": "fa-landmark",
      "city": "fa-landmark",
      "country": "fa-landmark",
      "undefined": "fa-landmark",
    },
    "unidad-compradora": {
      "regional": "fa-shopping-cart",
      "region": "fa-shopping-cart",
      "city": "fa-shopping-cart",
      "country": "fa-shopping-cart",
      "undefined": "fa-shopping-cart",
    },
    "undefined": {
      "undefined": "fa-landmark",
    }
  },
  "state": {
    "undefined": {
      "undefined": "fa-map-marked",
    }
  },
  "city": {
    "undefined": {
      "undefined": "fa-city",
    }
  },
  "country": {
    "country-of-residence": {
      "undefined": "fa-flag"
    },
    "undefined": {
      "undefined": "fa-flag",
    }
  },
  "contract": {
    "undefined": {
      "undefined": "fa-file-alt",
    }
  },
  "purchase": {
    "undefined": {
      "undefined": "fa-file-medical",
    }
  },

  "record": {
    "undefined": {
      "undefined": "fa-folder-open",
    }
  },
  "undefined": {
    "undefined": {
      "undefined": "fa-circle",
    }
  },

  "Ropa y Telas": {
    "undefined": {
      "undefined": "fa-tshirt",
    }
  },
  "Material médico": {
    "undefined": {
      "undefined": "fa-stethoscope",
    }
  },

  "Artículos de consumo": {
    "undefined": {
      "undefined": "fa-box",
    }
  },

  "Mobiliario": {
    "undefined": {
      "undefined": "fa-chair",
    }
  },

  "Medicinas y vacunas": {
    "undefined": {
      "undefined": "fa-prescription-bottle-alt",
    }
  },
  "Otros productos": {
    "undefined": {
      "undefined": "fa-box",
    }
  },
  "products": {
    "undefined": {
      "undefined": "fa-box",
    }
  },  
  "undefined": {
    "undefined": {
      "undefined": "fa-box",
    }
  }
}


const classification_names = {
  "companies": {
    "company": {
      "stock-exchange": {
        "undefined": "Bolsa",
      },
      "non-profit": {
        "undefined": "Asociación civil",
      },
      "profit": {
        "undefined": "Empresa",
      },
      "offshore": {
        "undefined": "Empresa",
      },
      "undefined":  {
        "undefined": "Empresa",
      },
    },
  },
  "company": {
    "undefined": {
      "undefined": {
        "undefined": "Empresa",
      }
    },
  },
  "organizations": {
    "company": {
      "undefined": {
        "undefined": "Empresa",
      }
    },
  },  
  "persons": {
    "person": {
      "person":  {
        "undefined": "Persona",
      },
      "undefined": {
        "undefined": "Persona",
      },
    },
    ["proveedor"]: {
      "undefined": {
        "undefined": "Proveedor",
      },
    },
    [array_proveedor_funcionario] : {
      "undefined": {
        "undefined": "Proveedor y funcionario/a",
      },
    },
    [array_funcionario_proveedor] : {
      "undefined": {
        "undefined": "Proveedor y funcionario/a",
      },
    },
    ["funcionario"]: {
      "undefined": {
        "undefined": "Funcionario/a",
      },
    },
    "boardmember": {
      "undefined": {
        "undefined": "Consejere"
      }
    },
    "shareholder": {
      "undefined": {
        "undefined": "Accionista"
      }
    },

    "undefined": {
      "undefined": {
        "undefined": "Persona",
      },
    },
  },
  "person": {
    "undefined": {
      "undefined":  {
        "undefined": "Persona",
      },
    },
  },

  "institutions": {
    "institution": {
      "dependencia": {
        "region": "Dependencia estatal",
        "city": "Dependencia municipal",
        "country": "Dependencia federal",
        "undefined": "Dependencia",
      },
      "unidad-compradora": {
        "regional": "Unidad compradora estatal",
        "city": "Unidad compradora municipal",
        "country": "Unidad compradora federal",
        "region": "Unidad compradora estatal",
        "undefined": "Unidad compradora",
      },
      "undefined": {
        "undefined": "Institución pública o empresa productiva del estado",
      }
    },
  },
  "areas": {
    "state": {
      "undefined": {
        "undefined": "Estado",
      }
    },
    "city": {
      "undefined": {
        "undefined": "Ciudad",
      }
    },
    "country": {
      "country-of-residence": {
        "undefined": "País",
      },
      "undefined": {
        "undefined": "País",
      }
    },
  },
  "contracts": {
    "undefined": {
      "undefined": {
        "undefined": "Contrato",
      }
    },
    "purchase": {
      "undefined": {
        "undefined": "Compra"
      }
    },
    "contract": {
      "undefined": {
        "undefined": "Contrato",
      }
    }
  },
  "contract": {
    "undefined": {
      "undefined": {
        "undefined": "Contrato",
      }
    }
  },
  "record": {
    "undefined": {
      "undefined": {
        "undefined": "Expediente",
      }
    }
  },
  "undefined": {
    "undefined": {
      "undefined": {
        "undefined": "Entidad",
      }
    }
  },
  "products": {
    "Ropa y Telas": {
      "undefined": {
        "undefined": "Ropa y Telas"
      }
    },
    "Material médico": {
      "undefined": {
        "undefined": "Material médico"
      }
    },

    "Artículos de consumo": {
      "undefined": {
        "undefined": "Artículos de consumo"
      }
    },

    "Mobiliario": {
      "undefined": {
        "undefined": "Mobiliario"
      }
    },

    "Medicinas y vacunas": {
      "undefined": {
        "undefined": "Medicinas y vacunas"
      }
    },
    "Otros productos": {
      "undefined": {
        "undefined": "Otros productos"
      }
    },
    "undefined": {
      "undefined": {
        "undefined": "Producto"
      }
    }
  }

}


const govlevel_names = {
  "country": "federal",
  "state": "estatal",
  "city": "municipal"
}

const role_names = {
  "Punto de Contacto": {
    "child": {
      "label": "Responsable de unidad compradora",
      "icon": "fa-shopping-cart"
    },
    "parent": {
      "label": "Responsable de la unidad",
      "icon": "fa-user-tag"
    }
  },
  "Shareholder": {
    "child": {
      "label": "Accionistas",
      "icon": "fa-hand-holding-usd"
    },
    "parent": {
      "label": "Accionista de",
      "icon": "fa-hand-holding-usd"
    }
  },
  "Boardmember": {
    "child": {
      "label": "Consejeras/os",
      "icon": "fa-user-tie"
    },
    "parent": {
      "label": "Consejera/o de",
      "icon": "fa-user-tie"
    }
  },
  "Unidad Compradora": {
    "child": {
      "label": "Pertenece a la dependencia",
      "icon": "fa-landmark"
    },
    "parent": {
      "label": "Unidades compradoras de esta dependencia",
      "icon": "fa-shopping-cart"
    }
  },
  "Estado": {
    "child": {
      "label": "Pertenece a país",
      "icon": "fa-flag"
    },
    "parent": {
      "label": "Estados o provincias",
      "icon": "fa-map-marked"
    }

  },
  "Pertenece a Municipio": {
    "child": {
      "label": "Pertenece a la ciudad de",
      "icon": "fa-city"
    },
    "parent": {
      "label": "Dependencias en esta ciudad",
      "icon": "fa-landmark"
    }
  },
  "Municipio": {
    "child": {
      "label": "Estado",
      "icon": "fa-map-marked"
    },
    "parent": {
      "label": "Ciudades",
      "icon": "fa-city"
    }
  },
  "Parent Organization": {
    "child": {
      "label": "Matriz",
      "icon": "fa-kaaba"
    },
    "parent": {
      "label": "Subsidiarias",
      "icon": "fa-project-diagram"
    }
  },
  "Pertenece a Estado": {
    "child": {
      "label": "Estado al que pertenece",
      "icon": "fa-map-marked"
    },
    "parent": {
      "label": "Dependencias del Estado",
      "icon": "fa-landmark"
    }
  },
  "director": {
    "child": {
      "label": "Directores/as",
      "icon": "fa-user-tie"
    },
    "parent": {
      "label": "Director/a de",
      "icon": "fa-user-tie"
    }
  },
  "individual-person-with-significant-control": {
    "child": {
      "label": "Personas con control significativo",
      "icon": "fa-user-tie"
    },
    "parent": {
      "label": "Persona con control significativo de",
      "icon": "fa-user-tie"
    }
  },
  "llp-designated-member": {
    "child": {
      "label": "Integrantes designadas/os de la LLP",
      "icon": "fa-user-tie"
    },
    "parent": {
      "label": "Integrante designada/o de una LLP",
      "icon": "fa-user-tie"
    }
  },
  "llp-member": {
    "child": {
      "label": "Integrantes de la LLP",
      "icon": "fa-user-tie"
    },
    "parent": {
      "label": "Integrante de una LLP",
      "icon": "fa-user-tie"
    }
  },
  "secretary": {
    "child": {
      "label": "Secretarias/os",
      "icon": "fa-user-tie"
    },
    "parent": {
      "label": "Secretaria/o de",
      "icon": "fa-user-tie"
    }
  },
  "Emisor de Acciones": {
    "child": {
      "label": "Cotiza en bolsa",
      "icon": "fa-chart-line"
    },
    "parent": {
      "label": "Empresas emisoras",
      "icon": "fa-chart-line"
    }
  },
  "Consejero de Emisor de Acciones": {
    "child": {
      "label": "Bolsas en las que cotizan",
      "icon": "fa-chart-line"
    },
    "parent": {
      "label": "Consejeras/os de empresas",
      "icon": "fa-user-tie"
    }
  }
}

const type_names = {
  "institutions": {
    "plural": "Instituciones públicas o empresas productivas del estado",
    "plural_short": "Instituciones",
    "singular": "Institución pública o empresa productiva del estado"
  },
  "city": {
    "plural": "Municipios",
    "plural_short": "Municipios",
    "singular": "Municipio"
  },
  "state": {
    "plural": "Estados",
    "plural_short": "Estados",
    "singular": "Estado"
  },
  "company": {
    "plural": "Empresas o asociaciones civiles",
    "plural_short": "Empresas",
    "singular": "Empresa o asociación civil"
  },
  "companies": {
    "plural": "Empresas o asociaciones civiles",
    "plural_short": "Empresas",
    "singular": "Empresa o asociación civil"
  },
  "contract": {
    "plural": "Contratos y compras",
    "plural_short": "Contratos",
    "singular": "Contrato"
  },
  "contracts": {
    "plural": "Contratos y compras",
    "plural_short": "Contratos",
    "singular": "Contrato"
  },
  "persons": {
    "plural": "Personas",
    "plural_short": "Personas",
    "singular": "Persona"
  },
  "person": {
    "plural": "Personas",
    "plural_short": "Personas",
    "singular": "Persona"
  },
  "funder": {
    "plural": "Bancos",
    "plural_short": "Bancos",
    "singular": "Banco"
  },
  "countries": {
    "plural": "Países",
    "plural_short": "Países",
    "singular": "País"
  },
  "areas": {
    "plural": "Países y estados",
    "plural_short": "Regiones",
    "singular": "Región"
  },
  "all": {
    "plural": "Todas",
    "plural_short": "Todas",
    "singular": "Todo"
  },
  "products": {
    "plural": "Productos y medicinas",
    "plural_short": "Productos",
    "singular": "Producto"
  }

}

const subclass_names = {
  "dependencia": "Dependencia",
  "unidad-compradora": "Unidad compradora",
  "state": "Estado",
  "city": "Municipio"
}



module.exports = {
  "qqw_sites": qqw_sites,
  "qqw_routes": qqw_routes,
  "feed_basado": feed_basado,
  "contract_categories_min_max": contract_categories_min_max,
  "party_categories_min_max":party_categories_min_max,
  "flag_categories": flag_categories,
  "flag_details": flag_details,
  "subclass_names": subclass_names,
  "type_names": type_names,
  "role_names": role_names,
  "classification_names": classification_names,
  "classification_icons": classification_icons,
  "govlevel_names": govlevel_names,
  "publisher_logos": publisher_logos,
  "filter_elements": filter_elements,
  "cobranding_sources": cobranding_sources
}
