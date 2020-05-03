</main>

<footer>
	<div class="footer-group">
		<div class="logo-footer">
			<a href="/" class="logo"><img src="<?php echo get_template_directory_uri(); ?>/img/logo-footer.svg" alt="logo-footer"></a>
		</div>

		<?php wp_nav_menu(array(
			'theme_location' => 'footer'
		)) ?>
		<ul class="footer-icons">
			<li><a href="https://www.facebook.com/ppivovara/" target="_blank"><?php get_template_part( 'partials/svg/facebook.svg', 'facebook' ) ?></a></li>
			<li><a href="https://www.instagram.com/explore/tags/pitoma%C4%8Dkapivovara/" target="_blank"><?php get_template_part( 'partials/svg/instagram.svg', 'instagram' ) ?></a></li>
		</ul>
	</div>

	<div class="cpy">
		2019 &copy; Pitko
	</div>
	<div class="esif">
		<img src="<?php echo get_template_directory_uri(); ?>/img/esif.png" alt="">
	</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>