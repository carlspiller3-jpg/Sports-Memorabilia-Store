-- Insert Products
INSERT INTO public.products (id, title, body_html, vendor, product_type, handle, status, tags)
VALUES 
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Lionel Messi Signed Argentina 2022 Home Shirt', 'Authentic signed Argentina 2022 Home Shirt by Lionel Messi. Signed at a private signing session in Paris.', 'Sports Mem Store', 'Shirt', 'lionel-messi-signed-argentina-2022-home-shirt', 'active', ARRAY['messi', 'argentina', 'shirt']),
('d290f1ee-6c54-4b01-90e6-d701748f0852', 'Cristiano Ronaldo Signed Real Madrid 2017 Shirt', 'Authentic signed Real Madrid 2017 Shirt by Cristiano Ronaldo.', 'Sports Mem Store', 'Shirt', 'cristiano-ronaldo-signed-real-madrid-2017-shirt', 'active', ARRAY['ronaldo', 'real madrid', 'shirt']),
('d290f1ee-6c54-4b01-90e6-d701748f0853', 'Tyson Fury Signed Boxing Glove', 'Authentic signed boxing glove by Tyson Fury.', 'Sports Mem Store', 'Glove', 'tyson-fury-signed-boxing-glove', 'active', ARRAY['fury', 'boxing', 'glove']),
('d290f1ee-6c54-4b01-90e6-d701748f0854', 'Lewis Hamilton Signed Photo Display', 'Authentic signed photo display by Lewis Hamilton.', 'Sports Mem Store', 'Photo', 'lewis-hamilton-signed-photo-display', 'active', ARRAY['hamilton', 'f1', 'photo']);

-- Insert Variants for Messi Shirt
INSERT INTO public.variants (product_id, title, price, sku, inventory_quantity, option1, smart_contract_address, token_id)
VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Black Frame', 349.99, 'MESSI-ARG-22-BLK', 10, 'Black Frame', '0x123...', '1'),
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Gold Frame', 399.99, 'MESSI-ARG-22-GLD', 5, 'Gold Frame', '0x123...', '2'),
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Oak Frame', 349.99, 'MESSI-ARG-22-OAK', 8, 'Oak Frame', '0x123...', '3');

-- Insert Variants for Ronaldo Shirt
INSERT INTO public.variants (product_id, title, price, sku, inventory_quantity, option1)
VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0852', 'Standard', 299.99, 'RON-RM-17', 15, 'Standard');

-- Insert Variants for Fury Glove
INSERT INTO public.variants (product_id, title, price, sku, inventory_quantity, option1)
VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0853', 'Standard', 149.99, 'FURY-GLOVE', 20, 'Standard');

-- Insert Variants for Hamilton Photo
INSERT INTO public.variants (product_id, title, price, sku, inventory_quantity, option1)
VALUES
('d290f1ee-6c54-4b01-90e6-d701748f0854', 'Standard', 89.99, 'HAM-PHOTO', 25, 'Standard');
