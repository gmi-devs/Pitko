</main>

<footer>
	<div class="footer-group">
		<div class="logo-footer">
			<a href="/" class="logo"><img src="<?php echo get_template_directory_uri(); ?>/img/logo-footer.png" alt="logo-footer"></a>
		</div>

		<?php wp_nav_menu(array(
			'theme_location' => 'footer'
		)) ?>
		<ul class="footer-icons">
			<li><a href="https://www.facebook.com/ppivovara/"><?php get_template_part( 'partials/svg/facebook.svg', 'facebook' ) ?></a></li>
			<li><a href="https://www.instagram.com/"><?php get_template_part( 'partials/svg/instagram.svg', 'instagram' ) ?></a></li>
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
<script src="http://localhost:35729/livereload.js"></script>
</body>
</html>