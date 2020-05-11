<?php get_header() ?>
<?php while ( have_posts() ) : the_post(); ?>
	<div class="container-1400">
		<div class="container-680">
			<h1><?php the_title(); ?></h1>
			<?php $subtitle = get_field('subtitle'); ?>
			<?php if($subtitle): ?>
				<h2 class="subtitle"><?php echo $subtitle ?></h2>
			<?php endif; ?>
		</div>
	</div>
	<div id="map">
	</div>

	<?php 
	$args = array( 'post_type' => 'lokacije', 'posts_per_page' => -1);
	$query = new WP_Query( $args ); 
	if ( $query->have_posts() ) : 
		$data = array();
		while ( $query->have_posts() ) : $query->the_post(); 
			$lokacija = get_field('name');
			$adresa = get_field('address');
			$phone = get_field('phone');
			$lat = get_field('lat');
			$lng = get_field('lng');
			array_push($data, array(
				'name' => $lokacija,
				'address' => $adresa,
				'phone' => $phone,
				'lat' => $lat,
				'lng' => $lng
			));
		endwhile;	
	endif;

	$icon = get_template_directory_uri()."/img/lokacija.png";
	$lokacije = json_encode($data);
	$cluster = get_template_directory_uri()."/img/cluster/";
	?>
	<?php endwhile; ?>
	<script src="<?php echo get_template_directory_uri() ?>/js/vendor/markerclusterer.js"></script>
	<script type="text/javascript">
		var icon = "<?php echo $icon; ?>";
		var cluster = "<?php echo $cluster; ?>"
		var locations = <?php echo $lokacije; ?>;
		var map;
		var marker;
		var markers = [];
		function initMap() {
			map = new google.maps.Map(document.getElementById('map'), {
				center: {lat: 45.9501, lng: 17.2327},
				zoom: 10,
				minZoom: 5,
				styles: 
				[{"featureType":"all","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"administrative.country","elementType":"labels.text.fill","stylers":[{"color":"#838383"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#c4c4c4"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#aaaaaa"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21},{"visibility":"on"}]},{"featureType":"poi.business","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#6e6e6e"},{"lightness":"0"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#6e6e6e"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#575757"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"labels.text.stroke","stylers":[{"color":"#2c2c2c"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#999999"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}]
			});

			for (var i = 0; i < locations.length; i++) {

				marker = new google.maps.Marker({
					position: new google.maps.LatLng(locations[i]['lat'], locations[i]['lng']),
					map: map,
					icon: icon
				});
				addInfoWindow(marker, infoWindow(locations[i]['name'], locations[i]['address'], locations[i]['phone']))
				markers.push(marker);
			}
			var options = {
				imagePath: cluster
			};
			var markerCluster = new MarkerClusterer(map, markers,  {
				styles: [{
					url: cluster + '1.png',
					height: 66,
					width: 66,
					textColor: '#fff',
					textSize: 20,
				}, {
					url: cluster + '2.png',
					height: 66,
					width: 66,
					textColor: '#fff',
					textSize: 20,
				}, {
					url: cluster + '3.png',
					height: 66,
					width: 66,
					textColor: '#fff',
					textSize: 20,
				}, {
					url: cluster + '4.png',
					height: 66,
					width: 66,
					textColor: '#fff',
					textSize: 20,
				}, {
					url: cluster + '5.png',
					height: 66,
					width: 66,
					textColor: '#fff',
					textSize: 20,
				}]
			});
		}

		function addInfoWindow(marker, info) {

			var infoWindow = new google.maps.InfoWindow({
				content: info
			});

			google.maps.event.addListener(marker, 'click', function () {
				infoWindow.open(map, marker);
			});
		}

		function infoWindow(name, address, phone){
			var infoWindow = '<div class="info-window"><div class="name">' + name + '</div><div class="address">' + address + '</div><a href="tel:' + phone + '"class="phone">' + phone + '</a></div>';
			return infoWindow;
		}
	</script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCpb_aZifFN87XR5dbINh5pZyNTBxmt0Ig&callback=initMap" async defer></script>

<?php get_footer(); ?>