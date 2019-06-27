<?php get_header() ?>
<?php if(have_posts()): ?>
	<?php while ( have_posts() ) : the_post();
		$product_name = get_field('product_name');
		$image = get_field('image');
		$description = get_field('description');
		$price_05 = get_field('price_05_l');
		$price_03 = get_field('price_033_l');
		?>
		<div class="container-1400 product-single">
			<div class="container-920">
				<div class="headline">
					<h1><?php the_title(); ?></h1>
				</div>
				<div class="description">
					<div class="img-container">
						<img src="<?php echo $image['sizes']['slider'] ?>" alt="<?php echo $image['filename']; ?>">
					</div>

					<div class="product-detail">
						<div class="headline">
							<h1><?php the_title(); ?></h1>
						</div>
						<?php if($description): ?>
							<p><?php echo $description ?></p>
						<?php endif; ?>
						<?php if($price_05 || $price_03): ?>
							<div class="select-unit">
								<div class="packing">
									<?php if($price_05): ?>
										<button type="button" class="button white active" data-pck="0,5" data-price="<?php echo $price_05; ?>" onclick="selectPacking(this)"><span>0,50 l</span><?php echo $price_05; ?> kn</button>
									<?php endif; ?>
									<?php if($price_03): ?>
										<button type="button" class="button white" data-pck="0,33" data-price="<?php echo $price_03; ?>" onclick="selectPacking(this)"><span>0,33 l</span><?php echo $price_03; ?> kn</button>
									<?php endif; ?>
								</div>
								<div class="quantity">
									<button type="button" class="button white" onclick="decVal(this)"><?php get_template_part( 'partials/svg/minus.svg', 'minus' ) ?></button>
									<input type="number" min="1" max="99" value="1" step="1">
									<button type="button" class="button white" onclick="incVal(this)"><?php get_template_part( 'partials/svg/plus.svg', 'plus' ) ?></button>
								</div>
								<div class="button-container">
									<button class="button white" data-id="<?php echo $post->ID ?>" data-name="<?php echo $product_name; ?>" data-imgsrc="<?php echo $image['sizes']['cart'] ?>" onclick="addItem(this)">Stavi u košaricu</button>
								</div>
							</div>
						<?php endif; ?>
					</div>
				</div>
			</div>

			<div class="container-920">
				<h2 class="h3">Možda želiš probati i ova piva?</h2>
				<div class="product-container">
					
					<?php $loop = new WP_Query( array( 'post_type' => 'pive', 'posts_per_page' => 4, 'post__not_in' => array( $post->ID ), 'orderby' => 'rand' ) ); ?>

					<?php while ( $loop->have_posts() ) : $loop->the_post(); 
						$image = get_field('image');
						?>
						<div class="product">
							<a href="<?php the_permalink(); ?>"><img src="<?php echo $image['sizes']['slider'] ?>" alt="<?php echo $image['filename']; ?>"></a>
						</div>
					<?php endwhile; ?>
				</div>
			</div>


		</div>
	<?php endwhile; ?>
<?php endif; ?>
<?php get_footer(); ?>