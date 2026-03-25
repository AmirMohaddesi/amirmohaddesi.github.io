/** 
 * ===================================================================
 * main js
 *
 * ------------------------------------------------------------------- 
 */ 

(function($) {

	"use strict";

	/*---------------------------------------------------- */
	/* Preloader
	------------------------------------------------------ */ 
   $(window).load(function() {

      // will first fade out the loading animation 
    	$("#loader").fadeOut("slow", function(){

        // will fade out the whole DIV that covers the website.
        $("#preloader").delay(300).fadeOut("slow", function () {
        	schedulePortfolioNavSync();
        });

      });       

  	})


  	/*---------------------------------------------------- */
  	/* FitText Settings
  	------------------------------------------------------ */
  	setTimeout(function() {

   	$('#intro h1').fitText(1, { minFontSize: '28px', maxFontSize: '76px' });

  	}, 100);


	/*---------------------------------------------------- */
	/* FitVids
	------------------------------------------------------ */ 
  	$(".fluid-video-wrapper").fitVids();


	/*---------------------------------------------------- */
	/* Owl Carousel
	------------------------------------------------------ */ 
	$("#owl-slider").owlCarousel({
        navigation: false,
        pagination: true,
        itemsCustom : [
	        [0, 1],
	        [700, 2],
	        [960, 3]
	     ],
        navigationText: false
    });


	/*----------------------------------------------------- */
	/* Alert Boxes
  	------------------------------------------------------- */
	$('.alert-box').on('click', '.close', function() {
	  $(this).parent().fadeOut(500);
	});	


	/*----------------------------------------------------- */
	/* Stat Counter
  	------------------------------------------------------- */
   var statSection = $("#stats"),
       stats = $(".stat-count");

   statSection.waypoint({

   	handler: function(direction) {

      	if (direction === "down") {       		

			   stats.each(function () {
				   var $this = $(this);

				   $({ Counter: 0 }).animate({ Counter: $this.text() }, {
				   	duration: 4000,
				   	easing: 'swing',
				   	step: function (curValue) {
				      	$this.text(Math.ceil(curValue));
				    	}
				  	});
				});

       	} 

       	// trigger once only
       	this.destroy();      	

		},
			
		offset: "90%"
	
	});	


	/*---------------------------------------------------- */
	/*	Masonry
	------------------------------------------------------ */
	var containerProjects = $('#folio-wrapper');

	containerProjects.imagesLoaded( function() {

		containerProjects.masonry( {		  
		  	itemSelector: '.folio-item',
		  	resize: true 
		});

	});


	/*----------------------------------------------------*/
	/*	Modal Popup
	------------------------------------------------------*/
   $('.item-wrap a').magnificPopup({

      type:'inline',
      fixedContentPos: false,
      removalDelay: 300,
      showCloseBtn: false,
      mainClass: 'mfp-fade'

   });

   $(document).on('click', '.popup-modal-dismiss', function (e) {
   	e.preventDefault();
   	$.magnificPopup.close();
   });

	
	/*-----------------------------------------------------*/
  	/* Navigation Menu (legacy Kards theme — not used on this site)
   ------------------------------------------------------ */  
   var toggleButton = $('.menu-toggle'),
       nav = $('.main-navigation');

   if (toggleButton.length && nav.length) {
	   toggleButton.on('click', function(e) {
			e.preventDefault();
			toggleButton.toggleClass('is-clicked');
			nav.slideToggle();
		});

	   nav.find('li a').on("click", function() {
			toggleButton.toggleClass('is-clicked');
			nav.fadeOut();
		});
   }


   /*---------------------------------------------------- */
  	/* Scrollspy: sidebar + mobile drawer stay in sync
  	------------------------------------------------------ */
	/* Keep in sync with #main-content > section[id] anchors */
	var PORTFOLIO_SECTION_IDS = ['intro', 'hf-space', 'about', 'resume', 'contact'];

	function portfolioNavLinks() {
		return $('#main-nav-wrap li a, #siteNav .site-nav__links li a');
	}

	function portfolioMobileNavHeight() {
		var bar = document.getElementById('mobileNavBar');
		if (!bar) return 0;
		var st = window.getComputedStyle(bar);
		if (st.display === 'none') return 0;
		return Math.round(bar.getBoundingClientRect().height) || 0;
	}

	function portfolioScrollspyThreshold() {
		var navH = portfolioMobileNavHeight();
		var vh = window.innerHeight || 600;
		if (navH > 0) return navH + 18;
		return Math.max(80, Math.round(vh * 0.28));
	}

	function portfolioActiveSectionId() {
		var sections = document.querySelectorAll('#main-content > section[id]');
		if (!sections.length) return 'intro';

		var docEl = document.documentElement;
		var docH = Math.max(
			document.body.scrollHeight,
			docEl.scrollHeight,
			docEl.clientHeight
		);
		if (window.scrollY + window.innerHeight >= docH - 10) {
			return sections[sections.length - 1].id;
		}

		var threshold = portfolioScrollspyThreshold();
		var activeId = sections[0].id;
		for (var i = 0; i < sections.length; i++) {
			if (sections[i].getBoundingClientRect().top <= threshold) {
				activeId = sections[i].id;
			}
		}
		return activeId;
	}

	function setPortfolioNavCurrent(sectionId) {
		if (!sectionId) return;
		if (sectionId === 'top') sectionId = 'intro';
		if (PORTFOLIO_SECTION_IDS.indexOf(sectionId) === -1) return;
		var $links = portfolioNavLinks();
		$links.parent().removeClass('current');
		$links.filter('[href="#' + sectionId + '"]').parent().addClass('current');
	}

	var portfolioNavScrollQueued = false;
	function schedulePortfolioNavSync() {
		if (portfolioNavScrollQueued) return;
		portfolioNavScrollQueued = true;
		window.requestAnimationFrame(function () {
			portfolioNavScrollQueued = false;
			setPortfolioNavCurrent(portfolioActiveSectionId());
		});
	}

	$(function syncPortfolioNavOnReady() {
		setPortfolioNavCurrent(portfolioActiveSectionId());
	});

	$(window).on('scroll.portfolioNav resize.portfolioNav load.portfolioNav', schedulePortfolioNavSync);
	window.addEventListener('hashchange', schedulePortfolioNavSync);


	/*---------------------------------------------------- */
  	/* Smooth Scrolling
  	------------------------------------------------------ */
  	$('.smoothscroll').on('click', function (e) {
	 	
	 	e.preventDefault();

   	var target = this.hash,
    	$target = $(target);

		if (!$target.length) {
			return;
		}

		var sid = target.replace(/^#/, '');
		if (sid === 'top') setPortfolioNavCurrent('intro');
		else if (PORTFOLIO_SECTION_IDS.indexOf(sid) !== -1) setPortfolioNavCurrent(sid);

		var $navBar = $('#mobileNavBar');
		var navH = ($navBar.length && $navBar.is(':visible')) ? $navBar.outerHeight() : 0;
		var scrollTop = Math.max(0, $target.offset().top - navH + 2);

    	$('html, body').stop().animate({
       	'scrollTop': scrollTop
      }, 800, 'swing', function () {
      	window.location.hash = target;
      	schedulePortfolioNavSync();
      });

  	});  
  

   /*---------------------------------------------------- */
	/*  Placeholder Plugin Settings
	------------------------------------------------------ */ 
	$('input, textarea, select').placeholder()  


  	/*---------------------------------------------------- */
	/*	contact form
	------------------------------------------------------ */

	/* local validation */
	$('#contactForm').validate({

		/* submit via ajax */
		submitHandler: function(form) {

			var sLoader = $('#submit-loader');

			$.ajax({      	

		      type: "POST",
		      url: "inc/sendEmail.php",
		      data: $(form).serialize(),
		      beforeSend: function() { 

		      	sLoader.fadeIn(); 

		      },
		      success: function(msg) {

	            // Message was sent
	            if (msg == 'OK') {
	            	sLoader.fadeOut(); 
	               $('#message-warning').hide();
	               $('#contactForm').fadeOut();
	               $('#message-success').fadeIn();   
	            }
	            // There was an error
	            else {
	            	sLoader.fadeOut(); 
	               $('#message-warning').html(msg);
		            $('#message-warning').fadeIn();
	            }

		      },
		      error: function() {

		      	sLoader.fadeOut(); 
		      	$('#message-warning').html("Something went wrong. Please try again.");
		         $('#message-warning').fadeIn();

		      }

	      });     		
  		}

	});


 	/*----------------------------------------------------- */
  	/* Back to top
   ------------------------------------------------------- */ 
	var pxShow = 300; // height on which the button will show
	var fadeInTime = 400; // how slow/fast you want the button to show
	var fadeOutTime = 400; // how slow/fast you want the button to hide
	var scrollSpeed = 300; // how slow/fast you want the button to scroll to top. can be a value, 'slow', 'normal' or 'fast'

   // Show or hide the sticky footer button
	jQuery(window).scroll(function() {

		if (!( $("#header-search").hasClass('is-visible'))) {

			if (jQuery(window).scrollTop() >= pxShow) {
				jQuery("#go-top").fadeIn(fadeInTime);
			} else {
				jQuery("#go-top").fadeOut(fadeOutTime);
			}

		}		

	});		

	/*-----------------------------------------------------*/
	/* Portfolio chrome: sticky nav drawer + Hugging Face chat
	 * Runs after DOM ready; vanilla DOM for toggles (no plugin deps).
	 *-----------------------------------------------------*/
	var PORTFOLIO_MOBILE_NAV_W = 768;
	var PORTFOLIO_CHAT_POPUP_W = 480;
	var PORTFOLIO_HF_URL = 'https://amixxm-career-conversation.hf.space?embed=true';

	$(function initPortfolioChrome() {
		var launcher = document.getElementById('chatLauncher');
		var widget = document.getElementById('chatWidget');
		var closeBtn = document.getElementById('closeChat');
		var popBtn = document.getElementById('openNewWindow');
		var popupTrigger = document.getElementById('open-popup');

		var navToggle = document.getElementById('mobileNavToggle');
		var siteNav = document.getElementById('siteNav');
		var navLinks = siteNav ? siteNav.querySelectorAll('a') : [];

		function openChatWidget() {
			if (!widget) return;
			widget.classList.add('is-visible');
			widget.setAttribute('aria-hidden', 'false');
		}

		function closeChatWidget() {
			if (!widget) return;
			widget.classList.remove('is-visible');
			widget.setAttribute('aria-hidden', 'true');
		}

		function openChatPopup(e) {
			if (e) e.preventDefault();
			var w = 420, h = 720;
			var y = Math.max(0, (window.outerHeight - h) / 2);
			var x = Math.max(0, (window.outerWidth - w) / 2);
			window.open(
				PORTFOLIO_HF_URL,
				'hf_assistant',
				'popup=yes,width=' + w + ',height=' + h + ',left=' + x + ',top=' + y + ',resizable=yes,scrollbars=yes'
			);
		}

		function closeMobileNav() {
			if (!siteNav || !navToggle) return;
			siteNav.classList.remove('is-open');
			navToggle.classList.remove('is-open');
			navToggle.setAttribute('aria-expanded', 'false');
			document.body.classList.remove('nav-open');
		}

		function toggleMobileNav() {
			if (!siteNav || !navToggle) return;
			var isOpen = siteNav.classList.toggle('is-open');
			navToggle.classList.toggle('is-open', isOpen);
			navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
			document.body.classList.toggle('nav-open', isOpen);
		}

		if (navToggle && siteNav) {
			navToggle.addEventListener('click', function (e) {
				e.preventDefault();
				e.stopPropagation();
				toggleMobileNav();
			});

			Array.prototype.forEach.call(navLinks, function (link) {
				link.addEventListener('click', function () {
					if (window.innerWidth <= PORTFOLIO_MOBILE_NAV_W) {
						closeMobileNav();
					}
				});
			});

			window.addEventListener('resize', function () {
				if (window.innerWidth > PORTFOLIO_MOBILE_NAV_W) {
					closeMobileNav();
				}
			});
		}

		if (launcher) {
			launcher.addEventListener('click', function () {
				if (window.innerWidth <= PORTFOLIO_CHAT_POPUP_W) {
					openChatPopup();
				} else {
					openChatWidget();
				}
			});
		}

		if (closeBtn) closeBtn.addEventListener('click', closeChatWidget);
		if (popBtn) popBtn.addEventListener('click', openChatPopup);
		if (popupTrigger) popupTrigger.addEventListener('click', openChatPopup);

		document.addEventListener('click', function (ev) {
			if (widget && launcher && widget.classList.contains('is-visible')) {
				if (!widget.contains(ev.target) && ev.target !== launcher) {
					var rect = widget.getBoundingClientRect();
					var lRect = launcher.getBoundingClientRect();
					var nearLauncher = ev.clientX >= lRect.left && ev.clientX <= lRect.right &&
						ev.clientY >= lRect.top && ev.clientY <= lRect.bottom;
					if (!nearLauncher &&
						(ev.clientX < rect.left || ev.clientX > rect.right || ev.clientY < rect.top || ev.clientY > rect.bottom)) {
						closeChatWidget();
					}
				}
			}

			if (siteNav && navToggle && window.innerWidth <= PORTFOLIO_MOBILE_NAV_W) {
				var clickedInsideNav = siteNav.contains(ev.target);
				var clickedToggle = navToggle.contains(ev.target);
				if (siteNav.classList.contains('is-open') && !clickedInsideNav && !clickedToggle) {
					closeMobileNav();
				}
			}
		});

		document.addEventListener('keydown', function (ev) {
			if (ev.key === 'Escape') {
				closeChatWidget();
				closeMobileNav();
			}
		});
	});

})(jQuery);