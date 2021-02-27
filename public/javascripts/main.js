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

// $('.easy-search-input-filter').bind('typeahead:select', function(ev, suggestion) {
//   console.log('Selection: ' + suggestion);
//   $(".easy-search-input-filter.tt-input").val(suggestion);
// });

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
  $.post("/send", {
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
  $.post("/send", {
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
  $.post("/send", {
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
    $("#informacion-general").addClass("profile-margin");
    $("#mujeresenlabolsa").addClass("profile-margin");
    $("#variaciones").addClass("profile-margin");
  } else {
    $("#wrap").removeClass("fixed-title");
    // $("#wrap-contract").removeClass("fixed-title-contract");
    $("#currency-contract").css("display", "block");
    $(".first-profile-section").removeClass("profile-margin");
    $(".first-contract-section").removeClass("contract-margin");
    $("#informacion-general").removeClass("profile-margin");
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