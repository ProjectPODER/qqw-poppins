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
