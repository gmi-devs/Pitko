<?php get_header() ?>
<?php while ( have_posts() ) : the_post(); ?>
	<div class="container-1400 contact">
		<div class="container-680">
			<h1><?php the_title(); ?></h1>
			<?php
			$subtitle = get_field('subtitle');
			$company_name = get_field('company_name');
			$street = get_field('street');
			$place = get_field('place');
			$phone = get_field('phone');
			$oib = get_field('oib');
			$mb = get_field('mb');
			$mail = get_field('mail');
			$year = get_field('year');
			?>
			<?php if($subtitle): ?>
				<div class="subtitle">
					<?php echo $subtitle; ?>
				</div>
			<?php endif; ?>
			<?php if($company_name): ?>
				<h2 class="h3"><?php echo $company_name; ?></h2>
			<?php endif; ?>
			<div class="info-container">
				<div class="left">
					<?php if($street): ?>
						<div class="info-item street">
							<?php echo $street; ?>
						</div>
					<?php endif; ?>
					<?php if($place): ?>
						<div class="info-item place">
							<?php echo $place; ?>
						</div>
					<?php endif; ?>
					<?php if($phone): ?>
						<div class="info-item phone">
							<span class="desc">Mobitel:</span><a href="tel:<?php echo $phone; ?>"><?php echo $phone; ?></a>
						</div>
					<?php endif; ?>
				</div>
				<div class="right">
					<?php if($oib): ?>
						<div class="info-item oib">
							<span class="desc">OIB:</span><span><?php echo $oib; ?></span>
						</div>
					<?php endif; ?>
					<?php if($mb): ?>
						<div class="info-item mb">
							<span class="desc">MB:</span><span><?php echo $mb; ?></span>
						</div>
					<?php endif; ?>
					<?php if($year): ?>
						<div class="info-item year">
							<span class="desc">Godina osnivanja:</span><span><?php echo $year; ?></span>
						</div>
					<?php endif ?>
					<?php if($mail): ?>
						<div class="info-item mail">
							<span class="desc">Mail:</span><a href="mailto:<?php echo $mail; ?>"><?php echo $mail; ?></a>
						</div>
					<?php endif; ?>
				</div>
			</div>
		</div>
	</div>
	<div id="map">
			
	</div>
	<?php
	$icon = get_template_directory_uri()."/img/lokacija.png";
	$location = get_field('map');
	 ?>
<?php endwhile; ?>
<script type="text/javascript">
	var icon = "<?php echo $icon; ?>";
	var lat = parseFloat("<?php echo $location['lat'] ?>");
	var lng = parseFloat("<?php echo $location['lng'] ?>");
	var map;
	var marker;
	function initMap() {
		map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: lat, lng: lng},
			zoom: 10,
			styles: 
			[{"featureType":"all","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"administrative.country","elementType":"labels.text.fill","stylers":[{"color":"#838383"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#c4c4c4"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#aaaaaa"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21},{"visibility":"on"}]},{"featureType":"poi.business","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#6e6e6e"},{"lightness":"0"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#6e6e6e"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#575757"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"labels.text.stroke","stylers":[{"color":"#2c2c2c"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#999999"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}]
		});

		marker = new google.maps.Marker({
			position: new google.maps.LatLng(lat, lng),
			map: map,
			icon: icon
		});
	}
</script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCQUh6EJ27vfpzaWjOBj3kNg1pZmD5I-Jw&callback=initMap" async defer></script>
<?php get_footer(); ?>