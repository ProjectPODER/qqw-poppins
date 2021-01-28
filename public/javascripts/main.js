// Main menu
$('#toggle').click(function() {
  $(this).toggleClass('active');
  $('#overlay').toggleClass('open');
 });

//Tooltips
$('[data-toggle="tooltip"]').tooltip(
);

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
      console.log(query, settings, autocomplete_parameters);
      return(settings);
    },
    transform: function(response) {
      console.log("blood",response.data);
      return response.data;
    }
  }
});

// const emptyFooter = '<hr><div class="tt-footer"><a href="/personas">Buscar personas</a></div>' +
// '<div class="tt-footer orgs"><a href="/instituciones-publicas">Buscar instituciones</a></div>' +
// '<div class="tt-footer orgs"><a href="/empresas">Buscar empresas</a></div>' +
// '<div class="tt-footer contracts"><a href="/contratos">Buscar contratos </a></div>';

//Search
$('.easy-search-input').typeahead(
  {
    hint: true,
    highlight: true,
    minLength: 2
  },
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
      suggestion: function(data){
        let type = data.type;
        if (type == "organizations") {
          type = data.classification;
        }
        let id = data.id;
        let text = data.name || data.contracts.title;
        return '<a class="suggestion" href="/' + get_type_url(type) + '/' + id + '"><div>' + text + '</div></a>';
      },
    }
  }
);

get_type_url = function(type) {
  //TODO: i18n
  switch(type) {
    case "institutions": return "instituciones-publicas";
    case "institution": return "instituciones-publicas";
    case "municipality": return "instituciones-publicas";
    case "state": return "instituciones-publicas";
    case "company": return "empresas";
    case "companies": return "empresas";
    case "contract": return "contratos";
    case "contracts": return "contratos";
    case "persons": return "personas";
    case "person": return "personas";
    case "funder": return "instituciones-publicas";
    case "countries": return "paises";
    default: console.log("get_type_url",type); return "unknown";
  }
}



$(".twitter-typeahead").css("width","100%");

// $('.easy-search-input').keypress(function(e) {
//   var keycode = (e.keyCode ? e.keyCode : e.which);
//   // console.log("esi keypress", keycode)
//   if (keycode == 13 || keycode === undefined) {
//     e.preventDefault();
//     console.log("esi keypress 13",$(".easy-search-input.landing-search-inputtext.tt-input").val(),$("a.suggestion:contains('"+$(".easy-search-input.landing-search-inputtext.tt-input").val()+"')"))
//     const newLocation = $("a.suggestion:contains('"+$(".easy-search-input.landing-search-inputtext.tt-input").val()+"')").attr("href");
//     if (newLocation) {
//       location.href= newLocation;
//     }
//     else {
//       alert("Por favor ingrese un término y seleccione una opción.")
//     }
//   }
// })

$('.easy-search-input').bind('typeahead:select', function(ev, suggestion) {
  console.log('Selection: ' + suggestion);
  $(".easy-search-input.landing-search-inputtext.tt-input").val(suggestion);
});


$("#first-search").click(function() {
  $('.easy-search-input').trigger("keypress",13);
})

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
          var children = nav.children(menu + ' > li:not(:last-child)');
          var count = children.length;
          // console.log("autocollapse moving", autocollapse_moves, $(children[count - 1]));
          $(children[count - 1]).prependTo(menu + ' .dropdown-menu-morefilters');
          navHeight = nav.innerHeight();
          autocollapse_moves++;

      }
      $(menu).addClass("w-auto").removeClass('w-100');
      // alert("Hello! I am an alert box if!!");
  }
  else {
    // alert("Hello! I am an alert box else!!");
      var collapsed = $(menu + ' .dropdown-menu-morefilters').children(menu + ' > li');
    
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
  autocollapse("#filtersList",80); 
  // when the window is resized
  $(window).on('resize', function () {
    autocollapse_moves = 0;
    autocollapse("#filtersList",80); 
  });
});

  // Add scrollspy to <body> in Contract perfil
$('body').scrollspy({target: "#right-menu", offset: 250});

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
      scrollTop: $(hash).offset().top - 300
    }, 800, function(){
    });
  }  // End if
});

// Add hash (#) to URL when scrolling
$(window).on('activate.bs.scrollspy', function (e) {
  history.replaceState({}, "", $("a[href^='#']", e.target).attr("href"));
});

// Copy clipboard
function copyClipboard() {
  var copyText = document.getElementById("apiUrl");
  copyText.select();
  document.execCommand("copy");
}
function copyClipboard() {
  var copyText = document.getElementById("pageUrl");
  copyText.select();
  document.execCommand("copy");
}

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

//** FILTERS **//

//Type filter
$(".dropdown-menu").on("click","button.filter-dropdown-item", function(e) {
  let collection = $(e.currentTarget).data("collection");

  location.search= removeQueryField("collection") + "&collection="+collection;
  console.log(location.search);
})

//set amount and count filters
$('.bucket').click(function(event) {
  const item = $(event.target).parent(".bucket");
  const bucketName = $(item).data("bucketName")
  const bucketType = $(item).data("bucketType")
  const bucketId = bucketName + "-" + bucketType;
  let bucketData;

  // Si ya estaba seleccionado, borrar
  if (item.hasClass("selected")) {
    item.removeClass("selected");
    bucketData = ["",""]
  }
  else {
    bucketData = $(item).data("bucket").split("-");
    item.parent().find(".bucket").removeClass("selected");
    item.addClass("selected");
  }
  console.log(bucketId,bucketData,$("#minimo-"+bucketId));
  $("#minimo-"+bucketId).val(bucketData[0]);
  $("#maximo-"+bucketId).val(bucketData[1]);
});

//Hilight selected option for amount filters
let dataFilter = "";
$(".search-amount").each(function(i,element) {
  if (dataFilter == "") {
  dataFilter = element.value + "-";
  }
  else {
    dataFilter += element.value;
    $(".bucket[data-bucket="+dataFilter+"]").addClass("selected");
    dataFilter = "";
  }
})

//set bool filters
$(".bool-filter").click(function(e) {
  const target = $(e.currentTarget);
  const realFieldId = target.data("realFieldId")
  const realField = $("#"+realFieldId);
  const realFieldValue = realField.val();

  if (realFieldValue == "true") {
    realField.val("false");
  }
  else {
    realField.val("true");
  }
  // console.log(target.data(),realFieldId,realField);
})

$('.delete-blob-filter').click(function(event, instance) {
  let field = $(event.target).parents(".blob").data("field");
  console.log("delete blob filter",field)
  location.search = removeQueryField(field);
  console.log(location.search,field,re);
})

$('.supplier-list-toggle,.profile-list-toggle').click(function(event, instance) {
  let parent = $(event.target).parents(".js-suppliers,.profile-list");
  // console.log("supplier toggle",parent);
  parent.find(".supplier-hidden,.profile-list-hidden").toggle();
})


$("#indexLength").change(function(){
 var selected = $('#indexLength').val();
    location.search= removeQueryField("size") + "&size="+selected;
});

//TODO: we need better management of URL parameters
function removeQueryField(field) {
  re = new RegExp('([\?&])' + field+"=[^&]*([&#]*)");
  return location.search.replace(re,"$1$2")
}


$(document).on("click",".hide-alert-bar",{},function(e) {
  $(e.target).parent(".alert-bar").fadeOut()
});

// Advance filters
$('.filters-link-sm').click(function() {
  $('.advance-filters').toggleClass('open');
});

//Fixed perfil title
$(window).scroll(function(e) {
    // alert("scroll");
  if ($(this).scrollTop() > 20) {
    $("#wrap").addClass("fixed-title");
    $("#wrap-contract").addClass("fixed-title-contract");
    $("#currency-contract").css("display", "none");
    $(".contract_detail").addClass("contract-margin");
    $("#informacion-general").addClass("profile-margin");
    $("#mujeresenlabolsa").addClass("profile-margin");
    $("#variaciones").addClass("profile-margin");
  } else {
    $("#wrap").removeClass("fixed-title");
    $("#wrap-contract").removeClass("fixed-title-contract");
    $("#currency-contract").css("display", "block");
    $(".contract_detail").removeClass("contract-margin");
    $("#informacion-general").removeClass("profile-margin");
    $("#mujeresenlabolsa").removeClass("profile-margin");
    $("#variaciones").removeClass("profile-margin");
  }

});

//Mujeres pais
$(document).ready( function () {
    $('#empresas-mujeres-table').DataTable({
      pageLength: 100,
      lengthChange: false,
      language: {
    "sProcessing":     "Procesando...",
                "sLengthMenu":     "Mostrar _MENU_ empresas",
                "sZeroRecords":    "No se encontraron empresas",
                "sEmptyTable":     "Ningún dato disponible en esta tabla =(",
                "sInfo":           "Mostrando _START_ a _END_, de _TOTAL_ empresas",
                "sInfoEmpty":      "Mostrando empresas del 0 al 0 de un total de 0 empresas",
                "sInfoFiltered":   "(filtrado de un total de _MAX_ empresas)",
                "sInfoPostFix":    "",
                "sSearch":         "Buscar por nombre:",
                "sUrl":            "",
                "sInfoThousands":  ",",
                "sLoadingRecords": "Cargando...",
                "oPaginate": {
                    "sFirst":    "Primero",
                    "sLast":     "Último",
                    "sNext":     "Siguiente",
                    "sPrevious": "Anterior"
                },
                "oAria": {
                    "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                },
                "buttons": {
                    "copy": "Copiar",
                    "colvis": "Visibilidad"
                }
            }
    });
} );

