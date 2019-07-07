<?php get_header() ?>
<?php if(isset($_POST["submitted"])): ?>
	<?php 
		$to = 'rekburek@gmail.com';
		$subject = 'Pitko narudžba';
		$headers = array(
    	"MIME-Version: 1.0",
    	"Content-type: text/html; charset=UTF-8'"
		);
		$success = false;
		$error = false;
		$cart = json_decode(stripslashes($_POST['cart']));
		$total = $_POST['total'];	

		$table = '';
		$thead = '';
		$tfoot = '';

		$cartInfo = '';
		$clientInfo = '';

		$clientInfo = '<div><span>Ime: </span>' . $_POST["fname"] . '</div>
				 <div><span>Prezime: </span>' . $_POST["lname"] . '</div>
				 <div><span>Email: </span>' . $_POST["email"] . '</div>
				 <div><span>Kontakt broj: </span>' . $_POST["contact"] . '</div>
				 <div><span>Ulica i kućni broj: </span>' . $_POST["address"] . '</div>
				 <div><span>Grad: </span>' . $_POST["city"] . '</div>
				 <div><span>Poštanski broj: </span>' . $_POST["zipcode"] . '</div>
				 <div><span>Država: </span>' . $_POST["country"] . '</div>
				 <div><span>Poruka:</span><p style="margin: 0; margin-bottom: 15px">' . $_POST["message"] . '</p></div>';
		// echo '<pre>' , var_dump($cart) , '</pre>';
		
		$thead = '<thead>
					<tr>
						<th></th>
						<th>Pakiranje</th>
						<th>Cijena</th>
						<th>Količina</th>
						<th>Ukupno</th>
					</tr>
				</thead>';

		$tfoot = '<tfoot>
					<tr>
						<td colspan="4"></td>
						<td><strong>' . $total .' kn</strong></td>
					</tr>
				</tfoot>';

		foreach ($cart as $product) {
			$cartInfo .= '<tr>
							<td>' . $product -> name .'</td>
							<td>'.  $product -> pck . ' l</td>
							<td>'.  $product -> price . ' kn</td>
							<td align="center">'.  $product -> qty . '</td>
							<td>'.  $product -> total . ' kn</td>
						  </tr>';
		}

		$msg =  $clientInfo .
				'<table border="1" cellpadding="10" style="border-collapse: collapse;">' .
					$thead .
				'<tbody>' . 
				 	$cartInfo . 
				'</tbody>' .
					$tfoot .
				'</table>';

		// echo $msg;
		if(wp_mail( $to, $subject, $msg, $headers )){
			$success = true;
		}else{
			$error = true;
		}
	?>
<?php endif; ?>

<?php if(have_posts()): ?>
	<?php while ( have_posts() ) : the_post(); 
		$instructions = get_field('instructions');
		$sales_policy = get_field('sales_policy');
		?>
		<?php if(!isset($_POST["submitted"])): ?>
			<div class="container-1400">
				<div class="container-480">
					<?php if($instructions): ?>
						<p><?php echo $instructions; ?></p>
					<?php endif; ?>
					<form id="order-form" action="/nalog" method="POST" novalidate>
						<input name="cart" type="hidden">
						<input name="total" type="hidden">
						<input name="rand" type="hidden">

						<label for="fname">Ime (obavezno)</label>
						<input type="text" name="fname" id="fname" required>

						<label for="lname">Prezime (obavezno)</label>
						<input type="text" name="lname" id="lname" required>

						<label for="email">Email (obavezno)</label>
						<input type="text" name="email" id="email" required>

						<label for="contact">Kontakt broj (obavezno)</label>
						<input type="text" name="contact" id="contact" required>

						<label for="address">Ulica i kućni broj (obavezno)</label>
						<input type="text" name="address" id="address" required>

						<label for="city">Grad (obavezno)</label>
						<input type="text" name="city" id="city" required>

						<label for="zipcode">Poštanski broj (obavezno)</label>
						<input type="text" name="zipcode" id="zipcode" required>

						<label for="country">Država (obavezno)</label>
						<input type="text" name="country" id="country" required>

						<label for="message">Poruka</label>
						<textarea name="message" id="message" rows="5" placeholder="Želiš li nešto posebno naglasiti?"></textarea>

						<?php if($sales_policy): ?>
							<p><?php echo $sales_policy; ?></p>
						<?php endif; ?>

						<div class="consent-container">
							<div class="checkbox">
								<input type="checkbox" name="consent" id="consent" required>
								<div class="input-checked"></div>
							</div>
							<label for="consent">Suglasan/na sam sa <a href="/uvjeti-koristenja" class="link">Uvjetima korištenja</a> te dajem privolu za korištenje osobnih podataka</label>
						</div>

						<div class="center">
							<button type="submit" class="button white large" onclick="submitForm(event)">Kupi</button>
							<input type="hidden" name="submitted">
						</div>
					</form>
				</div>
			</div>
		<?php endif; ?>

		<?php if(isset($_POST["submitted"])): ?>
			<?php if($success): ?>
				<div class="container-1400">
					<div class="mail-checkout">
						<h1>Hvala na narudžbi !</h1>
						<p>Vaša narudžba je poslana na obradu.</p>
						<a href="/" class="button white">Povratak na naslovnicu</a>
					</div>
				</div>
			<?php endif; ?>
			<?php if($error): ?>
				<div class="container-1400">
					<div class="mail-checkout">
						<h1>Dogodila se greška :(</h1>
						<p>Došlo je do pogreške prilikom narudžbe. Prijavite grešku.</p>
						<a href="mailto:pitkoservices@gmail.com" class="button white">Kontakt</a>
					</div>
				</div>
			<?php endif; ?>
		<?php endif; ?>

<?php endwhile; ?>
<?php endif; ?>
<?php get_footer(); ?>