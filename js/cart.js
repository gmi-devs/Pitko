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
							<span>Dostava + PDV</span>\
							<span class="product-sum">UKUPNO ZA PLATITI</span>\
						</div>\
						<div class="col">\
							<span class="total-refund"></span>\
							<span class="delivery-amount"></span>\
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
  var delivery = document.querySelector('.delivery-amount');
  var items = cart.items;
  var totalPriceAmount = 0;
  var totalRefundAmount = 0;
  var deliveryAmount = 37.5;
  items.forEach(function (item) {
    totalPriceAmount += item.qty * item.price;
    totalRefundAmount += item.qty * 0.5;
  });
  totalPriceAmount = totalPriceAmount + totalRefundAmount + deliveryAmount;
  totalRefund.textContent = totalRefundAmount.toFixed(2) + ' kn';
  delivery.textContent = deliveryAmount.toFixed(2) + ' kn';
  totalPrice.textContent = totalPriceAmount.toFixed(2) + ' kn';
  localStorage.setItem('refund', totalRefundAmount);
  localStorage.setItem('pitotalprice', totalPriceAmount);
}

document.addEventListener('DOMContentLoaded', function () {
  cart.init(); // localStorage.removeItem(cart.key);
  // localStorage.removeItem('pitotalprice');

  buildCart();
});
