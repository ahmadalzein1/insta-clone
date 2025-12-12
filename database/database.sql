--
-- PostgreSQL database dump
--

\restrict OryfUD0O4GSY7qNtukV5eeEYOk5UfgGxAib6b5fUFhQquc4nbwzdaDpsmJ1xSrF

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2025-12-12 16:24:49

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 24718)
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    post_id integer,
    user_id integer,
    text text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 24717)
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_id_seq OWNER TO postgres;

--
-- TOC entry 4946 (class 0 OID 0)
-- Dependencies: 222
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- TOC entry 224 (class 1259 OID 24737)
-- Name: follows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.follows (
    follower_id integer NOT NULL,
    following_id integer NOT NULL
);


ALTER TABLE public.follows OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24702)
-- Name: likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.likes (
    post_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.likes OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 24688)
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    user_id integer,
    image text NOT NULL,
    caption text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.posts OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24687)
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.posts_id_seq OWNER TO postgres;

--
-- TOC entry 4947 (class 0 OID 0)
-- Dependencies: 219
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- TOC entry 218 (class 1259 OID 24673)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    avatar text,
    role character varying(20) DEFAULT 'user'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 24672)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4948 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4765 (class 2604 OID 24721)
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- TOC entry 4763 (class 2604 OID 24691)
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- TOC entry 4760 (class 2604 OID 24676)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4939 (class 0 OID 24718)
-- Dependencies: 223
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, post_id, user_id, text, created_at) FROM stdin;
\.


--
-- TOC entry 4940 (class 0 OID 24737)
-- Dependencies: 224
-- Data for Name: follows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.follows (follower_id, following_id) FROM stdin;
\.


--
-- TOC entry 4937 (class 0 OID 24702)
-- Dependencies: 221
-- Data for Name: likes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.likes (post_id, user_id) FROM stdin;
\.


--
-- TOC entry 4936 (class 0 OID 24688)
-- Dependencies: 220
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts (id, user_id, image, caption, created_at) FROM stdin;
\.


--
-- TOC entry 4934 (class 0 OID 24673)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password, avatar, role, created_at) FROM stdin;
1	ahmad	ahmad@example.com	$2b$10$wNYwfXaKKQFW2IFozY5dYOfITvHqy0mUnp7VgK9LUucyuimyNqKIa	\N	user	2025-12-11 13:36:55.92278
2	ahmsad	ahmads@example.com	$2b$10$lQl2.Pg5Z1.4xGwULSnfDeDZs4XmBa7ZKdXNlKNujMwBEGYEs1K92	\N	user	2025-12-11 13:37:34.78714
3	ahmaddd	zeinahmad763@gmail.coms	$2b$10$llqA8H8XFvvwHKI/ohQmEOQIdpcZvBAdZG6J23krRsxyMLq5cSh8G	\N	user	2025-12-12 15:46:04.364493
4	omar	zeinomar763@gmail.com	$2b$10$cU6.mV1nxlxZXOLAdEYZheMieixRzD9eHjMdX6esHsOPaVq0OI.sG	\N	user	2025-12-12 15:46:54.204403
5	salah	salah763@gmail.com	$2b$10$R8fsKRBpA7vUZJvsC2x3luCiCax3Rh4jlw5QKiZJvwnRGWe5afC/W	\N	user	2025-12-12 15:55:59.222834
6	er	d	$2b$10$9eTaDUWD5tpTOzmoMvN5m.OII9HLA4pzFn5A7cWwD1rbNhBR.T0Py	\N	user	2025-12-12 16:08:22.373005
\.


--
-- TOC entry 4949 (class 0 OID 0)
-- Dependencies: 222
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_id_seq', 1, false);


--
-- TOC entry 4950 (class 0 OID 0)
-- Dependencies: 219
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.posts_id_seq', 1, false);


--
-- TOC entry 4951 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- TOC entry 4778 (class 2606 OID 24726)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- TOC entry 4780 (class 2606 OID 24741)
-- Name: follows follows_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_pkey PRIMARY KEY (follower_id, following_id);


--
-- TOC entry 4776 (class 2606 OID 24706)
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (post_id, user_id);


--
-- TOC entry 4774 (class 2606 OID 24696)
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- TOC entry 4768 (class 2606 OID 24686)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4770 (class 2606 OID 24682)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4772 (class 2606 OID 24684)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4784 (class 2606 OID 24727)
-- Name: comments comments_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- TOC entry 4785 (class 2606 OID 24732)
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4786 (class 2606 OID 24742)
-- Name: follows follows_follower_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4787 (class 2606 OID 24747)
-- Name: follows follows_following_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_following_id_fkey FOREIGN KEY (following_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4782 (class 2606 OID 24707)
-- Name: likes likes_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- TOC entry 4783 (class 2606 OID 24712)
-- Name: likes likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4781 (class 2606 OID 24697)
-- Name: posts posts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2025-12-12 16:24:50

--
-- PostgreSQL database dump complete
--

\unrestrict OryfUD0O4GSY7qNtukV5eeEYOk5UfgGxAib6b5fUFhQquc4nbwzdaDpsmJ1xSrF

