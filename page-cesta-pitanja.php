<?php get_header() ?>
<?php 
$args = array( 'post_type' => 'q&a', 'posts_per_page' => -1);
$query = new WP_Query( $args ); 
if ( $query->have_posts() ) : ?>
	<div class="container-1400">
		<div class="container-680">
			<h1><?php the_title(); ?></h1>
			<div class="accordion-container">
				<?php
				$data = array();
				while ( $query->have_posts() ) : $query->the_post(); 
					$question = get_field('question');
					$answer = get_field('answer'); ?>
					<article class="accordion">
						<h2><div><span class="control minus"><?php get_template_part( 'partials/svg/minus.svg', 'minus' )?></span><span class="control plus"><?php get_template_part( 'partials/svg/plus.svg', 'plus' )?></span></div><?php echo $question; ?></h2>
						<div class="answer">
							<p><?php echo $answer; ?></p>
						</div>
					</div>
				<?php endwhile; ?>
			</div>
		</div>
	</div>
<?php endif; ?>
<?php get_footer(); ?>
