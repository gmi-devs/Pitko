"use strict";

var cart = {
  key: 'pitkocart',
  items: [],
  init: function init() {
    var _items = localStorage.getItem(cart.key);

    if (_items) {
      cart.items = JSON.parse(_items);
    } else {
      cart.items = [];
      cart.sync();
    }
  },
  sync: function sync() {
    var _cart = JSON.stringify(cart.items);

    localStorage.setItem(cart.key, _cart);
  },
  find: function find(id) {
    var match = cart.items.filter(function (item) {
      if (item.id == id) {
        return true;
      }
    });

    if (match && match[0]) {
      return match[0];
    }
  },
  add: function add(id, name, imgsrc, pck, price, qty) {
    if (cart.find(id)) {
      cart.inc(id, qty);
    } else {
      var item = {
        id: id,
        name: name,
        img: imgsrc,
        pck: pck,
        price: price,
        qty: qty,
        total: qty * price
      };
      cart.items.push(item);
      cart.sync();
    }
  },
  inc: function inc(id) {
    var qty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    cart.items = cart.items.map(function (item) {
      if (item.id === id) item.qty = item.qty + qty;
      item.total = cart.productTotalPrice(item.qty, item.price);
      return item;
    });
    cart.sync();
  },
  dec: function dec(id) {
    var qty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    cart.items = cart.items.map(function (item) {
      if (item.id === id) {
        if (item.qty === 1) return item;
        item.qty = item.qty - qty;
        item.total = cart.productTotalPrice(item.qty, item.price);
      }

      return item;
    });
    cart.sync();
  },
  productTotalPrice: function productTotalPrice(qty, price) {
    return qty * price;
  },
  remove: function remove(id) {
    cart.items = cart.items.filter(function (item) {
      if (item.id !== id) return true;
    });
    cart.sync();
  },
  empty: function empty() {
    cart.items = [];
    cart.sync();
  }
};

function addItem(self) {
  var itemContainer = self.parentNode.parentNode;
  var id = self.dataset.id;
  var name = self.dataset.name;
  var imgsrc = self.dataset.imgsrc;
  var pck = itemContainer.querySelector('.packing .active').dataset.pck;
  var price = parseFloat(itemContainer.querySelector('.packing .active').dataset.price);
  var qty = parseInt(itemContainer.querySelector('.quantity input').value);
  var outputId = constructId(id, pck);
  cart.add(outputId, name, imgsrc, pck, price, qty);
  buildCart();
}

function constructId(id, pck) {
  var regex = /[.,\s]/g;
  pck = pck.replace(regex, '');
  return parseInt(id + pck);
}

function buildCart() {
  var cartOverview = document.querySelector('.cart-overview');
  var cartIcons = document.querySelectorAll('.cart-icon');
  cartOverview.innerHTML = '';
  var items = cart.items;

  if (items.length) {
    var title = document.createElement('h2');
    title.textContent = 'SADRŽAJ KOŠARICE';
    cartOverview.appendChild(title);
    removeCartIndicator(cartIcons);
    setTimeout(function () {
      addCartIndicator(cartIcons);
    }, 100);
  } else {
    var message = '<div class="empty-cart">\
						<p>Tvoja košarica je prazna!</p>\
						<div><a href="/#pive" onclick="slideToProducts(this, event)"><button class="button black">Odaberi pitko</button></a><div>\
						</div>';
    cartOverview.innerHTML = message;
    removeCartIndicator(cartIcons);
  }

  items.forEach(function (item) {
    var product = document.createElement('div');
    product.className = 'product';
    var img = new Image();
    img.src = item.img;
    product.appendChild(img);
    var controls = document.createElement('div');
    controls.className = 'controls';
    product.appendChild(controls);
    var minus = document.createElement('span');
    minus.textContent = '-';
    minus.setAttribute('data-id', item.id);
    controls.appendChild(minus);
    minus.addEventListener('click', decrementCart);
    var qty = document.createElement('span');
    qty.className = 'qty';
    qty.textContent = item.qty;
    controls.appendChild(qty);
    var plus = document.createElement('span');
    plus.textContent = '+';
    plus.setAttribute('data-id', item.id);
    controls.appendChild(plus);
    plus.addEventListener('click', incrementCart);
    product.appendChild(controls);
    var packing = document.createElement('span');
    packing.className = 'packing';
    packing.textContent = item.pck + ' l';
    product.appendChild(packing);
    var price = document.createElement('span');
    price.className = 'price';
    price.textContent = item.total.toFixed(2) + ' kn';
    product.appendChild(price);
    var removeItem = document.createElement('button');
    removeItem.className = 'remove';
    removeItem.textContent = 'Obriši';
    removeItem.setAttribute('data-id', item.id);
    product.appendChild(removeItem);
    removeItem.addEventListener('click', removeCartItem);
    cartOverview.appendChild(product);
  });

  if (items.length) {
    var summary = document.createElement('div');
    summary.className = 'cart-summary';
    var summaryInner = '\
					<div class="pricing-container">\
						<div class="col">\
							<span>Povratna naknada</span>\
							<span class="product-sum">UKUPNO ZA PLATITI</span>\
						</div>\
						<div class="col">\
							<span class="total-refund"></span>\
							<span class="product-sum total-price"></span>\
						</div>\
					</div>\
					<div class="controls"><a href="/#pive" onclick="slideToProducts(this, event)" class="button white wborder">Nastavi kupovinu</a><a href="/nalog" class="button black order">Naruči</a></div>\
					<div class="delivery">Cijena dostave po paketu iznosi 30,00kn&nbsp;+&nbsp;PDV. <br/> Dostavu plaća primatelj prilikom preuzimanja paketa. <br/> Pakete šaljemo dostavnom službom <a class="link-black" href="https://www.dpd.com/hr/home/produkti_i_usluge" target="blank">DPD Croatia.</a></div>\
					<div class="min-order">Minimalan broj za narudžbu je 12 piva.</div>';
    summary.innerHTML = summaryInner;
    cartOverview.appendChild(summary);
    numberOfProducts();
    updateTotalPrice();
  }
}

function numberOfProducts() {
  var orderBtn = document.querySelector('.cart-summary .order');
  var items = cart.items;
  var numberOfProducts = 0;
  items.forEach(function (item) {
    numberOfProducts += item.qty;
  });

  if (numberOfProducts >= 12) {
    orderBtn.classList.remove('disabled');
  } else {
    orderBtn.classList.add('disabled');
  }
}

function addCartIndicator(cartIcons) {
  cartIcons.forEach(function (icon) {
    icon.classList.add('indicate');
  });
}

function removeCartIndicator(cartIcons) {
  cartIcons.forEach(function (icon) {
    icon.classList.remove('indicate');
  });
}

function incrementCart(ev) {
  ev.preventDefault();
  var id = parseInt(ev.target.getAttribute('data-id'));
  cart.inc(id, 1);
  var controls = ev.target.parentElement;
  var qty = controls.querySelector('.qty');
  var product = ev.target.parentElement.parentElement;
  var price = product.querySelector('.price');
  var item = cart.find(id);

  if (item) {
    qty.textContent = item.qty;
    price.textContent = item.total.toFixed(2) + ' kn';
  }

  updateTotalPrice();
  numberOfProducts();
}

function decrementCart(ev) {
  ev.preventDefault();
  var id = parseInt(ev.target.getAttribute('data-id'));
  cart.dec(id, 1);
  var controls = ev.target.parentElement;
  var qty = controls.querySelector('.qty');
  var product = ev.target.parentElement.parentElement;
  var price = product.querySelector('.price');
  var item = cart.find(id);

  if (item) {
    qty.textContent = item.qty;
    price.textContent = item.total.toFixed(2) + ' kn';
  }

  updateTotalPrice();
  numberOfProducts();
}

function removeCartItem(ev) {
  ev.preventDefault();
  var id = parseInt(ev.target.getAttribute('data-id'));
  cart.remove(id);
  var product = ev.target.parentElement;
  product.parentNode.removeChild(product);
  buildCart();
}

function updateTotalPrice() {
  var totalPrice = document.querySelector('.total-price');
  var totalRefund = document.querySelector('.total-refund');
  var items = cart.items;
  var totalPriceAmount = 0;
  var totalRefundAmount = 0;
  items.forEach(function (item) {
    totalPriceAmount += item.qty * item.price;
    totalRefundAmount += item.qty * 0.5;
  });
  totalRefund.textContent = totalRefundAmount.toFixed(2) + ' kn';
  totalPrice.textContent = totalPriceAmount.toFixed(2) + ' kn';
  localStorage.setItem('pitotalprice', totalPriceAmount);
}

document.addEventListener('DOMContentLoaded', function () {
  cart.init(); // localStorage.removeItem(cart.key);
  // localStorage.removeItem('pitotalprice');

  buildCart();
});

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
			if(!$(".pi-menu-container").is(':animated')){
				$(this).toggleClass('change')
				$(".pi-menu-container").slideToggle(duration)
				$("#cart-overview").slideUp(duration)
			}
		});

		$(".open-cart").click(function(){
			$("#cart-overview").slideToggle(duration)
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
		<p>Ova stranica koristi kolačiće u svrhe pružanja boljeg korisničkog iskustva. Ukoliko ste suglasni s tim, kliknite na "Slažem se", ukoliko želite saznati više o kolačićima, pogledajte <a href="/uvjeti-koristenja">uvjete korištenja</a>.</p>\
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
