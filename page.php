<?php get_header() ?>
<?php while ( have_posts() ) : the_post(); ?>
	<div class="container-1400">
		<div class="container-680 pitko-content">
			<h1><?php the_title(); ?></h1>
			<?php the_content(); ?>
		</div>
	</div>
<?php endwhile; ?>
<?php get_footer(); ?>