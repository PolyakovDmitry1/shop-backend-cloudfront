-- Drop tables
-- DROP TABLE public.products;
-- DROP TABLE public.stocks;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- creating product table
CREATE TABLE public.products (
	description text NULL,
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	title text NOT NULL,
	price int4 NULL,
	CONSTRAINT products_pkey PRIMARY KEY (id)
);

-- creating stocks table
CREATE TABLE public.stocks (
	product_id uuid NOT NULL,
	count int4 NOT NULL DEFAULT 0,
	CONSTRAINT fk_stocks_products FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID
);

CREATE INDEX fki_fk_stocks_products ON public.stocks USING btree (product_id);

-- filling data up products and stocks tables
INSERT INTO products (id, price, title, description)
VALUES
    (
        '2461cafa-766d-4745-a720-fae6ade7276c',
        110,
        'Tour of C++, A (C++ In-Depth Series)',
        'In A Tour of C++, Third Edition, Bjarne Stroustrup provides an overview of ISO C++, C++20, that aims to give experienced programmers a clear understanding of what constitutes modern C++. Featuring carefully crafted examples and practical help in getting started, this revised and updated edition concisely covers most major language features and the major standard-library components needed for effective use.'
    ),
    (
        'b4c2aec7-4242-4a2b-a1fa-63ad85d60f80',
        18,
        'HTML and CSS: Design and Build Websites ',
        'Every day, more and more people want to learn some HTML and CSS. Joining the professional web designers and programmers are new audiences who need to know a little bit of code at work (update a content management system or e-commerce store) and those who want to make their personal blogs more attractive. Many books teaching HTML and CSS are dry and only written for those who want to become programmers, which is why this book takes an entirely new approach.'
    ),
    (
        'b0554d6f-74da-4fff-ac75-932a7491c9dc',
        100,
        'Introduction to Algorithms, fourth edition',
        'Introduction to Algorithms uniquely combines rigor and comprehensiveness. It covers a broad range of algorithms in depth, yet makes their design and analysis accessible to all levels of readers, with self-contained chapters and algorithms in pseudocode. Since the publication of the first edition, Introduction to Algorithms has become the leading algorithms text in universities worldwide as well as the standard reference for professionals. This fourth edition has been updated throughout.'
    );
	
INSERT INTO stocks (product_id, count)
VALUES
  ('2461cafa-766d-4745-a720-fae6ade7276c', 5),
	('b4c2aec7-4242-4a2b-a1fa-63ad85d60f80', 8),
	('b0554d6f-74da-4fff-ac75-932a7491c9dc', 3);


-- Drop table
-- DROP TABLE public.cart_items;
-- DROP TABLE public.carts;
CREATE TABLE public.carts (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now(),
	CONSTRAINT carts_pkey PRIMARY KEY (id)
);

CREATE TABLE public.cart_items (
	cart_id uuid NOT NULL,
	product_id uuid NOT NULL,
	count int4 NOT NULL DEFAULT 0,
	CONSTRAINT fk_cart_items FOREIGN KEY (cart_id) REFERENCES carts(id) ON UPDATE CASCADE ON DELETE RESTRICT
);
CREATE INDEX fki_fk_cart_items ON public.cart_items USING btree (cart_id);

-- filling data up carts and cart_items tables
INSERT INTO carts (id)
values ('101bfae9-5015-40ee-927f-cda8a357446a');

INSERT INTO cart_items (cart_id, product_id, count)
VALUES
  ('101bfae9-5015-40ee-927f-cda8a357446a', '2461cafa-766d-4745-a720-fae6ade7276c', 1),
	('101bfae9-5015-40ee-927f-cda8a357446a', 'b4c2aec7-4242-4a2b-a1fa-63ad85d60f80', 2);
