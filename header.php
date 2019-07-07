<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width">
	<link rel="shortcut icon" type="image/png" href="<?php echo get_template_directory_uri()?>/img/fav-48x48.png"/>
	<title><?php bloginfo('name') ?></title>
	<?php wp_head(); ?>
	<style id="fonts">
		@font-face {
			font-family: 'Raleway-Regular';
			src: url("<?php echo get_template_directory_uri() ?>/fonts/rale/Raleway-Regular.ttf");
		}
		@font-face {
            font-family: 'Raleway-Bold';
			src: url("<?php echo get_template_directory_uri() ?>/fonts/rale/Raleway-Bold.ttf");
        }
		@font-face {
            font-family: 'Tamaki-1';
			src: url("<?php echo get_template_directory_uri() ?>/fonts/tam/Tamaki-1.otf");
        }
	</style>
</head>
<body <?php body_class(); ?>>
	<div class="bg"></div>
	<header>
		<div class="header-inner">
			<div class="hamb">
				<div class="line"></div>
				<div class="line"></div>
				<div class="line"></div>
			</div>
			<a href="/" class="logo"><img src="<?php echo get_template_directory_uri()?>/img/logo.svg" alt="logo-mobile"></a>
			<div class="cart-icon" onclick="toggleCart(event)"><?php get_template_part( 'partials/svg/cart.svg', 'cart' ) ?></div>
			<div class="pi-menu-container">
				<?php wp_nav_menu(array('theme_location' => 'header')) ?>
				<ul class="menu-extended">
					<?php if(!is_front_page()): ?>
						<li><a href="/#pive" class="order"><button class="button white">Naruči&nbsp;pivo</button></a></li>
					<?php endif; ?>
					<li><a href="https://www.facebook.com/ppivovara/" target="_blank" rel="noreferrer"><?php get_template_part( 'partials/svg/facebook.svg', 'facebook' )?></a></li>
					<li><a href="https://picgra.com/user/pitko2017/10835216089" target="_blank" rel="noreferrer"><?php get_template_part( 'partials/svg/instagram.svg', 'instagram' ) ?></a></li>
					<li><a href="#" class="cart-icon" onclick="toggleCart(event)"><?php get_template_part( 'partials/svg/cart.svg', 'cart' ) ?></a></li>
				</ul>
			</div>
			<div id="cart-overview">
				<div class="cart-overview">
					
				</div>
			</div>
		</div>
	</header>
	<main <?php echo is_front_page() || is_page(array('popij-pitko', 'kontakt')) ? 'class="collapse"' : ''; ?>>




