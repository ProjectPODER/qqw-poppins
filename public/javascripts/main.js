// Navbar animations
$(window).scroll(function() {
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
});

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


$('.easy-search-input').typeahead({
  hint: true,
  highlight: true,
  minLength: 2
  }, {
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
          return '<a href="/' + data.type + '/' + data.ocid + '?supplier=' + data.suppliers_org + '"><div>' + data.title + '</div></a>';
        }
        return '<a href="/' + data.type + '/' + data.simple + '"><div>' + data.name + '</div></a>';
      },
      footer: function(data){
        return '<hr><div class="tt-footer"><a href="/persons?filtername=' + data.query + '"' + '>' + 'Buscar personas con '+ '"<b>' + data.query + '</b>"' + '</a></div>' + '<div class="tt-footer orgs"><a href="/orgs?filtername=' + data.query + '"' + '>' + 'Buscar organizaciones con '+ '"<b>' + data.query + '</b>"' + '</a></div>' + '<div class="tt-footer contracts"><a>' + 'Buscar contratos con '+ '"<b>' + data.query + '</b>"' + '</a></div>';
      },
    }
});

$(".twitter-typeahead").css("width","100%");
/*
#scrollable-dropdown-menu .tt-dropdown-menu {
  max-height: 150px;
  overflow-y: auto;
}
*/


// Tooltips
$('[data-toggle="tooltip"]').tooltip({placement: 'right'});

// Right menu Contract page
$('.right-menu-contracts').affix({offset: {top: 280, bottom:950} });

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
     - $('nav.bar').height() 
     - $('footer').height()
   ));
 }
function autoHeightContact() {
   $('div.contact-template').css('min-height', 0);
   $('div.contact-template').css('min-height', (
     $(document).height() 
     - $('nav.bar').height() 
     - $('footer').height()
   ));
 }
 function autoHeightError() {
   $('div.error-template').css('min-height', 0);
   $('div.error-template').css('min-height', (
     $(document).height() 
     - $('nav.bar').height() 
     - $('footer').height()
   ));
 }
 // onDocumentReady function bind
 $(document).ready(function() {
   autoHeight();
   autoHeightContact();
   autoHeightError();
 });

 // onResize bind of the function
 $(window).resize(function() {
   autoHeight();
   autoHeightContact();
   autoHeightError();
 });

// Contact form
var to, name, subjectMail, email, text;
$("#send_email").click(function (e) {
  e.preventDefault();
  // enter your email account that you want to recieve emails at.
  name = $("#name").val();
  subjectMail = $("#subject").val();
  email = $("#contactEmail").val();
  text = $("#text").val();
  // $("#message").text("Sending E-mail...Please wait");
  $.post("/send", {
      to: to,
      name: name,
      subjectMail: subjectMail,
      email: email,
      text: text,
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

