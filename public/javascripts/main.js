// Main menu
$('#toggle').click(function() {
  $(this).toggleClass('active');
  $('#overlay').toggleClass('open');
 });

//Tooltips
$('[data-toggle="tooltip"]').tooltip();

// Left sidebar about
$('#left-sidebar').click(function() {
  $('.about-sidebar').toggleClass('open');
});

// Autocomplete Typeahead
var qqw_suggest = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  prefetch: AUTOCOMPLETE_URL,
  remote: {
    url: AUTOCOMPLETE_URL+'/%QUERY',
    wildcard: '%QUERY',
    prepare: function(query, settings){
      let input = $('.easy-search-input').filter(function(){
        return this.value==query
      });
      let autocomplete_parameters = input.data("autocomplete-parameters") || "";
      settings.url = settings.url.replace("%QUERY", query+"?"+autocomplete_parameters)
      // console.log(query, settings, autocomplete_parameters);
      return(settings);
    },
    transform: function(response) {
      // console.log("blood",response.data);
      return response.data.map(function(el) { if(el.classification=="contract") { el.name = el.contracts.title } return el })
      // return response.data;
    }
  }
});

let typeahead_suggestion = function(data){
  let id = data.id;
  let text = data.name;
  return '<a class="suggestion" style="display: block" href="/' + get_classification_url(data.classification) + '/' + id + '">'+text+'</a>';
}

let typeahead_suggestion_filter = function(data){
  let text = data.name;
  let span = '<a style="display: block">' + text + '</a>';
  return span;
}

let typeadhead_config =   {
  hint: true,
  highlight: true,
  minLength: 2
};

//Search
$('.easy-search-input').typeahead(typeadhead_config,
  {
    name: 'qqw',
    display: 'name',
    source: qqw_suggest,
    templates: {
        empty: [
          '<div class="empty-message">',
            'No hay resultados para la búsqueda, pero seguro lo encontrarás.',
          '</div>'
        ].join('\n'),
        suggestion: typeahead_suggestion
      }
    }
  );

$('.easy-search-input-filter').typeahead(typeadhead_config,
  {
    name: 'qqw',
    display: 'name',
    source: qqw_suggest,
    templates: {
        empty: [
          '<div class="empty-message">',
            'Ningún elemento coincide con este término. Prueba de nuevo.',
          '</div>'
        ].join('\n'),
        suggestion: typeahead_suggestion_filter

      }
    }
  );

get_classification_url = function(classification) {
  //TODO: i18n
  switch (classification) {
    case "person": return "es/personas";
    case "funcionario": return "es/personas";
    case "proveedor": return "es/personas";
    case "owner": return "es/personas";
    case "contract": return "es/contratos";
    case "company": return "es/empresas";
    case "banco": return "es/empresas";
    case "institution": return "es/instituciones";
    case "dependencia": return "es/instituciones";
    case "unidad-compradora": return "es/instituciones";
    case "city": return "es/regiones";
    case "municipality": return "es/regiones";
    case "state": return "es/regiones";
    case "country": return "es/regiones";
    case "Medicina": return "es/productos";
    default:
      console.error("get_classification_url: Unknown classification:",classification);
      return false;
  }
}

$(".qqw-home .twitter-typeahead").css("width","100%");

$('.easy-search-input').bind('typeahead:select', function(ev, suggestion) {
  console.log('Selection: ' + suggestion);
  $(".easy-search-input.landing-search-inputtext.tt-input").val(suggestion);
});

$("#first-search").click(function() {
  $('.easy-search-input').trigger("keypress",13);
})


// Copy clipboard
function copyClipboard(id) {
  // var copyText = document.getElementById("pageUrl");
  // copyText.select();
  // document.execCommand("copy");
  // // alert("Copied the text: " + copyText.value);

  const textToCopy = document.getElementById(id).value;
  navigator.clipboard.writeText(textToCopy)
    // .then(() => { alert(`Copied!`) })
    .catch((error) => { alert(`Esta es la dirección para compartir: ${textToCopy}`) })
}

// //Collapsing filters ul
var autocollapse = function (menu,maxHeight) {
  if (autocollapse_moves > 100) { console.error("autocollapse","moves exceeded"); return false; }
  var nav = $(menu);
  var navHeight = nav.innerHeight();

  // console.log("autocollapse",nav,navHeight,autocollapse_moves);

  if (navHeight >= maxHeight && autocollapse_moves < 100) {

      $(menu + ' .more-filters-dropdown').removeClass('d-none');
      $(menu).removeClass('w-auto').addClass("w-100");

      while (navHeight > maxHeight && autocollapse_moves < 100) {
          //  add child to dropdown
          var children = $.merge($(menu +" > li.active").toArray(),nav.children(menu + ' > li:not(:last-child):not(.active)'))
          var count = children.length;
          let movingElement = $(children[count - 1]);
          // console.log("autocollapse moving", autocollapse_moves, movingElement);
          movingElement.prependTo(menu + ' .dropdown-menu-morefilters');
          navHeight = nav.innerHeight();
          autocollapse_moves++;

      }
      $(menu).addClass("w-auto").removeClass('w-100');
      // alert("Hello! I am an alert box if!!");
  }
  else {
    // alert("Hello! I am an alert box else!!");
      // console.log("else",$(menu + ' .dropdown-menu-morefilters').children('li'));
      var collapsed = $(menu + ' .dropdown-menu-morefilters').children('li');

      if (collapsed.length===0) {
        $('.more-filters-dropdown').addClass('d-none');
      }

      while (navHeight < maxHeight && (nav.children(menu + ' > li').length > 0) && collapsed.length > 0 && autocollapse_moves < 100) {
          //  remove child from dropdown
          collapsed = $(menu + ' .dropdown-menu-morefilters').children('li');
          // console.log("autocollapse moving back", autocollapse_moves, collapsed[0]);
          $(collapsed[0]).insertBefore(nav.children(menu + ' > li:last-child'));
          navHeight = nav.innerHeight();
          autocollapse_moves++;
      }

      if (navHeight > maxHeight && autocollapse_moves < 100) {
          autocollapse(menu,maxHeight);
      }

  }
};

let autocollapse_moves = 0;
jQuery(function() {
  // when the page loads
  autocollapse("#filtersList",81);
  // when the window is resized
  $(window).on('resize', function () {
    autocollapse_moves = 0;
    autocollapse("#filtersList",81);
  });
});

$("#moreFilters").on("click", function() {
  // console.log("moreFilters click");
  $(".dropdown-menu-morefilters").toggleClass("d-none");
})

  // Add scrollspy to <body> in perfil
$('body').scrollspy({target: "#right-menu", offset: 200});


// Add smooth scrolling on all links inside the navbar
$("#right-menu a").on('click', function(event) {
  // Make sure this.hash has a value before overriding default behavior
  if (this.hash !== "") {
    // Prevent default anchor click behavior
    event.preventDefault();

    // Store hash
    var hash = this.hash;

    // Using jQuery's animate() method to add smooth page scroll
    // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
    $('html, body').animate({
      scrollTop: $(hash).offset().top - 150
    }, 800, function(){
      console.log("scroll spy animate",$(hash).offset().top)
    });
  }  // End if
});

// Add hash (#) to URL when scrolling
$(window).on('activate.bs.scrollspy', function (e) {
  history.replaceState({}, "", $("a[href^='#']", e.target).attr("href"));
});

// Contact form about/contact.hbs
$("#send_email").click(function (e) {
  var to, name, subjectMail, email, text;
  e.preventDefault();
  // enter your email account that you want to recieve emails at.
  name = $("#name").val();
  subjectMail = $("#subject").val();
  email = $("#contactEmail").val();
  text = $("#message").val();
  // $("#message").text("Sending E-mail...Please wait");
  $.post("/es/enviar", {
      to: to,
      name: name,
      subjectMail: subjectMail,
      email: email,
      message: text,
      type: "contact"
  }, function (data) {
      if (data.status == "sent") {
            console.log("Email sent");
            $("#contactForm").hide()
            $("#thanks-column").show().removeClass("hidden");
      }
      if (data.status == "error") {
            console.log("No email sent");
            alert("Le pedimos disculpas, su correo no se ha podido enviar. Por favor intente de nuevo.")
      }
  },"json").fail(function(error) {
    console.error(error);
  })
  return false;
});

// Send information form send_info_form.hbs
$("#send_info_email").click(function (e) {
  var to, message, source, email;
  e.preventDefault();
  // enter your email account that you want to recieve emails at.
  message = $("#message_info").val();
  source = $("#source_info").val();
  email = $("#email_info").val();
  $.post("/es/enviar", {
      to: to,
      message: message,
      source: source,
      email: email,
      url: document.location.href,
      type: "info"
  }, function (data) {
      if (data.status == "sent") {
            console.log("Email sent");
            $(".addinfo-form").hide()
            $("#thanks-column_info").show().removeClass("hidden");
      }
      if (data.status == "error") {
            console.log("No email sent");
            alert("Le pedimos disculpas, su información no se ha podido enviar. Por favor intente de nuevo.")
      }
  },"json").fail(function(error) {
    console.error(error);
  })
  return false;
});

// Ask for information UC modal-form.hbs
$(".solicitar_info").click(function(e) {
  let value = $(e.currentTarget).parents(".js-ocid").find(".uc-href").attr("href");
  // console.log($(e.currentTarget),$(e.currentTarget).parents(".js-ocid"),$(e.currentTarget).parents(".js-ocid").find(".uc-href"),value);
  $("#uc_id_message").val(value);
})

$("#send_info_uc").click(function (e) {
  var to, name, institution, email;
  e.preventDefault();

  // enter your email account that you want to recieve emails at.
  name = $("#name").val();
  institution = $("#institution").val();
  message = $("#uc_id_message").val();
  email = $("#email").val();
  $.post("/es/enviar", {
      to: to,
      name: name,
      institution: institution,
      email: email,
      message: message,
      url: document.location.href,
      type: "info-uc"
  }, function (data) {
      if (data.status == "sent") {
            console.log("Email sent");
            $(".sendinfo-form").hide()
            $("#thanks-column").show().removeClass("hidden");
      }
      if (data.status == "error") {
            console.log("No email sent");
            alert("Le pedimos discupas, su información no se ha podido enviar. Por favor intente de nuevo.")
      }
  },"json").fail(function(error) {
    console.error(error);
  })
  return false;
});

$(document).on("click",".hide-alert-bar",{},function(e) {
  $(e.target).parent(".alert-bar").fadeOut()
});

//Fixed perfil title
$(window).scroll(function(e) {
    // alert("scroll");
  if ($(this).scrollTop() > 20) {
    $("#wrap").addClass("fixed-title");
    // $("#wrap-contract").addClass("fixed-title-contract");
    $("#currency-contract").css("display", "none");
    $(".first-profile-section").addClass("profile-margin");
    $(".first-contract-section").addClass("contract-margin");
    $("#mujeresenlabolsa").addClass("profile-margin");
    $("#variaciones").addClass("profile-margin");
  } else {
    $("#wrap").removeClass("fixed-title");
    // $("#wrap-contract").removeClass("fixed-title-contract");
    $("#currency-contract").css("display", "block");
    $(".first-profile-section").removeClass("profile-margin");
    $(".first-contract-section").removeClass("contract-margin");
    $("#mujeresenlabolsa").removeClass("profile-margin");
    $("#variaciones").removeClass("profile-margin");
  }

});

//Mujeres pais
//Deshabilitado temporalmente

// $(document).ready( function () {
//     $('#empresas-mujeres-table').DataTable({
//       pageLength: 100,
//       lengthChange: false,
//       language: {
//     "sProcessing":     "Procesando...",
//                 "sLengthMenu":     "Mostrar _MENU_ empresas",
//                 "sZeroRecords":    "No se encontraron empresas",
//                 "sEmptyTable":     "Ningún dato disponible en esta tabla =(",
//                 "sInfo":           "Mostrando _START_ a _END_, de _TOTAL_ empresas",
//                 "sInfoEmpty":      "Mostrando empresas del 0 al 0 de un total de 0 empresas",
//                 "sInfoFiltered":   "(filtrado de un total de _MAX_ empresas)",
//                 "sInfoPostFix":    "",
//                 "sSearch":         "Buscar por nombre:",
//                 "sUrl":            "",
//                 "sInfoThousands":  ",",
//                 "sLoadingRecords": "Cargando...",
//                 "oPaginate": {
//                     "sFirst":    "Primero",
//                     "sLast":     "Último",
//                     "sNext":     "Siguiente",
//                     "sPrevious": "Anterior"
//                 },
//                 "oAria": {
//                     "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
//                     "sSortDescending": ": Activar para ordenar la columna de manera descendente"
//                 },
//                 "buttons": {
//                     "copy": "Copiar",
//                     "colvis": "Visibilidad"
//                 }
//             }
//     });
// } );

$('.filter-dropdown').on('hide.bs.dropdown', function (e) {
  if (e.clickEvent) {
    e.preventDefault();
  }
});


$(document).ready(function () {

  var table = $('#product-states').DataTable({
    "data": testdata.data,
    select: "single",
    "columns": [
      {
        "className": 'details-control',
        "orderable": false,
        "data": null,
        "defaultContent": '',
        "render": function () {
          return '<i class="fa fa-plus-square" aria-hidden="true"></i>';
        },
        width: "15px"
      },
      { "data": "name" },
      { "data": "position" },
      { "data": "office" },
      { "data": "salary" }
    ],
    "order": [[1, 'asc']]
  });

  // Add event listener for opening and closing details
  $('#example tbody').on('click', 'td.details-control', function () {
    var tr = $(this).closest('tr');
    var tdi = tr.find("i.fa");
    var row = table.row(tr);

    if (row.child.isShown()) {
      // This row is already open - close it
      row.child.hide();
      tr.removeClass('shown');
      tdi.first().removeClass('fa-minus-square');
      tdi.first().addClass('fa-plus-square');
    }
    else {
      // Open this row
      row.child(format(row.data())).show();
      tr.addClass('shown');
      tdi.first().removeClass('fa-plus-square');
      tdi.first().addClass('fa-minus-square');
    }
  });

  table.on("user-select", function (e, dt, type, cell, originalEvent) {
    if ($(cell.node()).hasClass("details-control")) {
      e.preventDefault();
    }
  });
});

var testdata = {
  "data": [
    {
      "name": "Tiger Nixon",
      "position": "System Architect",
      "salary": "$320,800",
      "start_date": "2011/04/25",
      "office": "Edinburgh",
      "extn": "5421"
    },
    {
      "name": "Garrett Winters",
      "position": "Accountant",
      "salary": "$170,750",
      "start_date": "2011/07/25",
      "office": "Tokyo",
      "extn": "8422"
    },
    {
      "name": "Ashton Cox",
      "position": "Junior Technical Author",
      "salary": "$86,000",
      "start_date": "2009/01/12",
      "office": "San Francisco",
      "extn": "1562"
    },
    {
      "name": "Cedric Kelly",
      "position": "Senior Javascript Developer",
      "salary": "$433,060",
      "start_date": "2012/03/29",
      "office": "Edinburgh",
      "extn": "6224"
    },
    {
      "name": "Airi Satou",
      "position": "Accountant",
      "salary": "$162,700",
      "start_date": "2008/11/28",
      "office": "Tokyo",
      "extn": "5407"
    },
    {
      "name": "Brielle Williamson",
      "position": "Integration Specialist",
      "salary": "$372,000",
      "start_date": "2012/12/02",
      "office": "New York",
      "extn": "4804"
    },
    {
      "name": "Herrod Chandler",
      "position": "Sales Assistant",
      "salary": "$137,500",
      "start_date": "2012/08/06",
      "office": "San Francisco",
      "extn": "9608"
    },
    {
      "name": "Rhona Davidson",
      "position": "Integration Specialist",
      "salary": "$327,900",
      "start_date": "2010/10/14",
      "office": "Tokyo",
      "extn": "6200"
    },
    {
      "name": "Colleen Hurst",
      "position": "Javascript Developer",
      "salary": "$205,500",
      "start_date": "2009/09/15",
      "office": "San Francisco",
      "extn": "2360"
    },
    {
      "name": "Sonya Frost",
      "position": "Software Engineer",
      "salary": "$103,600",
      "start_date": "2008/12/13",
      "office": "Edinburgh",
      "extn": "1667"
    },
    {
      "name": "Jena Gaines",
      "position": "Office Manager",
      "salary": "$90,560",
      "start_date": "2008/12/19",
      "office": "London",
      "extn": "3814"
    },
    {
      "name": "Quinn Flynn",
      "position": "Support Lead",
      "salary": "$342,000",
      "start_date": "2013/03/03",
      "office": "Edinburgh",
      "extn": "9497"
    },
    {
      "name": "Charde Marshall",
      "position": "Regional Director",
      "salary": "$470,600",
      "start_date": "2008/10/16",
      "office": "San Francisco",
      "extn": "6741"
    },
    {
      "name": "Haley Kennedy",
      "position": "Senior Marketing Designer",
      "salary": "$313,500",
      "start_date": "2012/12/18",
      "office": "London",
      "extn": "3597"
    },
    {
      "name": "Tatyana Fitzpatrick",
      "position": "Regional Director",
      "salary": "$385,750",
      "start_date": "2010/03/17",
      "office": "London",
      "extn": "1965"
    },
    {
      "name": "Michael Silva",
      "position": "Marketing Designer",
      "salary": "$198,500",
      "start_date": "2012/11/27",
      "office": "London",
      "extn": "1581"
    },
    {
      "name": "Paul Byrd",
      "position": "Chief Financial Officer (CFO)",
      "salary": "$725,000",
      "start_date": "2010/06/09",
      "office": "New York",
      "extn": "3059"
    },
    {
      "name": "Gloria Little",
      "position": "Systems Administrator",
      "salary": "$237,500",
      "start_date": "2009/04/10",
      "office": "New York",
      "extn": "1721"
    },
    {
      "name": "Bradley Greer",
      "position": "Software Engineer",
      "salary": "$132,000",
      "start_date": "2012/10/13",
      "office": "London",
      "extn": "2558"
    },
    {
      "name": "Dai Rios",
      "position": "Personnel Lead",
      "salary": "$217,500",
      "start_date": "2012/09/26",
      "office": "Edinburgh",
      "extn": "2290"
    },
    {
      "name": "Jenette Caldwell",
      "position": "Development Lead",
      "salary": "$345,000",
      "start_date": "2011/09/03",
      "office": "New York",
      "extn": "1937"
    },
    {
      "name": "Yuri Berry",
      "position": "Chief Marketing Officer (CMO)",
      "salary": "$675,000",
      "start_date": "2009/06/25",
      "office": "New York",
      "extn": "6154"
    },
    {
      "name": "Caesar Vance",
      "position": "Pre-Sales Support",
      "salary": "$106,450",
      "start_date": "2011/12/12",
      "office": "New York",
      "extn": "8330"
    },
    {
      "name": "Doris Wilder",
      "position": "Sales Assistant",
      "salary": "$85,600",
      "start_date": "2010/09/20",
      "office": "Sidney",
      "extn": "3023"
    },
    {
      "name": "Angelica Ramos",
      "position": "Chief Executive Officer (CEO)",
      "salary": "$1,200,000",
      "start_date": "2009/10/09",
      "office": "London",
      "extn": "5797"
    },
    {
      "name": "Gavin Joyce",
      "position": "Developer",
      "salary": "$92,575",
      "start_date": "2010/12/22",
      "office": "Edinburgh",
      "extn": "8822"
    },
    {
      "name": "Jennifer Chang",
      "position": "Regional Director",
      "salary": "$357,650",
      "start_date": "2010/11/14",
      "office": "Singapore",
      "extn": "9239"
    },
    {
      "name": "Brenden Wagner",
      "position": "Software Engineer",
      "salary": "$206,850",
      "start_date": "2011/06/07",
      "office": "San Francisco",
      "extn": "1314"
    },
    {
      "name": "Fiona Green",
      "position": "Chief Operating Officer (COO)",
      "salary": "$850,000",
      "start_date": "2010/03/11",
      "office": "San Francisco",
      "extn": "2947"
    },
    {
      "name": "Shou Itou",
      "position": "Regional Marketing",
      "salary": "$163,000",
      "start_date": "2011/08/14",
      "office": "Tokyo",
      "extn": "8899"
    },
    {
      "name": "Michelle House",
      "position": "Integration Specialist",
      "salary": "$95,400",
      "start_date": "2011/06/02",
      "office": "Sidney",
      "extn": "2769"
    },
    {
      "name": "Suki Burks",
      "position": "Developer",
      "salary": "$114,500",
      "start_date": "2009/10/22",
      "office": "London",
      "extn": "6832"
    },
    {
      "name": "Prescott Bartlett",
      "position": "Technical Author",
      "salary": "$145,000",
      "start_date": "2011/05/07",
      "office": "London",
      "extn": "3606"
    },
    {
      "name": "Gavin Cortez",
      "position": "Team Leader",
      "salary": "$235,500",
      "start_date": "2008/10/26",
      "office": "San Francisco",
      "extn": "2860"
    },
    {
      "name": "Martena Mccray",
      "position": "Post-Sales support",
      "salary": "$324,050",
      "start_date": "2011/03/09",
      "office": "Edinburgh",
      "extn": "8240"
    },
    {
      "name": "Unity Butler",
      "position": "Marketing Designer",
      "salary": "$85,675",
      "start_date": "2009/12/09",
      "office": "San Francisco",
      "extn": "5384"
    },
    {
      "name": "Howard Hatfield",
      "position": "Office Manager",
      "salary": "$164,500",
      "start_date": "2008/12/16",
      "office": "San Francisco",
      "extn": "7031"
    },
    {
      "name": "Hope Fuentes",
      "position": "Secretary",
      "salary": "$109,850",
      "start_date": "2010/02/12",
      "office": "San Francisco",
      "extn": "6318"
    },
    {
      "name": "Vivian Harrell",
      "position": "Financial Controller",
      "salary": "$452,500",
      "start_date": "2009/02/14",
      "office": "San Francisco",
      "extn": "9422"
    },
    {
      "name": "Timothy Mooney",
      "position": "Office Manager",
      "salary": "$136,200",
      "start_date": "2008/12/11",
      "office": "London",
      "extn": "7580"
    },
    {
      "name": "Jackson Bradshaw",
      "position": "Director",
      "salary": "$645,750",
      "start_date": "2008/09/26",
      "office": "New York",
      "extn": "1042"
    },
    {
      "name": "Olivia Liang",
      "position": "Support Engineer",
      "salary": "$234,500",
      "start_date": "2011/02/03",
      "office": "Singapore",
      "extn": "2120"
    },
    {
      "name": "Bruno Nash",
      "position": "Software Engineer",
      "salary": "$163,500",
      "start_date": "2011/05/03",
      "office": "London",
      "extn": "6222"
    },
    {
      "name": "Sakura Yamamoto",
      "position": "Support Engineer",
      "salary": "$139,575",
      "start_date": "2009/08/19",
      "office": "Tokyo",
      "extn": "9383"
    },
    {
      "name": "Thor Walton",
      "position": "Developer",
      "salary": "$98,540",
      "start_date": "2013/08/11",
      "office": "New York",
      "extn": "8327"
    },
    {
      "name": "Finn Camacho",
      "position": "Support Engineer",
      "salary": "$87,500",
      "start_date": "2009/07/07",
      "office": "San Francisco",
      "extn": "2927"
    },
    {
      "name": "Serge Baldwin",
      "position": "Data Coordinator",
      "salary": "$138,575",
      "start_date": "2012/04/09",
      "office": "Singapore",
      "extn": "8352"
    },
    {
      "name": "Zenaida Frank",
      "position": "Software Engineer",
      "salary": "$125,250",
      "start_date": "2010/01/04",
      "office": "New York",
      "extn": "7439"
    },
    {
      "name": "Zorita Serrano",
      "position": "Software Engineer",
      "salary": "$115,000",
      "start_date": "2012/06/01",
      "office": "San Francisco",
      "extn": "4389"
    },
    {
      "name": "Jennifer Acosta",
      "position": "Junior Javascript Developer",
      "salary": "$75,650",
      "start_date": "2013/02/01",
      "office": "Edinburgh",
      "extn": "3431"
    },
    {
      "name": "Cara Stevens",
      "position": "Sales Assistant",
      "salary": "$145,600",
      "start_date": "2011/12/06",
      "office": "New York",
      "extn": "3990"
    },
    {
      "name": "Hermione Butler",
      "position": "Regional Director",
      "salary": "$356,250",
      "start_date": "2011/03/21",
      "office": "London",
      "extn": "1016"
    },
    {
      "name": "Lael Greer",
      "position": "Systems Administrator",
      "salary": "$103,500",
      "start_date": "2009/02/27",
      "office": "London",
      "extn": "6733"
    },
    {
      "name": "Jonas Alexander",
      "position": "Developer",
      "salary": "$86,500",
      "start_date": "2010/07/14",
      "office": "San Francisco",
      "extn": "8196"
    },
    {
      "name": "Shad Decker",
      "position": "Regional Director",
      "salary": "$183,000",
      "start_date": "2008/11/13",
      "office": "Edinburgh",
      "extn": "6373"
    },
    {
      "name": "Michael Bruce",
      "position": "Javascript Developer",
      "salary": "$183,000",
      "start_date": "2011/06/27",
      "office": "Singapore",
      "extn": "5384"
    },
    {
      "name": "Donna Snider",
      "position": "Customer Support",
      "salary": "$112,000",
      "start_date": "2011/01/25",
      "office": "New York",
      "extn": "4226"
    }
  ]
};