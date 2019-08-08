// Navbar animations
/*$(window).scroll(function() {
    if ($(document).scrollTop() > 500) {
    $('#navbar').addClass('shrink');
  } else {
    $('#navbar').removeClass('shrink');
  }
});

$(window).scroll(function() {
  if ($(document).scrollTop() > 10) {
    $('logo').addClass('shrink');
  } else {
    $('logo').removeClass('shrink');
  }
});*/

// Footer carousel
$('.owl-carousel').owlCarousel({
  // center: true,
  items:1,
  loop:true,
  margin:0,
  dots:false,
  nav:true,
  navText:['<','>'],
  autoplay:true,
  autoplayTimeout:3000,
  autoplayHoverPause:true,
  responsive:{
      1042:{
          items:1
      },
      992:{
          items:1
      },
      300:{
          items:1
      },
      0:{
          items:1
      }
  }
});

//Tooltips
$('[data-toggle="tooltip"]').tooltip({placement: 'top'});

// Autocomplete Typeahead
var qqw_suggest = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  prefetch: AUTOCOMPLETE_URL+"/\"\"",
  remote: {
    url: AUTOCOMPLETE_URL+'/%QUERY',
    wildcard: '%QUERY',
    transform: function(response) {
      console.log("blood",response.data);
      return response.data;
    }
  }
});

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
          'No hay resultados para la búsqueda.',
        '</div>'
      ].join('\n'),
      suggestion: function(data){
        if (data.type == "contracts") {
          return '<a href="/' + data.type + '/' + data.compiledRelease.ocid + '?supplier=' + data.suppliers_org + '"><div>' + data.title + '</div></a>';
        }
        return '<a href="/' + data.type + '/' + data.id + '"><div>' + data.name + '</div></a>';
      },
      footer: function(data){
        return '<hr><div class="tt-footer"><a href="/personas?filtername=' + data.query + '"' + '>' + 'Buscar personas con '+ '"<b>' + data.query + '</b>"' + '</a></div>' + '<div class="tt-footer orgs"><a href="/instituciones-publicas?filtername=' + data.query + '"' + '>' + 'Buscar instituciones con '+ '"<b>' + data.query + '</b>"' + '</a></div>' + '<div class="tt-footer orgs"><a href="/empresas?filtername=' + data.query + '"' + '>' + 'Buscar empresas con '+ '"<b>' + data.query + '</b>"' + '</a></div>' + '<div class="tt-footer contracts"><a>' + 'Buscar contratos con '+ '"<b>' + data.query + '</b>"' + '</a></div>';
      },
    }
  }
);

$(".twitter-typeahead").css("width","100%");


// Tooltips
$('[data-toggle="tooltip"]').tooltip({placement: 'right'});

// Right menu Contract page
// $('.right-menu-contracts').affix({offset: {top: 280, bottom:950} });

$('a.page-scroll').bind('click', function(event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
        scrollTop: ($($anchor.attr('href')).offset().top - 70)
    }, 1250, 'easeInOutExpo');
    event.preventDefault();
});

// Copy clipboard
function copyClipboard() {
  var copyText = document.getElementById("apiUrl");
  copyText.select();
  document.execCommand("copy");
  // alert("Copied the text: " + copyText.value);
}

 // Function to set the height
 function autoHeight() {
   $('div.document-body').css('min-height', 0);
   $('div.document-body').css('min-height', (
     $(document).height()
     - $('footer').height()
   ));
 }

 // onDocumentReady function bind
 $(document).ready(function() {
   autoHeight();
 });

 // onResize bind of the function
 $(window).resize(function() {
   autoHeight();
 });

// Contact form
var to, name, subjectMail, email, text;
$("#send_email").click(function (e) {
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
            alert("Le pedimos discupas, su correo no se ha podido enviar. Por favor intente de nuevo.")
      }
  },"json").fail(function(error) {
    console.error(error);
  })
  return false;
});

// Send information form
var to, message, source, email;
$("#send_info_email").click(function (e) {
  e.preventDefault();
  // enter your email account that you want to recieve emails at.
  message = $("#message").val();
  source = $("#source").val();
  email = $("#email").val();
  $.post("/send", {
      to: to,
      message: message,
      source: source,
      email: email,
      type: "info"
  }, function (data) {
      if (data.status == "sent") {
            console.log("Email sent");
            $(".addinfo-form").hide()
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


$('.delete-blob-filter').click(function(event, instance) {
  let field = $(event.target).parents(".blob").data("field");
  console.log("delete blob filter",field)
  location.search = removeQueryField(field);
  console.log(location.search,field,re);
})

$("#index_length").change(function(){
 var selected = $('#index_length').val();
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

$('#toggle').click(function() {
 $(this).toggleClass('active');
 $('#overlay').toggleClass('open');
});
