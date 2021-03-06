<?php 

function pi_hide_editor() {

	if(isset($_GET['post'])){

		$post_id = $_GET['post'];

		if($post_id == 32){ 
			remove_post_type_support('page', 'editor');
		}

		if($post_id == 7){ 
			remove_post_type_support('page', 'editor');
		}

		if($post_id == 9){ 
			remove_post_type_support('page', 'editor');
		}

		if($post_id == 239){ 
			remove_post_type_support('page', 'editor');
		}
	}
}
add_action( 'init', 'pi_hide_editor' );

remove_action( 'wp_head', 'print_emoji_detection_script', 7 );

function pi_deregister_scripts(){
  wp_deregister_script( 'wp-embed' );
}
add_action( 'wp_footer', 'pi_deregister_scripts' );


function pi_resources(){

	wp_enqueue_style( 'style-css', get_template_directory_uri() . '/dist/css/appstyle.min.css' );

	wp_enqueue_script( 'jquery-js', get_theme_file_uri( 'dist/js/jquery.min.js' ), null, null , true);

	if( is_front_page()){
		wp_enqueue_script( 'slider-js', get_theme_file_uri( '/js/vendor/siema.min.js' ), null, null , true );
	}

	wp_enqueue_script( 'app-js', get_theme_file_uri( 'dist/js/app.min.js' ), null, null , true );
	// wp_enqueue_script( 'app-js', get_theme_file_uri( 'js/built.js' ), null, null , true );

	if (in_array($_SERVER['REMOTE_ADDR'], array('127.0.0.1', '::1'))) {
		  wp_register_script('livereload', 'http://localhost:35729/livereload.js', null, null, true);
		  wp_enqueue_script('livereload');
	}
}

add_action('wp_enqueue_scripts', 'pi_resources');


function add_meta_tags() {
?>
  	<meta property="og:title" content="Pitko" />
	<meta property="og:type" content="website" />
	<meta property="og:description" content="<?php echo bloginfo("description") ?>">
	<meta property="og:url" content="http://pitomacka-pivovara.hr/" />
	<meta property="og:image" content="http://pitomacka-pivovara.hr/wp-content/uploads/2020/05/PitkoShowcaseOG.png" />
<?php }
add_action('wp_head', 'add_meta_tags');


function pi_register_nav() {
	register_nav_menus( array(
		'header' => 'Header',
		'footer' => 'Footer',
	) );
}
add_action( 'after_setup_theme', 'pi_register_nav' );


function pi_add_custom_menu_item ( $items, $args ) {
	if( $args->theme_location == 'header' ) 
	{
		$items_array = array();
		while ( false !== ( $item_pos = strpos ( $items, '<li', 3 ) ) )
		{
			$items_array[] = substr($items, 0, $item_pos);
			$items = substr($items, $item_pos);
		}
		$items_array[] = $items;
		array_splice($items_array, 2, 0, '<li><a href="/" class="logo"><img src="'.get_template_directory_uri().'/img/logo.svg" alt="logo"></img></a></li>'); 

		$items = implode('', $items_array);
	}
	return $items;
}
add_filter( 'wp_nav_menu_items', 'pi_add_custom_menu_item', 10, 2);


function pi_create_cpt() {
	register_post_type( 'pive',
		array(
			'labels' => array(
				'name' => __( 'Pive' ),
				'singular_name' => __( 'Pivo' )
			),
			'public' => true,
		)
	);
	register_post_type( 'lokacije',
		array(
			'labels' => array(
				'name' => __( 'Lokacije' ),
				'singular_name' => __( 'Lokacija' )
			),
			'public' => true,
		)
	);
	register_post_type( 'q&a',
		array(
			'labels' => array(
				'name' => __( '	Q&A' ),
				'singular_name' => __( 'Q&A' )
			),
			'public' => true,
		)
	);
}
add_action( 'init', 'pi_create_cpt' );


add_theme_support( 'post-thumbnails'); 


add_image_size( 'introduction', 678, 502, true);
add_image_size( 'slider', 155);
add_image_size( 'ornament', 390, 390, true);
add_image_size( 'post-preview', 436, 307, true);
add_image_size( 'teaser', 1920, 515, true);
add_image_size( 'cart', 30);

// error_log('-------------Log---------------');

// function pi_wp_mail_failed($wp_error) 
// {
//     return error_log(print_r($wp_error, true));
// }
// add_action('wp_mail_failed', 'pi_wp_mail_failed', 10, 1);

// function pi_wp_mail_content_type(){
//     return "text/html";
// }
// add_filter( 'wp_mail_content_type','pi_wp_mail_content_type' );