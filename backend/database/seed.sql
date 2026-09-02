INSERT INTO categories(name,slug,image_url) VALUES
('Men','men','https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900'),
('Women','women','https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900'),
('Footwear','footwear','https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900'),
('Bags','bags','https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900'),
('Watches','watches','https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900')
ON CONFLICT(slug) DO NOTHING;
INSERT INTO products(name,slug,description,price,original_price,discount,category_id,brand,stock,rating,review_count,image_url)
SELECT 'Classic Cotton Tee','classic-cotton-tee','Soft everyday cotton t-shirt.',799,999,20,id,'Nova Basics',40,4.6,128,'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900' FROM categories WHERE slug='men' AND NOT EXISTS(SELECT 1 FROM products WHERE slug='classic-cotton-tee');
INSERT INTO products(name,slug,description,price,original_price,discount,category_id,brand,stock,rating,review_count,image_url)
SELECT 'Minimal Dress','minimal-dress','Versatile contemporary dress.',1599,1999,20,id,'Nova Studio',25,4.8,92,'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900' FROM categories WHERE slug='women' AND NOT EXISTS(SELECT 1 FROM products WHERE slug='minimal-dress');
INSERT INTO products(name,slug,description,price,original_price,discount,category_id,brand,stock,rating,review_count,image_url)
SELECT 'Everyday Sneakers','everyday-sneakers','Lightweight everyday sneakers.',2299,2999,23,id,'Nova Move',30,4.7,214,'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900' FROM categories WHERE slug='footwear' AND NOT EXISTS(SELECT 1 FROM products WHERE slug='everyday-sneakers');
INSERT INTO products(name,slug,description,price,original_price,discount,category_id,brand,stock,rating,review_count,image_url)
SELECT 'City Tote','city-tote','Structured everyday tote.',1899,2399,21,id,'Nova Carry',18,4.5,67,'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900' FROM categories WHERE slug='bags' AND NOT EXISTS(SELECT 1 FROM products WHERE slug='city-tote');
INSERT INTO products(name,slug,description,price,original_price,discount,category_id,brand,stock,rating,review_count,image_url)
SELECT 'Classic Watch','classic-watch','Clean timeless watch design.',3499,4499,22,id,'Nova Time',12,4.9,54,'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900' FROM categories WHERE slug='watches' AND NOT EXISTS(SELECT 1 FROM products WHERE slug='classic-watch');
INSERT INTO banners(title,description,image_url,button_text,button_link,active) SELECT 'Summer Collection','Fresh essentials designed for the season.','https://images.unsplash.com/photo-1445205170230-053b83016050?w=1800','SHOP NOW','/categories',true WHERE NOT EXISTS(SELECT 1 FROM banners);
