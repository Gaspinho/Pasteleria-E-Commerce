import { useState } from "react";

export const CheckoutStep2 = ({ onNext, onPrev }) => {
  const [payment, setPayment] = useState("cash");
  return (
    <>
      {/* <!-- BEING CHECKOUT STEP TWO -->  */}
      <div className="checkout-payment checkout-form">
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.address (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  city character varying NOT NULL,
  area character varying NOT NULL,
  street_number integer NOT NULL,
  house_number integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT address_pkey PRIMARY KEY (id)
);
CREATE TABLE public.app_user (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  type USER-DEFINED NOT NULL DEFAULT 'CUSTOMER'::user_type_enum,
  first_name character varying NOT NULL,
  last_name character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  joined_at timestamp with time zone DEFAULT now(),
  last_login timestamp with time zone DEFAULT now(),
  phone_number character varying,
  address_id uuid,
  is_staff boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT app_user_pkey PRIMARY KEY (id),
  CONSTRAINT app_user_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.address(id)
);
CREATE TABLE public.board (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  shape character varying,
  width character varying,
  cost numeric DEFAULT 0 CHECK (cost >= 0::numeric),
  material character varying,
  CONSTRAINT board_pkey PRIMARY KEY (id)
);
CREATE TABLE public.cake (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  height numeric DEFAULT 50 CHECK (height >= 0::numeric),
  width numeric DEFAULT 50 CHECK (width >= 0::numeric),
  cost numeric DEFAULT 0 CHECK (cost >= 0::numeric),
  recipe_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cake_pkey PRIMARY KEY (id),
  CONSTRAINT cake_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.cake_recipe(id)
);
CREATE TABLE public.cake_decoration (
  decoration_element_id uuid NOT NULL,
  cake_id uuid NOT NULL,
  CONSTRAINT cake_decoration_pkey PRIMARY KEY (decoration_element_id, cake_id),
  CONSTRAINT cake_decoration_decoration_element_id_fkey FOREIGN KEY (decoration_element_id) REFERENCES public.decoration_element(id),
  CONSTRAINT cake_decoration_cake_id_fkey FOREIGN KEY (cake_id) REFERENCES public.cake(id)
);
CREATE TABLE public.cake_recipe (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  flavor_id uuid,
  coating_id uuid,
  frosting_id uuid,
  total_cost numeric DEFAULT 0 CHECK (total_cost >= 0::numeric),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cake_recipe_pkey PRIMARY KEY (id),
  CONSTRAINT cake_recipe_flavor_id_fkey FOREIGN KEY (flavor_id) REFERENCES public.flavor(id),
  CONSTRAINT cake_recipe_coating_id_fkey FOREIGN KEY (coating_id) REFERENCES public.coating(id),
  CONSTRAINT cake_recipe_frosting_id_fkey FOREIGN KEY (frosting_id) REFERENCES public.frosting(id)
);
CREATE TABLE public.cake_shape_layer (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  shape_name character varying DEFAULT 'Round Shape Cake'::character varying,
  layer_description text,
  CONSTRAINT cake_shape_layer_pkey PRIMARY KEY (id)
);
CREATE TABLE public.cake_text (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  text character varying NOT NULL,
  cake_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cake_text_pkey PRIMARY KEY (id),
  CONSTRAINT cake_text_cake_id_fkey FOREIGN KEY (cake_id) REFERENCES public.cake(id)
);
CREATE TABLE public.cart (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  customer_id uuid,
  delivery_charges numeric NOT NULL DEFAULT 0 CHECK (delivery_charges >= 0::numeric),
  total_amount numeric NOT NULL DEFAULT 0 CHECK (total_amount >= 0::numeric),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cart_pkey PRIMARY KEY (id),
  CONSTRAINT cart_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.app_user(id)
);
CREATE TABLE public.category (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL UNIQUE,
  CONSTRAINT category_pkey PRIMARY KEY (id)
);
CREATE TABLE public.coating (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL UNIQUE,
  cost numeric NOT NULL DEFAULT 0 CHECK (cost >= 0::numeric),
  CONSTRAINT coating_pkey PRIMARY KEY (id)
);
CREATE TABLE public.custom_cake (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  amount numeric NOT NULL CHECK (amount >= 0::numeric),
  msg_on_cake character varying,
  special_instruction text,
  order_status USER-DEFINED DEFAULT 'Order Pending'::order_status_enum,
  final_product_img_id uuid,
  icing_id uuid,
  top_img_decoration_id uuid,
  shape_layer_id uuid,
  msg_color_id uuid,
  sponge_flavor_id uuid,
  customer_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT custom_cake_pkey PRIMARY KEY (id),
  CONSTRAINT custom_cake_final_product_img_id_fkey FOREIGN KEY (final_product_img_id) REFERENCES public.final_product_img(id),
  CONSTRAINT custom_cake_icing_id_fkey FOREIGN KEY (icing_id) REFERENCES public.icing(id),
  CONSTRAINT custom_cake_top_img_decoration_id_fkey FOREIGN KEY (top_img_decoration_id) REFERENCES public.decoration_image(id),
  CONSTRAINT custom_cake_shape_layer_id_fkey FOREIGN KEY (shape_layer_id) REFERENCES public.cake_shape_layer(id),
  CONSTRAINT custom_cake_msg_color_id_fkey FOREIGN KEY (msg_color_id) REFERENCES public.msg_color(id),
  CONSTRAINT custom_cake_sponge_flavor_id_fkey FOREIGN KEY (sponge_flavor_id) REFERENCES public.sponge_flavor(id),
  CONSTRAINT custom_cake_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.app_user(id)
);
CREATE TABLE public.custom_cake_order (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  placed_at timestamp with time zone DEFAULT now(),
  delivery_at timestamp with time zone,
  delivery_time_window character varying DEFAULT '14:00-16:00'::character varying,
  address_id uuid,
  payment_id uuid,
  delivery_charges numeric DEFAULT 0 CHECK (delivery_charges >= 0::numeric),
  custom_cake_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT custom_cake_order_pkey PRIMARY KEY (id),
  CONSTRAINT custom_cake_order_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.address(id),
  CONSTRAINT custom_cake_order_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payment(id),
  CONSTRAINT custom_cake_order_custom_cake_id_fkey FOREIGN KEY (custom_cake_id) REFERENCES public.custom_cake(id)
);
CREATE TABLE public.decoration_element (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  cost numeric NOT NULL DEFAULT 0 CHECK (cost >= 0::numeric),
  CONSTRAINT decoration_element_pkey PRIMARY KEY (id)
);
CREATE TABLE public.decoration_image (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  image text,
  uploaded_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT decoration_image_pkey PRIMARY KEY (id),
  CONSTRAINT decoration_image_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.app_user(id)
);
CREATE TABLE public.design (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  customer_id uuid,
  delivery_charges numeric DEFAULT 0 CHECK (delivery_charges >= 0::numeric),
  total_cost numeric DEFAULT 0 CHECK (total_cost >= 0::numeric),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT design_pkey PRIMARY KEY (id),
  CONSTRAINT design_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.app_user(id)
);
CREATE TABLE public.design_cake (
  design_id uuid NOT NULL,
  cake_id uuid NOT NULL,
  CONSTRAINT design_cake_pkey PRIMARY KEY (design_id, cake_id),
  CONSTRAINT design_cake_design_id_fkey FOREIGN KEY (design_id) REFERENCES public.design(id),
  CONSTRAINT design_cake_cake_id_fkey FOREIGN KEY (cake_id) REFERENCES public.cake(id)
);
CREATE TABLE public.final_product_img (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  image text,
  icing_id uuid,
  cake_id uuid,
  flavor_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT final_product_img_pkey PRIMARY KEY (id),
  CONSTRAINT final_product_img_icing_id_fkey FOREIGN KEY (icing_id) REFERENCES public.icing(id),
  CONSTRAINT final_product_img_cake_id_fkey FOREIGN KEY (cake_id) REFERENCES public.cake(id),
  CONSTRAINT final_product_img_flavor_id_fkey FOREIGN KEY (flavor_id) REFERENCES public.sponge_flavor(id)
);
CREATE TABLE public.flavor (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL UNIQUE,
  cost numeric NOT NULL DEFAULT 0 CHECK (cost >= 0::numeric),
  CONSTRAINT flavor_pkey PRIMARY KEY (id)
);
CREATE TABLE public.frosting (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL UNIQUE,
  cost numeric NOT NULL DEFAULT 0 CHECK (cost >= 0::numeric),
  CONSTRAINT frosting_pkey PRIMARY KEY (id)
);
CREATE TABLE public.icing (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  CONSTRAINT icing_pkey PRIMARY KEY (id)
);
CREATE TABLE public.image_gallery (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  image1 text,
  image2 text,
  image3 text,
  image4 text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT image_gallery_pkey PRIMARY KEY (id)
);
CREATE TABLE public.msg_color (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  code character varying DEFAULT '#000000'::character varying,
  CONSTRAINT msg_color_pkey PRIMARY KEY (id)
);
CREATE TABLE public.order (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  status USER-DEFINED DEFAULT 'Order Placed'::order_status_enum,
  placed_at timestamp with time zone DEFAULT now(),
  delivery_at timestamp with time zone,
  delivery_time_window character varying DEFAULT '14:00-16:00'::character varying,
  customer_id uuid,
  address_id uuid,
  payment_id uuid,
  delivery_charges numeric DEFAULT 0 CHECK (delivery_charges >= 0::numeric),
  total_amount numeric CHECK (total_amount >= 0::numeric),
  note text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT order_pkey PRIMARY KEY (id),
  CONSTRAINT order_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.address(id),
  CONSTRAINT order_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payment(id),
  CONSTRAINT order_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.app_user(id)
);
CREATE TABLE public.ordered_product (
  product_id uuid NOT NULL,
  order_id uuid NOT NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  CONSTRAINT ordered_product_pkey PRIMARY KEY (product_id, order_id),
  CONSTRAINT ordered_product_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.order(id)
);
CREATE TABLE public.payment (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  payment_status USER-DEFINED NOT NULL DEFAULT 'Pending'::payment_status_enum,
  payment_type character varying NOT NULL DEFAULT 'Cash On Delivery'::character varying,
  amount_paid numeric NOT NULL DEFAULT 0 CHECK (amount_paid >= 0::numeric),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payment_pkey PRIMARY KEY (id)
);
CREATE TABLE public.product_in_cart (
  product_id uuid NOT NULL,
  cart_id uuid NOT NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  added_at timestamp with time zone DEFAULT now(),
  CONSTRAINT product_in_cart_pkey PRIMARY KEY (product_id, cart_id),
  CONSTRAINT product_in_cart_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.cart(id)
);
CREATE TABLE public.productos (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nombre text NOT NULL,
  descripcion character varying NOT NULL,
  precio double precision NOT NULL,
  image_gallery_id uuid,
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category_id uuid,
  sku character varying UNIQUE,
  is_sale character varying DEFAULT 'Yes'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  image_path text,
  CONSTRAINT productos_pkey PRIMARY KEY (id),
  CONSTRAINT productos_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id),
  CONSTRAINT productos_image_gallery_id_fkey FOREIGN KEY (image_gallery_id) REFERENCES public.image_gallery(id)
);
CREATE TABLE public.question (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  username character varying,
  message text,
  message_date timestamp with time zone DEFAULT now(),
  email character varying,
  CONSTRAINT question_pkey PRIMARY KEY (id)
);
CREATE TABLE public.review (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content text,
  review_date timestamp with time zone DEFAULT now(),
  product_id uuid,
  customer_id uuid,
  author_name character varying,
  author_email character varying,
  product_id_fk bigint,
  CONSTRAINT review_pkey PRIMARY KEY (id),
  CONSTRAINT review_product_id_fk_fkey FOREIGN KEY (product_id_fk) REFERENCES public.productos(id),
  CONSTRAINT review_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.app_user(id)
);
CREATE TABLE public.sponge_flavor (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL UNIQUE,
  CONSTRAINT sponge_flavor_pkey PRIMARY KEY (id)
);
CREATE TABLE public.template_design (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  design_id uuid,
  added_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT template_design_pkey PRIMARY KEY (id),
  CONSTRAINT template_design_design_id_fkey FOREIGN KEY (design_id) REFERENCES public.design(id),
  CONSTRAINT template_design_added_by_fkey FOREIGN KEY (added_by) REFERENCES public.app_user(id)
);
CREATE TABLE public.template_recipe (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  recipe_id uuid,
  added_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT template_recipe_pkey PRIMARY KEY (id),
  CONSTRAINT template_recipe_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.cake_recipe(id),
  CONSTRAINT template_recipe_added_by_fkey FOREIGN KEY (added_by) REFERENCES public.app_user(id)
);-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.address (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  city character varying NOT NULL,
  area character varying NOT NULL,
  street_number integer NOT NULL,
  house_number integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT address_pkey PRIMARY KEY (id)
);
CREATE TABLE public.app_user (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  type USER-DEFINED NOT NULL DEFAULT 'CUSTOMER'::user_type_enum,
  first_name character varying NOT NULL,
  last_name character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  joined_at timestamp with time zone DEFAULT now(),
  last_login timestamp with time zone DEFAULT now(),
  phone_number character varying,
  address_id uuid,
  is_staff boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT app_user_pkey PRIMARY KEY (id),
  CONSTRAINT app_user_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.address(id)
);
CREATE TABLE public.board (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  shape character varying,
  width character varying,
  cost numeric DEFAULT 0 CHECK (cost >= 0::numeric),
  material character varying,
  CONSTRAINT board_pkey PRIMARY KEY (id)
);
CREATE TABLE public.cake (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  height numeric DEFAULT 50 CHECK (height >= 0::numeric),
  width numeric DEFAULT 50 CHECK (width >= 0::numeric),
  cost numeric DEFAULT 0 CHECK (cost >= 0::numeric),
  recipe_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cake_pkey PRIMARY KEY (id),
  CONSTRAINT cake_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.cake_recipe(id)
);
CREATE TABLE public.cake_decoration (
  decoration_element_id uuid NOT NULL,
  cake_id uuid NOT NULL,
  CONSTRAINT cake_decoration_pkey PRIMARY KEY (decoration_element_id, cake_id),
  CONSTRAINT cake_decoration_decoration_element_id_fkey FOREIGN KEY (decoration_element_id) REFERENCES public.decoration_element(id),
  CONSTRAINT cake_decoration_cake_id_fkey FOREIGN KEY (cake_id) REFERENCES public.cake(id)
);
CREATE TABLE public.cake_recipe (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  flavor_id uuid,
  coating_id uuid,
  frosting_id uuid,
  total_cost numeric DEFAULT 0 CHECK (total_cost >= 0::numeric),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cake_recipe_pkey PRIMARY KEY (id),
  CONSTRAINT cake_recipe_flavor_id_fkey FOREIGN KEY (flavor_id) REFERENCES public.flavor(id),
  CONSTRAINT cake_recipe_coating_id_fkey FOREIGN KEY (coating_id) REFERENCES public.coating(id),
  CONSTRAINT cake_recipe_frosting_id_fkey FOREIGN KEY (frosting_id) REFERENCES public.frosting(id)
);
CREATE TABLE public.cake_shape_layer (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  shape_name character varying DEFAULT 'Round Shape Cake'::character varying,
  layer_description text,
  CONSTRAINT cake_shape_layer_pkey PRIMARY KEY (id)
);
CREATE TABLE public.cake_text (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  text character varying NOT NULL,
  cake_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cake_text_pkey PRIMARY KEY (id),
  CONSTRAINT cake_text_cake_id_fkey FOREIGN KEY (cake_id) REFERENCES public.cake(id)
);
CREATE TABLE public.cart (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  customer_id uuid,
  delivery_charges numeric NOT NULL DEFAULT 0 CHECK (delivery_charges >= 0::numeric),
  total_amount numeric NOT NULL DEFAULT 0 CHECK (total_amount >= 0::numeric),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cart_pkey PRIMARY KEY (id),
  CONSTRAINT cart_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.app_user(id)
);
CREATE TABLE public.category (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL UNIQUE,
  CONSTRAINT category_pkey PRIMARY KEY (id)
);
CREATE TABLE public.coating (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL UNIQUE,
  cost numeric NOT NULL DEFAULT 0 CHECK (cost >= 0::numeric),
  CONSTRAINT coating_pkey PRIMARY KEY (id)
);
CREATE TABLE public.custom_cake (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  amount numeric NOT NULL CHECK (amount >= 0::numeric),
  msg_on_cake character varying,
  special_instruction text,
  order_status USER-DEFINED DEFAULT 'Order Pending'::order_status_enum,
  final_product_img_id uuid,
  icing_id uuid,
  top_img_decoration_id uuid,
  shape_layer_id uuid,
  msg_color_id uuid,
  sponge_flavor_id uuid,
  customer_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT custom_cake_pkey PRIMARY KEY (id),
  CONSTRAINT custom_cake_final_product_img_id_fkey FOREIGN KEY (final_product_img_id) REFERENCES public.final_product_img(id),
  CONSTRAINT custom_cake_icing_id_fkey FOREIGN KEY (icing_id) REFERENCES public.icing(id),
  CONSTRAINT custom_cake_top_img_decoration_id_fkey FOREIGN KEY (top_img_decoration_id) REFERENCES public.decoration_image(id),
  CONSTRAINT custom_cake_shape_layer_id_fkey FOREIGN KEY (shape_layer_id) REFERENCES public.cake_shape_layer(id),
  CONSTRAINT custom_cake_msg_color_id_fkey FOREIGN KEY (msg_color_id) REFERENCES public.msg_color(id),
  CONSTRAINT custom_cake_sponge_flavor_id_fkey FOREIGN KEY (sponge_flavor_id) REFERENCES public.sponge_flavor(id),
  CONSTRAINT custom_cake_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.app_user(id)
);
CREATE TABLE public.custom_cake_order (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  placed_at timestamp with time zone DEFAULT now(),
  delivery_at timestamp with time zone,
  delivery_time_window character varying DEFAULT '14:00-16:00'::character varying,
  address_id uuid,
  payment_id uuid,
  delivery_charges numeric DEFAULT 0 CHECK (delivery_charges >= 0::numeric),
  custom_cake_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT custom_cake_order_pkey PRIMARY KEY (id),
  CONSTRAINT custom_cake_order_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.address(id),
  CONSTRAINT custom_cake_order_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payment(id),
  CONSTRAINT custom_cake_order_custom_cake_id_fkey FOREIGN KEY (custom_cake_id) REFERENCES public.custom_cake(id)
);
CREATE TABLE public.decoration_element (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  cost numeric NOT NULL DEFAULT 0 CHECK (cost >= 0::numeric),
  CONSTRAINT decoration_element_pkey PRIMARY KEY (id)
);
CREATE TABLE public.decoration_image (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  image text,
  uploaded_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT decoration_image_pkey PRIMARY KEY (id),
  CONSTRAINT decoration_image_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.app_user(id)
);
CREATE TABLE public.design (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  customer_id uuid,
  delivery_charges numeric DEFAULT 0 CHECK (delivery_charges >= 0::numeric),
  total_cost numeric DEFAULT 0 CHECK (total_cost >= 0::numeric),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT design_pkey PRIMARY KEY (id),
  CONSTRAINT design_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.app_user(id)
);
CREATE TABLE public.design_cake (
  design_id uuid NOT NULL,
  cake_id uuid NOT NULL,
  CONSTRAINT design_cake_pkey PRIMARY KEY (design_id, cake_id),
  CONSTRAINT design_cake_design_id_fkey FOREIGN KEY (design_id) REFERENCES public.design(id),
  CONSTRAINT design_cake_cake_id_fkey FOREIGN KEY (cake_id) REFERENCES public.cake(id)
);
CREATE TABLE public.final_product_img (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  image text,
  icing_id uuid,
  cake_id uuid,
  flavor_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT final_product_img_pkey PRIMARY KEY (id),
  CONSTRAINT final_product_img_icing_id_fkey FOREIGN KEY (icing_id) REFERENCES public.icing(id),
  CONSTRAINT final_product_img_cake_id_fkey FOREIGN KEY (cake_id) REFERENCES public.cake(id),
  CONSTRAINT final_product_img_flavor_id_fkey FOREIGN KEY (flavor_id) REFERENCES public.sponge_flavor(id)
);
CREATE TABLE public.flavor (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL UNIQUE,
  cost numeric NOT NULL DEFAULT 0 CHECK (cost >= 0::numeric),
  CONSTRAINT flavor_pkey PRIMARY KEY (id)
);
CREATE TABLE public.frosting (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL UNIQUE,
  cost numeric NOT NULL DEFAULT 0 CHECK (cost >= 0::numeric),
  CONSTRAINT frosting_pkey PRIMARY KEY (id)
);
CREATE TABLE public.icing (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  CONSTRAINT icing_pkey PRIMARY KEY (id)
);
CREATE TABLE public.image_gallery (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  image1 text,
  image2 text,
  image3 text,
  image4 text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT image_gallery_pkey PRIMARY KEY (id)
);
CREATE TABLE public.msg_color (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  code character varying DEFAULT '#000000'::character varying,
  CONSTRAINT msg_color_pkey PRIMARY KEY (id)
);
CREATE TABLE public.order (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  status USER-DEFINED DEFAULT 'Order Placed'::order_status_enum,
  placed_at timestamp with time zone DEFAULT now(),
  delivery_at timestamp with time zone,
  delivery_time_window character varying DEFAULT '14:00-16:00'::character varying,
  customer_id uuid,
  address_id uuid,
  payment_id uuid,
  delivery_charges numeric DEFAULT 0 CHECK (delivery_charges >= 0::numeric),
  total_amount numeric CHECK (total_amount >= 0::numeric),
  note text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT order_pkey PRIMARY KEY (id),
  CONSTRAINT order_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.address(id),
  CONSTRAINT order_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payment(id),
  CONSTRAINT order_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.app_user(id)
);
CREATE TABLE public.ordered_product (
  product_id uuid NOT NULL,
  order_id uuid NOT NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  CONSTRAINT ordered_product_pkey PRIMARY KEY (product_id, order_id),
  CONSTRAINT ordered_product_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.order(id)
);
CREATE TABLE public.payment (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  payment_status USER-DEFINED NOT NULL DEFAULT 'Pending'::payment_status_enum,
  payment_type character varying NOT NULL DEFAULT 'Cash On Delivery'::character varying,
  amount_paid numeric NOT NULL DEFAULT 0 CHECK (amount_paid >= 0::numeric),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payment_pkey PRIMARY KEY (id)
);
CREATE TABLE public.product_in_cart (
  product_id uuid NOT NULL,
  cart_id uuid NOT NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  added_at timestamp with time zone DEFAULT now(),
  CONSTRAINT product_in_cart_pkey PRIMARY KEY (product_id, cart_id),
  CONSTRAINT product_in_cart_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.cart(id)
);
CREATE TABLE public.productos (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nombre text NOT NULL,
  descripcion character varying NOT NULL,
  precio double precision NOT NULL,
  image_gallery_id uuid,
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category_id uuid,
  sku character varying UNIQUE,
  is_sale character varying DEFAULT 'Yes'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  image_path text,
  CONSTRAINT productos_pkey PRIMARY KEY (id),
  CONSTRAINT productos_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id),
  CONSTRAINT productos_image_gallery_id_fkey FOREIGN KEY (image_gallery_id) REFERENCES public.image_gallery(id)
);
CREATE TABLE public.question (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  username character varying,
  message text,
  message_date timestamp with time zone DEFAULT now(),
  email character varying,
  CONSTRAINT question_pkey PRIMARY KEY (id)
);
CREATE TABLE public.review (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content text,
  review_date timestamp with time zone DEFAULT now(),
  product_id uuid,
  customer_id uuid,
  author_name character varying,
  author_email character varying,
  product_id_fk bigint,
  CONSTRAINT review_pkey PRIMARY KEY (id),
  CONSTRAINT review_product_id_fk_fkey FOREIGN KEY (product_id_fk) REFERENCES public.productos(id),
  CONSTRAINT review_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.app_user(id)
);
CREATE TABLE public.sponge_flavor (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL UNIQUE,
  CONSTRAINT sponge_flavor_pkey PRIMARY KEY (id)
);
CREATE TABLE public.template_design (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  design_id uuid,
  added_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT template_design_pkey PRIMARY KEY (id),
  CONSTRAINT template_design_design_id_fkey FOREIGN KEY (design_id) REFERENCES public.design(id),
  CONSTRAINT template_design_added_by_fkey FOREIGN KEY (added_by) REFERENCES public.app_user(id)
);
CREATE TABLE public.template_recipe (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  recipe_id uuid,
  added_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT template_recipe_pkey PRIMARY KEY (id),
  CONSTRAINT template_recipe_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.cake_recipe(id),
  CONSTRAINT template_recipe_added_by_fkey FOREIGN KEY (added_by) REFERENCES public.app_user(id)
);        <h4>Métodos de Pago</h4>
     {/* <div
          className={`checkout-payment__item ${
            payment === "credit-card" && "active"
          }`}
        >
          <div className="checkout-payment__item-head">
            <label
              onChange={() => setPayment("credit-card")}
              className="radio-box"
            >
              Credit card
              <input
                type="radio"
                checked={payment === "credit-card"}
                name="radio"
              />
              <span className="checkmark"></span>
              <span className="radio-box__info">
                <i className="icon-info"></i>
                <span className="radio-box__info-content">
                  Aliqua nulla id aliqua minim ullamco adipisicing enim. Do sint
                  nisi velit qui. Ullamco Lorem aliquip dolor nostrud cupidatat
                  amet.
                </span>
              </span>
            </label>
          </div>
          <div className="checkout-payment__item-content">
            <div className="box-field">
              <span>Card number</span>
              <input
                type="text"
                className="form-control"
                placeholder="xxxx xxxx xxxx xxxx"
                maxlength="16"
              />
            </div>
            <div className="box-field__row">
              <div className="box-field">
                <span>Expiration date</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="mm"
                  maxlength="2"
                />
              </div>
              <div className="box-field">
                <input
                  type="text"
                  className="form-control"
                  placeholder="yy"
                  maxlength="2"
                />
              </div>
              <div className="box-field">
                <span>Security code</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="CVV"
                  maxlength="3"
                />
              </div>
            </div>
          </div>
        </div> */}

        <div
          className={`checkout-payment__item ${payment === "cash" && "active"}`}
        >
          <div className="checkout-payment__item-head">
            <label onClick={() => setPayment("cash")} className="radio-box">
              Pago en Efectivo
              <input type="radio" checked={payment === "cash"} name="radio" />
              <span className="checkmark"></span>
              <span className="radio-box__info">
                <i className="icon-info"></i>
                <span className="radio-box__info-content">
                  Actualmente solo ofrecemos Pago Contra Entrega
                </span>
              </span>
            </label>
          </div>
        </div>
        <div className="checkout-buttons">
          <button onClick={onPrev} className="btn btn-grey btn-icon">
            <i className="icon-arrow"></i> Atrás
          </button>
          <button onClick={onNext} className="btn btn-icon btn-next">
            Siguiente <i className="icon-arrow"></i>
          </button>
        </div>
      </div>
      {/* <!-- CHECKOUT STEP TWO EOF -->  */}
    </>
  );
};
