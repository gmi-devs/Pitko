<?php get_header(); ?>

<?php
$introduction = get_field('introduction');	

if($introduction): ?>
	<section class="introduction">
		<div class="container-1400">
			<?php if($introduction['heading_component_1'] || $introduction['heading_component_2']):  ?>
				<h1 class="h2">
					<?php if($introduction['heading_component_1']): ?>
						<span><?php echo $introduction['heading_component_1'];?></span>
					<?php endif; ?>

					<?php if($introduction['heading_component_2']): ?>
						<span><?php echo $introduction['heading_component_2'];?></span>
					<?php endif; ?>
				</h1>
			<?php endif; ?>
			<img src="<?php echo $introduction['image']['sizes']['introduction']?>" alt="<?php echo $introduction['image']['filename'] ?>" />
		</div>
	</section>
<?php endif; ?>

<?php

$about = get_field('about');	

if($about): ?>
	<section class="about">
		<div class="container-1400">
			<div class="container-680">

				<?php if($about['heading']): ?>
					<h1 class="h2"><?php echo $about['heading'];?></h1>
				<?php endif; ?>

				<?php if($about['description']): ?>
					<p><?php echo $about['description'];?></p>
				<?php endif; ?>

				<a href="/o-nama" class="link">Više o nama</a>
			</div>
		</div>
		<div class="decoration-images">
			<div class="left">
				<img src="<?php echo get_template_directory_uri() ?>/img/hmelj-blur.png" alt="">
				<img src="<?php echo get_template_directory_uri() ?>/img/hmelj.png" alt="">
			</div>
			<div class="right">
				<img src="<?php echo get_template_directory_uri() ?>/img/hmelj-blur.png" alt="">
				<img src="<?php echo get_template_directory_uri() ?>/img/hmelj.png" alt="">
			</div>
		</ul>
	</section>
<?php endif; ?>

<section id="pive" class="slider">
	<div class="container-1400 no-pad">
		<?php

		$slider = get_field('slider');	

		if($slider): ?>
			<?php if($slider['heading']): ?>
				<h1 class="h2"><?php echo $slider['heading'];?></h1>
			<?php endif; ?>
		<?php endif; ?>

		<?php 
		$args = array( 'post_type' => 'pive', 'posts_per_page' => -1);
		$query = new WP_Query( $args ); 
		?>

		<?php if ( $query->have_posts() ) : ?>
			<div class="slider-container">	
				<div class="slider-core siema pi-slider init">
					<?php 
					while ( $query->have_posts() ) : $query->the_post(); 
						$image = get_field('image');
						$ornament = get_field('ornament');
						$show = get_field('show_in_slider');
						$title = get_the_title();
						?>
						<?php if($show): ?>
						<div class="slide">
							<div class="highlight">
								<?php if($ornament): ?>
									<img src="<?php echo $ornament['sizes']['ornament'] ?>"alt="<?php echo $ornament['filename']; ?>">
								<?php endif; ?>

								<?php if($title): ?>
									<h2><?php echo $title?></h2>
								<?php endif; ?>
							</div>

							<?php if($image): ?>
								<a href="<?php the_permalink(); ?>">
									<img class="slider-product" src="<?php echo $image['sizes']['slider'] ?>" alt="<?php echo $image['filename']; ?>">
								</a>

							<?php endif; ?>
							<a href="<?php the_permalink(); ?>" class="cta"><button class="button white">Odaberi</button></a>
						</div>
						<?php endif; ?>
					<?php endwhile; ?>			
				</div>
				<button class="controls prev" aria-label="Previous" type="button">
					<?php get_template_part( 'partials/svg/arrow-left.svg', 'arrow' ) ?>
				</button>

				<button class="controls next" aria-label="Next" type="button">
					<?php get_template_part( 'partials/svg/arrow-right.svg', 'arrow' ) ?>
				</button>
		</div>
			<?php wp_reset_postdata(); ?>
		<?php endif; ?>
	</div>
</section>


<section class="blog-latest">
	<div class="container-1400">
		<h1 class="h2">Pratite nas na blogu <a href="/blog" class="link">Pogledaj sve</a></h1>
		<?php
		$args = array(
			'post_type' => 'post',
			'posts_per_page' => 3
		);

		$post_query = new WP_Query($args);
		?>
		<?php  if($post_query->have_posts()): ?>
			<ul class="post-container">
				<?php while($post_query->have_posts()): $post_query->the_post(); ?>
					<li class="post">
						<a href="<?php echo get_permalink(); ?>">
							<article> 
								<div class="img-container">
									<?php the_post_thumbnail('post-preview', [ 'alt' => esc_html (get_the_title())]); ?>
								</div>
								<div class="date"><?php echo get_the_date('d.m.Y' )?></div>
								<h3><?php the_title();?></h3>	
							</article></a>

						</li>
					<?php endwhile;?>
				</ul>
				<?php wp_reset_postdata(); ?>
			<?php endif; ?>
		</div>
	</section>

	<?php $teaser = get_field('teaser'); ?>

	<?php if($teaser): ?>
		<section class="teaser" style="background-image: url('<?php echo $teaser['image']['sizes']['teaser'] ?>')">
			<h2><?php echo $teaser['title'] ?></h2>
			<a href="/#pive" onclick="slideToProducts(this, event)"><button class="button white"><?php echo $teaser['cta'] ?></button></a>
		</section>
	<?php endif; ?>

	<?php get_footer(); ?>
