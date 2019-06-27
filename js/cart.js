const cart = {
	key: 'pitkocart',
	items: [],

	init(){
		let _items = localStorage.getItem(cart.key);
		if(_items){
			cart.items = JSON.parse(_items);
		}else{
			cart.items = [];
			cart.sync();
		}
	},
	sync(){
		let _cart = JSON.stringify(cart.items);
		localStorage.setItem(cart.key, _cart);
	},
	find(id){
		let match = cart.items.filter(item =>{
			if(item.id == id){
				return true;
			}
		});
		if(match && match[0]){
			return match[0];
		}

	},
	add(id, name, imgsrc, pck, price, qty){
		if(cart.find(id)){
			cart.inc(id, qty);
		}else{
			let item = {
				id: id,
				name: name,
				img: imgsrc,
				pck: pck,
				price: price,
				qty: qty,
				total: qty * price
			}
			cart.items.push(item);
			cart.sync();
		}
	},
	inc(id, qty=1){
		cart.items = cart.items.map(item =>{
			if(item.id === id)
				item.qty = item.qty + qty;
				item.total = cart.productTotalPrice(item.qty, item.price);
			return item;
		});
		cart.sync()
	},
	dec(id, qty=1){
		cart.items = cart.items.map(item =>{
			if(item.id === id){
				if(item.qty === 1) return item;
				item.qty = item.qty - qty;
				item.total = cart.productTotalPrice(item.qty, item.price);
			}
			return item;
		});
		cart.sync()
	},
	productTotalPrice(qty, price){
		return qty*price;
	},
	remove(id){
		cart.items = cart.items.filter(item=>{
			if(item.id !== id)
				return true;
		});
		cart.sync();
	},
	empty(){
		cart.items = [];
		cart.sync();
	}
}

function addItem(self){

	let itemContainer = self.parentNode.parentNode;

	let id = self.dataset.id;

	let name = self.dataset.name;

	let imgsrc = self.dataset.imgsrc;

	let pck = itemContainer.querySelector('.packing .active').dataset.pck;

	let price = parseFloat(itemContainer.querySelector('.packing .active').dataset.price);

	let qty = parseInt(itemContainer.querySelector('.quantity input').value);

	let outputId = constructId(id, pck);

	cart.add(outputId, name, imgsrc, pck, price, qty);

	buildCart();
	
}

function constructId(id, pck){

	let regex = /[.,\s]/g;

	pck = pck.replace(regex, '');

	return parseInt(id + pck);

}


function buildCart(){
	let cartOverview = document.querySelector('.cart-overview');
	let cartIcons = document.querySelectorAll('.cart-icon');
	cartOverview.innerHTML = '';
	let items = cart.items;

	if(items.length){
		let title = document.createElement('h2')
		title.textContent = 'SADRŽAJ KOŠARICE';
		cartOverview.appendChild(title);

		removeCartIndicator(cartIcons);

		setTimeout(function(){
			addCartIndicator(cartIcons); 
		}, 100);

	}else{
		let message = '<div class="empty-cart">\
						<p>Tvoja košarica je prazna!</p>\
						<div><a href="/#pive" onclick="slideToProducts(event)"><button class="button black">Odaberi pitko</button></a><div>\
						</div>';
		cartOverview.innerHTML = message;

		removeCartIndicator(cartIcons);
	}

	items.forEach(item =>{
		let product = document.createElement('div');
		product.className = 'product';

		let img = new Image();
		img.src = item.img;
		product.appendChild(img);

		let controls = document.createElement('div');
		controls.className = 'controls';
		product. appendChild(controls);

		let minus = document.createElement('span');
		minus.textContent = '-';
		minus.setAttribute('data-id', item.id);
		controls.appendChild(minus);
		minus.addEventListener('click', decrementCart);


		let qty = document.createElement('span');
		qty.className = 'qty';
		qty.textContent = item.qty;
		controls.appendChild(qty);

		let plus = document.createElement('span');
		plus.textContent = '+';
		plus.setAttribute('data-id', item.id);
		controls.appendChild(plus);
		plus.addEventListener('click', incrementCart);

		product.appendChild(controls)

		let packing = document.createElement('span');
		packing.className = 'packing';
		packing.textContent = item.pck + ' l';
		product.appendChild(packing);

		let price = document.createElement('span');
		price.className = 'price';
		price.textContent = item.total.toFixed(2) + ' kn';
		product.appendChild(price);

		let removeItem = document.createElement('button');
		removeItem.className = 'remove';
		removeItem.textContent = 'Obriši';
		removeItem.setAttribute('data-id', item.id);
		product.appendChild(removeItem);
		removeItem.addEventListener('click', removeCartItem);

		cartOverview.appendChild(product);
	});

	if(items.length){
		let summary = document.createElement('div');
		summary.className = 'cart-summary';
		let summaryInner = '\
					<!--<div class="product-sum"><span>Ukupna cijena piva</span><span>30,00 kn</span></div>-->\
					<!--<div class="delivery"><span>Dostava</span><span>20,00 kn</span></div>-->\
					<div class="total"><span>UKUPNO ZA PLATITI</span><span class="total-price"></span></div>\
					<div class="controls"><a href="/#pive" class="button white wborder" onclick="slideToProducts(event)">Nastavi kupovinu</a><a href="/nalog" class="button black order">Naruči</a></div>\
					<p>Minimalan broj za narudžbu je šest piva.!</p>';

		summary.innerHTML = summaryInner;
		cartOverview.appendChild(summary);
		numberOfProducts();
		updateTotalPrice();
	}
}


function numberOfProducts(){
	let orderBtn = document.querySelector('.cart-summary .order');
	let items = cart.items;
	let numberOfProducts = 0;
	items.forEach(item=>{
		numberOfProducts += item.qty;
	});
	if(numberOfProducts >= 6){
		orderBtn.classList.remove('disabled');
	}else {
		orderBtn.classList.add('disabled');
	}
}

function addCartIndicator(cartIcons){
	cartIcons.forEach(icon =>{
		icon.classList.add('indicate');
	});
}

function removeCartIndicator(cartIcons){
	cartIcons.forEach(icon =>{
		icon.classList.remove('indicate');
	});
}

function incrementCart(ev){
	ev.preventDefault();
	let id = parseInt(ev.target.getAttribute('data-id'));
	cart.inc(id, 1);
	let controls = ev.target.parentElement;
	let qty = controls.querySelector('.qty');
	let product = ev.target.parentElement.parentElement;
	let price = product.querySelector('.price');

	let item = cart.find(id);
	if(item){
		qty.textContent = item.qty;
		price.textContent = item.total.toFixed(2) + ' kn';
	}
	updateTotalPrice();
	numberOfProducts();
}

function decrementCart(ev){
	ev.preventDefault();
	let id = parseInt(ev.target.getAttribute('data-id'));
	cart.dec(id, 1);
	let controls = ev.target.parentElement;
	let qty = controls.querySelector('.qty');
	let product = ev.target.parentElement.parentElement;
	let price = product.querySelector('.price');
	let item = cart.find(id);
	if(item){
		qty.textContent = item.qty;
		price.textContent = item.total.toFixed(2) + ' kn';
	}
	updateTotalPrice();
	numberOfProducts();
}

function removeCartItem(ev){
	ev.preventDefault();
	let id = parseInt(ev.target.getAttribute('data-id'));
	cart.remove(id);
	let product = ev.target.parentElement;
	product.parentNode.removeChild(product);
	buildCart();
}

function updateTotalPrice(){
	let total = document.querySelector('.total-price');
	let items = cart.items;
	let totalPrice = 0;
	items.forEach(item=>{
		totalPrice += item.qty * item.price
	});
	total.textContent = (totalPrice).toFixed(2) + ' kn';
	localStorage.setItem('pitotalprice', totalPrice);
}

document.addEventListener('DOMContentLoaded', () =>{
	cart.init()
	// localStorage.removeItem(cart.key);
	// localStorage.removeItem('pitotalprice');
	buildCart();
});