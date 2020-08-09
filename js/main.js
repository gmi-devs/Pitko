var module = {};


function incVal(el) {
	var input = el.parentNode.querySelector("input[type='number']");
	var value = parseInt(input.value, 10);
	value = isNaN(value) ? 0 : value;
	if (value >= input.getAttribute("max")) {
		input.value = input.getAttribute("max");
		return;
	}
	input.value = ++value;
}

function decVal(el) {
	var input = el.parentNode.querySelector("input[type='number']");
	var value = parseInt(input.value, 10);
	value = isNaN(value) ? 0 : value;
	if (value <= input.getAttribute("min")) {
		input.value = input.getAttribute("min");
		return;
	}
	input.value = --value;
}

function selectPacking(self){
	$(self).addClass('active').siblings().removeClass('active');
}

function submitForm(event){
	event.preventDefault();
	var form = document.getElementById('order-form')
	var action = form.action;
	var validate = [];
	form['submitted'].value = false;
	$("form#order-form input[required]").each(function(index,input){

		if(input.type === 'text'){
			if(input.value === ''){
				input.classList = 'error';
				validate.push(input);
			} else {
				input.classList.remove('error');
				validate.splice(index, 1)
			}
		}

		if(input.type === 'checkbox'){
			if(!input.checked){
				$(input).parent().addClass('error');
				validate.push(input);
			} else {
				$(input).parent().removeClass('error');
				validate.splice(index, 1);
			}
		}
	});

	form['cart'].value = localStorage.getItem(cart.key);
	form['refund'].value = localStorage.getItem('refund');
	form['total'].value = localStorage.getItem('pitotalprice');
	if(validate.length === 0){
		form['submitted'].value = true;
		form.submit();
	}else {
		var menuBreak = window.matchMedia("(min-width: 1300px)");
		var offset = 0;
		if (!menuBreak.matches) {
			offset = 110;
		} else {
			offset = 40;
		}
		$('html, body').animate({
			scrollTop: $(validate).first().offset().top - offset
		}, 500);
	}
}


function slideToProducts(el, e){
	if($('body').hasClass('home')){
		e.preventDefault();
		if($(el).parents('#cart-overview').length > 0) {
			$("#cart-overview").slideUp(200, function(){		
				$('html, body').animate({
					scrollTop: $("#pive").offset().top
				}, 500)
			});	
		}else {
			$('html, body').animate({
				scrollTop: $("#pive").offset().top
			}, 500)
		}
	}
}

module.navigation = {
	navigationInit: function () {
		var menuBreak = window.matchMedia("(min-width: 768px)");
		this.menuTransform(menuBreak);
		menuBreak.addListener(this.menuTransform);
	},

	menuTransform: function (menuBreak) {
		$("header *").removeAttr('style');
		$(".hamb").removeClass("change").off('click');
		$(".open-cart").off("click");
		if (!menuBreak.matches) {
			module.navigation.menuMobile();
		} else {
			module.navigation.menuDesktop();
		}
	},

	menuDesktop: function () {
		$(".open-cart").click(function(){
			$("#cart-overview").toggle()
		});
	},

	menuMobile: function () {
		var duration = 300;

		$(".hamb").on('click', function(){
			$(this).toggleClass('change')
			$(".pi-menu-container").stop().slideToggle(duration)
			$("#cart-overview").slideUp(duration)
		});

		$(".open-cart").click(function(){
			$("#cart-overview").stop().slideToggle(duration)
			$(".pi-menu-container").slideUp(duration)
			$(".hamb").removeClass('change')
		});
	}
};

module.pitkoSlider = function(){
	$(".pi-slider").wrapInner('<div class="pi-slides"></div>');
	$(".pi-slides .slide").wrap('<div class="pi-slide"></div>');

	var animationSpeed = 300;
	var currentSlide = 1;


	var $slidesContainer = $(".pi-slider .pi-slides");
	var $slide = $slidesContainer.find('.pi-slide');
	var $prev = $('.slider .prev');
	var $next = $('.slider .next');

	var slideWidth = $(".pi-slider").width() / 5;
	var numOfSlides = $slide.length;

	$slide.width(slideWidth);

	$slidesContainer.prepend($slide.clone());
	$slidesContainer.append($slide.clone());

	var totalNumOfSlides = $slidesContainer.find('.pi-slide').length;

	$slide.eq(2).addClass('center');

	$slidesContainer.width(slideWidth * totalNumOfSlides)
	$slidesContainer.css('left', -(slideWidth * numOfSlides));

	function left(){
		if($slidesContainer.is(':animated')) return;

		currentSlide++;

		$('.pi-slide.center').removeClass('center').next().addClass('center');

		$slidesContainer.animate({
			'left': '-=' + slideWidth
		}, animationSpeed, function(){
			if(currentSlide === (numOfSlides + 1)){
				currentSlide = 1;
				$slidesContainer.append($slide.clone());
				$(".pi-slide:nth-child(-n + " + numOfSlides + ")").remove();
				$slidesContainer.css('left', -(slideWidth * numOfSlides));
			}
		});
	}

	function right(){
		if($slidesContainer.is(':animated')) return;

		currentSlide--;

		$('.pi-slide.center').removeClass('center').prev().addClass('center');
		$slidesContainer.animate({
			'left': '+=' + slideWidth
		}, animationSpeed, function(){
			if(currentSlide === -(numOfSlides - 1)){
				currentSlide = 1;
				$slidesContainer.prepend($slide.clone())
				$(".pi-slide:nth-last-child(-n + " + numOfSlides + ")").remove();
				$slidesContainer.css('left', -(slideWidth * numOfSlides));
			}
		});
	}

	$prev.on('click', function(){
		left();
	});
	$next.on('click', function(){
		right();
	});
};

module.slider =  function(){
	var sliderBreak = window.matchMedia("(min-width: 992px)");
	var siema = new Siema();
	var $prev = $('.slider .prev');
	var $next = $('.slider .next');

	sliderBreak.addListener(sliderTransform);

	sliderTransform();

	function sliderTransform(){
		$prev.off('click');
		$next.off('click');
		siema.destroy(true);
		if (!sliderBreak.matches) {
			initSiema();

		} else {
			module.pitkoSlider(); 
			showSlider();
		}
	};

	function initSiema(){
		siema = new Siema({
			loop: true,
			perPage: {
				480: 3,
			},
			onInit: showSlider
		});

		$prev.on('click', function(){
			siema.prev();
		});
		$next.on('click', function(){
			siema.next();
		});
	};

	function showSlider(){
		var $slider = $(".slider-core");
		var sliderHeight = $slider.height();
		$(".slider-container").animate({
			height: sliderHeight
		}, 200, function(){
			$slider.removeClass('init');
			$(this).height('auto');
		});
	}
};


module.accordion = function(){
	$(".accordion .control").on('click', function(){
		if(!$(this).closest('.accordion').find('.answer').is(':animated')){
			$(this).closest('.accordion').toggleClass('active').find('.answer').slideToggle(200);
		}
	});
}

module.cookie = function(){
	if(!getCookie('cnst')){
		createConsent();
	}


	$(".cookie .button").on('click', function(){
		$(this).parent().parent().fadeOut(500, function(){
			setCookie('cnst', 1, 30)
			$(this).remove();
		});
	});


	function createConsent(){
		var consent = 
		'<div class="cookie">\
		<div class="container-1400">\
		<p>Ova stranica koristi kolačiće u svrhu pružanja boljeg korisničkog iskustva. Ukoliko ste suglasni s tim, kliknite na "Slažem se", ukoliko želite saznati više, pogledajte <a href="https://en.wikipedia.org/wiki/HTTP_cookie" target="_blank">Cookies</a>.</p>\
		<button class="button black">Slažem se</button>\
		</div>\
		</div>';
		$(consent).appendTo('body').fadeIn();
	}


	function setCookie(cname,cvalue,exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires=" + d.toGMTString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}

	function getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}
}


$(document).ready(function(){
	module.navigation.navigationInit();
	module.accordion();
	module.cookie();
});

$("#order-form input[required]").focus(function(){
	$(this).removeClass("error")
	$(this).parent().removeClass("error")
});

window.onload = function(){
	if($(".slider").length > 0){
		module.slider();
	}
}
