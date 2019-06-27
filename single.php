<?php get_header() ?>
<?php while ( have_posts() ) : the_post(); ?>
<div class="container-1400 blog-single">
	<div class="container-680">
		<h1 class="h2"><?php the_title(); ?></h1>
		<div class="date"><?php echo get_the_date('d.m.Y' )?></div>
		<?php the_content(); ?>
	</div>
</div>
<?php endwhile; ?>
<?php get_footer(); ?>