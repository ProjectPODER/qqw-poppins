$(document)
  .ready(function() {

    // fix menu when passed
    $('.masthead')
      .visibility({
        once: false,
        onBottomPassed: function() {
          $('.fixed.menu').transition('fade in');
        },
        onBottomPassedReverse: function() {
          $('.fixed.menu').transition('fade out');
        }
      });

    // create sidebar and attach to menu open
    $('.ui.sidebar')
      .sidebar('attach events', '.toc.item')
    ;

    $('#context1 .menu .item')
      .tab({
        // special keyword works same as above
        context: 'parent'
      });

    // Mostrar y ocultar Side menu
    $(window).scroll(function() {
        if ($(this).scrollTop() > 250) {
            $(".side-menu").stop().animate({
                opacity: 1
            }, 100);
        } else {
            $(".side-menu").stop().animate({
                opacity: 0
            }, 100);
        }
    })

  // Add scrollspy to <body>
    $('body').scrollspy({target: ".side-menu", offset: 150});   

    // Add smooth scrolling on all links inside the navbar
    $(".side-menu a").on('click', function(event) {
      // Make sure this.hash has a value before overriding default behavior
      if (this.hash !== "") {
        // Prevent default anchor click behavior
        event.preventDefault();

        // Store hash
        var hash = this.hash;

        // Using jQuery's animate() method to add smooth page scroll
        // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
        $('html, body').animate({
          scrollTop: $(hash).offset().top -70
        }, 800, function(){
     
        });
      }  // End if
        // Add hash (#) to URL when done scrolling (default click behavior)
        // window.location.hash = hash;
    });
    // Add hash (#) to URL when scrolling
    $(window).on('activate.bs.scrollspy', function (e) {
      history.replaceState({}, "", $("a[href^='#']", e.target).attr("href"));
    });

//Send email
  $("#send_email").click(function (e) {
  var email, to, subject, text;
    e.preventDefault();
    // enter your email account that you want to recieve emails at.
    name = $("#name").val();
    email = $("#email").val();
    text = $("#text").val();
    // $("#message").text("Sending E-mail...Please wait");
    $.post("/send", {
        to: to,
        name: name,
        email: email,
        text: text
    }, function (data) {
        if (data == "sent") {
              console.log("Email sent");
              $("#form-column").hide()
              $("#thanks-column").show().removeClass("hidden");
        }
        else {
          alert("Disculpe, no se pudo enviar su mensaje. Por favor vuelva a intentarlo.");
        }
    },"text")
    .fail(error=> { alert("Disculpe, no se pudo enviar su mensaje. Por favor vuelva a intentarlo.");})
    return false;
  });
});
