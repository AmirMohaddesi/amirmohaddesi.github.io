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
	$(function () {
		$("#loader").fadeOut("slow", function () {
			$("#preloader").delay(300).fadeOut("slow", function () {
				schedulePortfolioNavSync();
			});
		});
	});


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
	/* Stat Counter (unused on this site — waypoint disabled to avoid scroll timing overlap)
  	------------------------------------------------------- */
	/* var statSection = $("#stats"),
		stats = $(".stat-count");
	statSection.waypoint({ ... }); */


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

	
   /*---------------------------------------------------- */
  	/* Portfolio nav: single source menu + scrollspy + smooth scroll
  	------------------------------------------------------ */
	var portfolioNavInitialized = false;
	var PORTFOLIO_MOBILE_NAV_W = 768;
	var portfolioNavIds = [];
	var portfolioNavTicking = false;

	function portfolioAllNavLinks() {
		return $('#main-nav-wrap a, #mobile-nav-wrap a');
	}

	function portfolioMobileNavHeight() {
		var bar = document.getElementById('mobileNavBar');
		if (!bar || window.getComputedStyle(bar).display === 'none') return 0;
		return Math.round(bar.getBoundingClientRect().height) || 0;
	}

	function closePortfolioMobileNav() {
		var siteNav = document.getElementById('siteNav');
		var navToggle = document.getElementById('mobileNavToggle');
		if (!siteNav || !navToggle) return;
		siteNav.classList.remove('is-open');
		navToggle.classList.remove('is-open');
		navToggle.setAttribute('aria-expanded', 'false');
		document.body.classList.remove('nav-open');
	}

	function portfolioSetCurrentNav(sectionId) {
		if (!sectionId) return;
		if (sectionId === 'top') sectionId = 'intro';
		if (portfolioNavIds.indexOf(sectionId) === -1) return;
		var $links = portfolioAllNavLinks();
		$links.parent().removeClass('current');
		$links.filter('[href="#' + sectionId + '"]').parent().addClass('current');
	}

	function portfolioActiveSectionId() {
		var sections = document.querySelectorAll('#main-content > section[id]');
		if (!sections.length) return 'intro';

		var scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
		var viewportH = window.innerHeight || document.documentElement.clientHeight || 0;

		// Use a probe line near the top of the viewport so Demo stays active before About.
		var probe = 80;

		var activeId = sections[0].id;

		for (var i = 0; i < sections.length; i++) {
			var rect = sections[i].getBoundingClientRect();
			var top = rect.top;

			if (top <= probe) {
				activeId = sections[i].id;
			} else {
				break;
			}
		}

		var doc = document.documentElement;
		var docH = Math.max(
			document.body.scrollHeight,
			doc.scrollHeight,
			document.body.offsetHeight,
			doc.offsetHeight,
			doc.clientHeight
		);

		if (scrollY + viewportH >= docH - 24) {
			activeId = sections[sections.length - 1].id;
		}

		return activeId;
	}

	function schedulePortfolioNavSync() {
		if (portfolioNavTicking) return;
		portfolioNavTicking = true;
		window.requestAnimationFrame(function () {
			portfolioNavTicking = false;
			// console.log('active section:', portfolioActiveSectionId());
			portfolioSetCurrentNav(portfolioActiveSectionId());
		});
	}

	function initPortfolioNavigation() {
		if (portfolioNavInitialized) return;

		var desktopNav = document.getElementById('main-nav-wrap');
		var mobileNav = document.getElementById('mobile-nav-wrap');
		var navToggle = document.getElementById('mobileNavToggle');
		var siteNav = document.getElementById('siteNav');
		if (!desktopNav || !mobileNav || !siteNav || !navToggle) return;

		portfolioNavInitialized = true;

		// Single source of truth: clone desktop <ul> into mobile drawer (no duplicate markup).
		mobileNav.innerHTML = '';
		var desktopClone = desktopNav.cloneNode(true);
		desktopClone.removeAttribute('id');
		while (desktopClone.firstChild) {
			mobileNav.appendChild(desktopClone.firstChild);
		}
		portfolioNavIds = [];
		Array.prototype.forEach.call(desktopNav.querySelectorAll('a[href^="#"]'), function (link) {
			var id = link.getAttribute('href').replace(/^#/, '');
			if (id && portfolioNavIds.indexOf(id) === -1) portfolioNavIds.push(id);
		});

		navToggle.addEventListener('click', function (e) {
			e.preventDefault();
			e.stopPropagation();
			var isOpen = siteNav.classList.toggle('is-open');
			navToggle.classList.toggle('is-open', isOpen);
			navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
			document.body.classList.toggle('nav-open', isOpen);
		});

		window.addEventListener('resize', function () {
			if (window.innerWidth > PORTFOLIO_MOBILE_NAV_W) closePortfolioMobileNav();
			schedulePortfolioNavSync();
		});

		document.addEventListener('click', function (ev) {
			if (window.innerWidth > PORTFOLIO_MOBILE_NAV_W) return;
			var clickedInsideNav = siteNav.contains(ev.target);
			var clickedToggle = navToggle.contains(ev.target);
			if (siteNav.classList.contains('is-open') && !clickedInsideNav && !clickedToggle) {
				closePortfolioMobileNav();
			}
		});

		window.addEventListener('hashchange', schedulePortfolioNavSync);
		$(window).off('.portfolioNav').on('scroll.portfolioNav resize.portfolioNav', schedulePortfolioNavSync);
		schedulePortfolioNavSync();
	}

	$(document).on('click', 'a.smoothscroll', function (e) {
		var target = this.hash;
		if (!target) return;

		var $target = $(target);
		if (!$target.length) return;

		e.preventDefault();
		portfolioSetCurrentNav(target.replace(/^#/, ''));

		var mobileOffset = portfolioMobileNavHeight();
		var desktopOffset = 12;
		var offset = mobileOffset > 0 ? mobileOffset + 6 : desktopOffset;
		var scrollTop = Math.max(0, $target.offset().top - offset);
		$('html, body').stop().animate({ scrollTop: scrollTop }, 800, 'swing', function () {
			window.location.hash = target;
			schedulePortfolioNavSync();
		});

		if (window.innerWidth <= PORTFOLIO_MOBILE_NAV_W) closePortfolioMobileNav();
	});

	$(document).ready(initPortfolioNavigation);
  

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
	var PORTFOLIO_CHAT_POPUP_W = 480;
	var PORTFOLIO_HF_URL = 'https://amixxm-career-conversation.hf.space?embed=true';

	$(function initPortfolioChrome() {
		var launcher = document.getElementById('chatLauncher');
		var widget = document.getElementById('chatWidget');
		var closeBtn = document.getElementById('closeChat');
		var popBtn = document.getElementById('openNewWindow');
		var popupTrigger = document.getElementById('open-popup');

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

		});

		document.addEventListener('keydown', function (ev) {
			if (ev.key === 'Escape') {
				closeChatWidget();
				closePortfolioMobileNav();
			}
		});
	});

})(jQuery);