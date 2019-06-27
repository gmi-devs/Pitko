<?php get_header() ?>
<?php

$paged = get_query_var('paged') ? get_query_var('paged') : 1;
$args = array(
	'post_type' => 'post',
	'posts_per_page' => 9,
	'paged' => $paged,
);

$wp_query = new WP_Query( $args );

?>
<div class="container-1400">
	<h1><?php the_title(); ?></h1>
	<?php if ( $wp_query->have_posts() ): ?>
		<div class="blog-archive">
			<?php while ( $wp_query->have_posts() ): $wp_query->the_post(); ?>

				<a href="<?php echo get_permalink(); ?>" class="post">
					<article> 
						<div class="img-container">
							<?php the_post_thumbnail('post-preview'); ?>
						</div>
						<div class="date"><?php echo get_the_date('d.m.Y' )?></div>
						<h2 class="h3"><?php the_title();?></h2>	
					</article>
				</a>

			<?php endwhile; ?>
		</div>

		<div class="pagination">
		<?php
			echo paginate_links( array(
				'total' => $wp_query->max_num_pages,
				'current' => $paged,
				'prev_text' => '',
				'next_text' => ''
			) );
		?>
		</div>
<?php endif; ?>
</div>
<?php get_footer(); ?>