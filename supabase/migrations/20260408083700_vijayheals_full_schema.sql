-- ============================================================
-- VIJAYHEALS — COMPLETE DATABASE SCHEMA
-- All tables, relationships, RLS policies, triggers, mock data
-- ============================================================

-- ─── STEP 1: ENUM TYPES ──────────────────────────────────────

DROP TYPE IF EXISTS public.publish_status CASCADE;
CREATE TYPE public.publish_status AS ENUM ('draft', 'published', 'archived', 'unpublished');

DROP TYPE IF EXISTS public.access_level CASCADE;
CREATE TYPE public.access_level AS ENUM ('free', 'enrolled', 'premium', 'admin');

DROP TYPE IF EXISTS public.lesson_unlock_type CASCADE;
CREATE TYPE public.lesson_unlock_type AS ENUM ('immediate', 'sequential', 'date', 'progress');

DROP TYPE IF EXISTS public.resource_type CASCADE;
CREATE TYPE public.resource_type AS ENUM ('ebook', 'pdf', 'audio', 'video', 'guide', 'worksheet');

DROP TYPE IF EXISTS public.order_status CASCADE;
CREATE TYPE public.order_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

DROP TYPE IF EXISTS public.subscription_status CASCADE;
CREATE TYPE public.subscription_status AS ENUM ('active', 'cancelled', 'expired', 'paused');

DROP TYPE IF EXISTS public.payment_type CASCADE;
CREATE TYPE public.payment_type AS ENUM ('one_time', 'subscription', 'package');

DROP TYPE IF EXISTS public.user_role CASCADE;
CREATE TYPE public.user_role AS ENUM ('admin', 'student', 'guest');

DROP TYPE IF EXISTS public.community_category CASCADE;
CREATE TYPE public.community_category AS ENUM ('Gratitude', 'Good Karma', 'Reflection', 'Healing Win');

DROP TYPE IF EXISTS public.lead_status CASCADE;
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'converted', 'lost');

DROP TYPE IF EXISTS public.enrollment_status CASCADE;
CREATE TYPE public.enrollment_status AS ENUM ('active', 'expired', 'cancelled');

DROP TYPE IF EXISTS public.shipment_status_type CASCADE;
CREATE TYPE public.shipment_status_type AS ENUM ('processing', 'shipped', 'in_transit', 'delivered', 'returned');

-- ─── STEP 2: CORE TABLES (no foreign keys) ───────────────────

-- USER PROFILES (intermediary for auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  role public.user_role NOT NULL DEFAULT 'student'::public.user_role,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- BLOG CATEGORIES
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- BLOG TAGS
CREATE TABLE IF NOT EXISTS public.blog_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SERVICES
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  image_alt TEXT,
  cta_label TEXT NOT NULL DEFAULT 'Learn More',
  cta_href TEXT NOT NULL DEFAULT '/',
  status public.publish_status NOT NULL DEFAULT 'draft'::public.publish_status,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PROGRAMS
CREATE TABLE IF NOT EXISTS public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  long_description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  image_alt TEXT,
  duration TEXT NOT NULL DEFAULT '',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_label TEXT NOT NULL DEFAULT '',
  price_note TEXT,
  alt_price NUMERIC(10,2),
  alt_price_label TEXT,
  payment_type public.payment_type NOT NULL DEFAULT 'one_time'::public.payment_type,
  status public.publish_status NOT NULL DEFAULT 'draft'::public.publish_status,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  outcomes JSONB NOT NULL DEFAULT '[]'::JSONB,
  who_is_it_for JSONB NOT NULL DEFAULT '[]'::JSONB,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- LEADS
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  source TEXT NOT NULL DEFAULT '',
  lead_status public.lead_status NOT NULL DEFAULT 'new'::public.lead_status,
  notes TEXT,
  assigned_to UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TESTIMONIALS
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  avatar_url TEXT,
  content TEXT NOT NULL,
  program_id UUID,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  featured BOOLEAN NOT NULL DEFAULT false,
  status public.publish_status NOT NULL DEFAULT 'draft'::public.publish_status,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FAQS
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  program_id UUID,
  category TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status public.publish_status NOT NULL DEFAULT 'draft'::public.publish_status,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  target_role TEXT NOT NULL DEFAULT 'all',
  status public.publish_status NOT NULL DEFAULT 'draft'::public.publish_status,
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SITE SECTIONS
CREATE TABLE IF NOT EXISTS public.site_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::JSONB,
  status public.publish_status NOT NULL DEFAULT 'published'::public.publish_status,
  updated_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SEO METADATA
CREATE TABLE IF NOT EXISTS public.seo_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── STEP 3: DEPENDENT TABLES ────────────────────────────────

-- COURSES (depends on programs)
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  status public.publish_status NOT NULL DEFAULT 'draft'::public.publish_status,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- MODULES (depends on courses and programs)
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  status public.publish_status NOT NULL DEFAULT 'draft'::public.publish_status,
  focus_area TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- LESSONS (depends on modules, courses, programs)
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  content TEXT,
  video_url TEXT,
  duration TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status public.publish_status NOT NULL DEFAULT 'draft'::public.publish_status,
  access_level public.access_level NOT NULL DEFAULT 'enrolled'::public.access_level,
  unlock_type public.lesson_unlock_type NOT NULL DEFAULT 'sequential'::public.lesson_unlock_type,
  unlock_after_lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  unlock_date TIMESTAMPTZ,
  is_free BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- LESSON ASSETS (depends on lessons)
CREATE TABLE IF NOT EXISTS public.lesson_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  asset_type public.resource_type NOT NULL,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RESOURCES (depends on programs and lessons optionally)
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  cover_image_alt TEXT,
  resource_type public.resource_type NOT NULL,
  file_url TEXT NOT NULL,
  access_level public.access_level NOT NULL DEFAULT 'enrolled'::public.access_level,
  program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  status public.publish_status NOT NULL DEFAULT 'draft'::public.publish_status,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ORDERS (depends on user_profiles and programs)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE RESTRICT,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  order_status public.order_status NOT NULL DEFAULT 'pending'::public.order_status,
  payment_type public.payment_type NOT NULL DEFAULT 'one_time'::public.payment_type,
  payment_provider TEXT,
  payment_ref TEXT,
  coupon_code TEXT,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ENROLLMENTS (depends on user_profiles, programs, orders)
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE RESTRICT,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  enrollment_status public.enrollment_status NOT NULL DEFAULT 'active'::public.enrollment_status,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SUBSCRIPTIONS (depends on user_profiles, programs, orders)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE RESTRICT,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  sub_status public.subscription_status NOT NULL DEFAULT 'active'::public.subscription_status,
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PROGRESS RECORDS (depends on user_profiles, lessons, modules, courses, programs)
CREATE TABLE IF NOT EXISTS public.progress_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  progress_percent INTEGER NOT NULL DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CERTIFICATES (depends on user_profiles and programs)
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE RESTRICT,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  certificate_url TEXT NOT NULL DEFAULT '',
  is_eligible BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- BLOG POSTS (depends on user_profiles and blog_categories)
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  cover_image_alt TEXT,
  author_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL DEFAULT '',
  author_avatar_url TEXT,
  category_id UUID NOT NULL REFERENCES public.blog_categories(id) ON DELETE RESTRICT,
  published_at TIMESTAMPTZ,
  status public.publish_status NOT NULL DEFAULT 'draft'::public.publish_status,
  featured BOOLEAN NOT NULL DEFAULT false,
  word_count INTEGER NOT NULL DEFAULT 0,
  read_time_minutes INTEGER NOT NULL DEFAULT 1,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- COMMUNITY POSTS (depends on user_profiles)
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL DEFAULT '',
  author_avatar_url TEXT,
  category public.community_category NOT NULL DEFAULT 'Gratitude'::public.community_category,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  reactions INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  is_moderated BOOLEAN NOT NULL DEFAULT false,
  status public.publish_status NOT NULL DEFAULT 'published'::public.publish_status,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- COMMUNITY COMMENTS (depends on community_posts and user_profiles)
CREATE TABLE IF NOT EXISTS public.community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL DEFAULT '',
  author_avatar_url TEXT,
  body TEXT NOT NULL,
  reactions INTEGER NOT NULL DEFAULT 0,
  status public.publish_status NOT NULL DEFAULT 'published'::public.publish_status,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SHIPMENT STATUS (depends on user_profiles and orders)
CREATE TABLE IF NOT EXISTS public.shipment_statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  tracking_number TEXT,
  carrier TEXT,
  shipment_status public.shipment_status_type NOT NULL DEFAULT 'processing'::public.shipment_status_type,
  estimated_delivery DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── STEP 4: JUNCTION TABLES ─────────────────────────────────

-- BLOG POST TAGS (many-to-many: blog_posts <-> blog_tags)
CREATE TABLE IF NOT EXISTS public.blog_post_tags (
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- COMMUNITY POST REACTIONS (tracks who reacted to what)
CREATE TABLE IF NOT EXISTS public.community_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.community_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── STEP 5: INDEXES ─────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);

CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(lead_status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);

CREATE INDEX IF NOT EXISTS idx_programs_slug ON public.programs(slug);
CREATE INDEX IF NOT EXISTS idx_programs_status ON public.programs(status);

CREATE INDEX IF NOT EXISTS idx_courses_program_id ON public.courses(program_id);

CREATE INDEX IF NOT EXISTS idx_modules_course_id ON public.modules(course_id);
CREATE INDEX IF NOT EXISTS idx_modules_program_id ON public.modules(program_id);

CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_program_id ON public.lessons(program_id);

CREATE INDEX IF NOT EXISTS idx_resources_program_id ON public.resources(program_id);
CREATE INDEX IF NOT EXISTS idx_resources_access_level ON public.resources(access_level);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_program_id ON public.orders(program_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);

CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_program_id ON public.enrollments(program_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON public.enrollments(enrollment_status);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(sub_status);

CREATE INDEX IF NOT EXISTS idx_progress_user_id ON public.progress_records(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_program_id ON public.progress_records(program_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson_id ON public.progress_records(lesson_id);

CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON public.certificates(user_id);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON public.blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON public.blog_posts(author_id);

CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON public.community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_status ON public.community_posts(status);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON public.community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON public.community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_user_id ON public.community_comments(user_id);

CREATE INDEX IF NOT EXISTS idx_shipments_user_id ON public.shipment_statuses(user_id);
CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON public.shipment_statuses(order_id);

CREATE INDEX IF NOT EXISTS idx_announcements_status ON public.announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcements_target_role ON public.announcements(target_role);

-- Unique index: one progress record per user per lesson
CREATE UNIQUE INDEX IF NOT EXISTS idx_progress_user_lesson ON public.progress_records(user_id, lesson_id);

-- Unique index: one enrollment per user per program
CREATE UNIQUE INDEX IF NOT EXISTS idx_enrollment_user_program ON public.enrollments(user_id, program_id);

-- ─── STEP 6: FUNCTIONS ───────────────────────────────────────

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Handle new auth user → create user_profiles row
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')::public.user_role
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Check if current user is admin (reads from auth metadata — safe for all tables)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND (
      raw_user_meta_data->>'role' = 'admin'
      OR raw_app_meta_data->>'role' = 'admin'
    )
  );
$$;

-- Check if current user is enrolled in a program
CREATE OR REPLACE FUNCTION public.is_enrolled_in_program(p_program_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE user_id = auth.uid()
    AND program_id = p_program_id
    AND enrollment_status = 'active'
  );
$$;

-- Update community_posts.comment_count when a comment is added/deleted
CREATE OR REPLACE FUNCTION public.sync_comment_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts
    SET comment_count = comment_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts
    SET comment_count = GREATEST(comment_count - 1, 0)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$;

-- ─── STEP 7: ENABLE RLS ──────────────────────────────────────

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;

-- ─── STEP 8: RLS POLICIES ────────────────────────────────────

-- USER PROFILES
DROP POLICY IF EXISTS "users_manage_own_profile" ON public.user_profiles;
CREATE POLICY "users_manage_own_profile"
ON public.user_profiles FOR ALL TO authenticated
USING (id = auth.uid()) WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "admin_manage_all_profiles" ON public.user_profiles;
CREATE POLICY "admin_manage_all_profiles"
ON public.user_profiles FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- LEADS (admin only)
DROP POLICY IF EXISTS "admin_manage_leads" ON public.leads;
CREATE POLICY "admin_manage_leads"
ON public.leads FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- SERVICES (public read, admin write)
DROP POLICY IF EXISTS "public_read_services" ON public.services;
CREATE POLICY "public_read_services"
ON public.services FOR SELECT TO public
USING (status = 'published'::public.publish_status);

DROP POLICY IF EXISTS "admin_manage_services" ON public.services;
CREATE POLICY "admin_manage_services"
ON public.services FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- PROGRAMS (public read published, admin manage all)
DROP POLICY IF EXISTS "public_read_programs" ON public.programs;
CREATE POLICY "public_read_programs"
ON public.programs FOR SELECT TO public
USING (status = 'published'::public.publish_status);

DROP POLICY IF EXISTS "admin_manage_programs" ON public.programs;
CREATE POLICY "admin_manage_programs"
ON public.programs FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- COURSES (public read published, admin manage all)
DROP POLICY IF EXISTS "public_read_courses" ON public.courses;
CREATE POLICY "public_read_courses"
ON public.courses FOR SELECT TO public
USING (status = 'published'::public.publish_status);

DROP POLICY IF EXISTS "admin_manage_courses" ON public.courses;
CREATE POLICY "admin_manage_courses"
ON public.courses FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- MODULES (public read published, admin manage all)
DROP POLICY IF EXISTS "public_read_modules" ON public.modules;
CREATE POLICY "public_read_modules"
ON public.modules FOR SELECT TO public
USING (status = 'published'::public.publish_status);

DROP POLICY IF EXISTS "admin_manage_modules" ON public.modules;
CREATE POLICY "admin_manage_modules"
ON public.modules FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- LESSONS (free lessons public, enrolled lessons for enrolled users, admin all)
DROP POLICY IF EXISTS "public_read_free_lessons" ON public.lessons;
CREATE POLICY "public_read_free_lessons"
ON public.lessons FOR SELECT TO public
USING (is_free = true AND status = 'published'::public.publish_status);

DROP POLICY IF EXISTS "enrolled_read_lessons" ON public.lessons;
CREATE POLICY "enrolled_read_lessons"
ON public.lessons FOR SELECT TO authenticated
USING (status = 'published'::public.publish_status AND public.is_enrolled_in_program(program_id));

DROP POLICY IF EXISTS "admin_manage_lessons" ON public.lessons;
CREATE POLICY "admin_manage_lessons"
ON public.lessons FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- LESSON ASSETS (same access as lessons)
DROP POLICY IF EXISTS "public_read_lesson_assets" ON public.lesson_assets;
CREATE POLICY "public_read_lesson_assets"
ON public.lesson_assets FOR SELECT TO public
USING (true);

DROP POLICY IF EXISTS "admin_manage_lesson_assets" ON public.lesson_assets;
CREATE POLICY "admin_manage_lesson_assets"
ON public.lesson_assets FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- RESOURCES (free public, enrolled for enrolled users, admin all)
DROP POLICY IF EXISTS "public_read_free_resources" ON public.resources;
CREATE POLICY "public_read_free_resources"
ON public.resources FOR SELECT TO public
USING (access_level = 'free'::public.access_level AND status = 'published'::public.publish_status);

DROP POLICY IF EXISTS "enrolled_read_resources" ON public.resources;
CREATE POLICY "enrolled_read_resources"
ON public.resources FOR SELECT TO authenticated
USING (
  status = 'published'::public.publish_status
  AND (
    access_level = 'free'::public.access_level
    OR (program_id IS NOT NULL AND public.is_enrolled_in_program(program_id))
    OR public.is_admin()
  )
);

DROP POLICY IF EXISTS "admin_manage_resources" ON public.resources;
CREATE POLICY "admin_manage_resources"
ON public.resources FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ORDERS (users see own, admin sees all)
DROP POLICY IF EXISTS "users_read_own_orders" ON public.orders;
CREATE POLICY "users_read_own_orders"
ON public.orders FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "users_create_own_orders" ON public.orders;
CREATE POLICY "users_create_own_orders"
ON public.orders FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "admin_manage_orders" ON public.orders;
CREATE POLICY "admin_manage_orders"
ON public.orders FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ENROLLMENTS (users see own, admin sees all)
DROP POLICY IF EXISTS "users_read_own_enrollments" ON public.enrollments;
CREATE POLICY "users_read_own_enrollments"
ON public.enrollments FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "admin_manage_enrollments" ON public.enrollments;
CREATE POLICY "admin_manage_enrollments"
ON public.enrollments FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- SUBSCRIPTIONS (users see own, admin sees all)
DROP POLICY IF EXISTS "users_read_own_subscriptions" ON public.subscriptions;
CREATE POLICY "users_read_own_subscriptions"
ON public.subscriptions FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "admin_manage_subscriptions" ON public.subscriptions;
CREATE POLICY "admin_manage_subscriptions"
ON public.subscriptions FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- PROGRESS RECORDS (users manage own, admin sees all)
DROP POLICY IF EXISTS "users_manage_own_progress" ON public.progress_records;
CREATE POLICY "users_manage_own_progress"
ON public.progress_records FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "admin_read_all_progress" ON public.progress_records;
CREATE POLICY "admin_read_all_progress"
ON public.progress_records FOR SELECT TO authenticated
USING (public.is_admin());

-- CERTIFICATES (users see own, admin sees all)
DROP POLICY IF EXISTS "users_read_own_certificates" ON public.certificates;
CREATE POLICY "users_read_own_certificates"
ON public.certificates FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "admin_manage_certificates" ON public.certificates;
CREATE POLICY "admin_manage_certificates"
ON public.certificates FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- BLOG CATEGORIES (public read, admin manage)
DROP POLICY IF EXISTS "public_read_blog_categories" ON public.blog_categories;
CREATE POLICY "public_read_blog_categories"
ON public.blog_categories FOR SELECT TO public
USING (true);

DROP POLICY IF EXISTS "admin_manage_blog_categories" ON public.blog_categories;
CREATE POLICY "admin_manage_blog_categories"
ON public.blog_categories FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- BLOG TAGS (public read, admin manage)
DROP POLICY IF EXISTS "public_read_blog_tags" ON public.blog_tags;
CREATE POLICY "public_read_blog_tags"
ON public.blog_tags FOR SELECT TO public
USING (true);

DROP POLICY IF EXISTS "admin_manage_blog_tags" ON public.blog_tags;
CREATE POLICY "admin_manage_blog_tags"
ON public.blog_tags FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- BLOG POSTS (public read published, admin manage all)
DROP POLICY IF EXISTS "public_read_published_posts" ON public.blog_posts;
CREATE POLICY "public_read_published_posts"
ON public.blog_posts FOR SELECT TO public
USING (status = 'published'::public.publish_status);

DROP POLICY IF EXISTS "admin_manage_blog_posts" ON public.blog_posts;
CREATE POLICY "admin_manage_blog_posts"
ON public.blog_posts FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- BLOG POST TAGS (public read, admin manage)
DROP POLICY IF EXISTS "public_read_blog_post_tags" ON public.blog_post_tags;
CREATE POLICY "public_read_blog_post_tags"
ON public.blog_post_tags FOR SELECT TO public
USING (true);

DROP POLICY IF EXISTS "admin_manage_blog_post_tags" ON public.blog_post_tags;
CREATE POLICY "admin_manage_blog_post_tags"
ON public.blog_post_tags FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- TESTIMONIALS (public read published, admin manage)
DROP POLICY IF EXISTS "public_read_testimonials" ON public.testimonials;
CREATE POLICY "public_read_testimonials"
ON public.testimonials FOR SELECT TO public
USING (status = 'published'::public.publish_status);

DROP POLICY IF EXISTS "admin_manage_testimonials" ON public.testimonials;
CREATE POLICY "admin_manage_testimonials"
ON public.testimonials FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- FAQS (public read published, admin manage)
DROP POLICY IF EXISTS "public_read_faqs" ON public.faqs;
CREATE POLICY "public_read_faqs"
ON public.faqs FOR SELECT TO public
USING (status = 'published'::public.publish_status);

DROP POLICY IF EXISTS "admin_manage_faqs" ON public.faqs;
CREATE POLICY "admin_manage_faqs"
ON public.faqs FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ANNOUNCEMENTS (authenticated read active, admin manage)
DROP POLICY IF EXISTS "auth_read_announcements" ON public.announcements;
CREATE POLICY "auth_read_announcements"
ON public.announcements FOR SELECT TO authenticated
USING (
  status = 'published'::public.publish_status
  AND (expires_at IS NULL OR expires_at > NOW())
);

DROP POLICY IF EXISTS "admin_manage_announcements" ON public.announcements;
CREATE POLICY "admin_manage_announcements"
ON public.announcements FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- COMMUNITY POSTS (enrolled users read/write own, admin manage all)
DROP POLICY IF EXISTS "enrolled_read_community_posts" ON public.community_posts;
CREATE POLICY "enrolled_read_community_posts"
ON public.community_posts FOR SELECT TO authenticated
USING (status = 'published'::public.publish_status OR user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "enrolled_create_community_posts" ON public.community_posts;
CREATE POLICY "enrolled_create_community_posts"
ON public.community_posts FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_update_own_community_posts" ON public.community_posts;
CREATE POLICY "users_update_own_community_posts"
ON public.community_posts FOR UPDATE TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "admin_manage_community_posts" ON public.community_posts;
CREATE POLICY "admin_manage_community_posts"
ON public.community_posts FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- COMMUNITY COMMENTS (authenticated read, users manage own, admin all)
DROP POLICY IF EXISTS "auth_read_community_comments" ON public.community_comments;
CREATE POLICY "auth_read_community_comments"
ON public.community_comments FOR SELECT TO authenticated
USING (status = 'published'::public.publish_status OR user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "users_create_community_comments" ON public.community_comments;
CREATE POLICY "users_create_community_comments"
ON public.community_comments FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_update_own_community_comments" ON public.community_comments;
CREATE POLICY "users_update_own_community_comments"
ON public.community_comments FOR UPDATE TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "admin_manage_community_comments" ON public.community_comments;
CREATE POLICY "admin_manage_community_comments"
ON public.community_comments FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- COMMUNITY REACTIONS (users manage own)
DROP POLICY IF EXISTS "users_manage_own_reactions" ON public.community_reactions;
CREATE POLICY "users_manage_own_reactions"
ON public.community_reactions FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "admin_manage_reactions" ON public.community_reactions;
CREATE POLICY "admin_manage_reactions"
ON public.community_reactions FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- SHIPMENT STATUSES (users see own, admin all)
DROP POLICY IF EXISTS "users_read_own_shipments" ON public.shipment_statuses;
CREATE POLICY "users_read_own_shipments"
ON public.shipment_statuses FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "admin_manage_shipments" ON public.shipment_statuses;
CREATE POLICY "admin_manage_shipments"
ON public.shipment_statuses FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- SITE SECTIONS (public read published, admin manage)
DROP POLICY IF EXISTS "public_read_site_sections" ON public.site_sections;
CREATE POLICY "public_read_site_sections"
ON public.site_sections FOR SELECT TO public
USING (status = 'published'::public.publish_status);

DROP POLICY IF EXISTS "admin_manage_site_sections" ON public.site_sections;
CREATE POLICY "admin_manage_site_sections"
ON public.site_sections FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- SEO METADATA (public read, admin manage)
DROP POLICY IF EXISTS "public_read_seo_metadata" ON public.seo_metadata;
CREATE POLICY "public_read_seo_metadata"
ON public.seo_metadata FOR SELECT TO public
USING (true);

DROP POLICY IF EXISTS "admin_manage_seo_metadata" ON public.seo_metadata;
CREATE POLICY "admin_manage_seo_metadata"
ON public.seo_metadata FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ─── STEP 9: TRIGGERS ────────────────────────────────────────

-- Auth user created → create user_profiles row
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto update updated_at on all relevant tables
DROP TRIGGER IF EXISTS set_updated_at_user_profiles ON public.user_profiles;
CREATE TRIGGER set_updated_at_user_profiles
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_services ON public.services;
CREATE TRIGGER set_updated_at_services
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_programs ON public.programs;
CREATE TRIGGER set_updated_at_programs
  BEFORE UPDATE ON public.programs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_courses ON public.courses;
CREATE TRIGGER set_updated_at_courses
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_modules ON public.modules;
CREATE TRIGGER set_updated_at_modules
  BEFORE UPDATE ON public.modules
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_lessons ON public.lessons;
CREATE TRIGGER set_updated_at_lessons
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_resources ON public.resources;
CREATE TRIGGER set_updated_at_resources
  BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_orders ON public.orders;
CREATE TRIGGER set_updated_at_orders
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_enrollments ON public.enrollments;
CREATE TRIGGER set_updated_at_enrollments
  BEFORE UPDATE ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_progress ON public.progress_records;
CREATE TRIGGER set_updated_at_progress
  BEFORE UPDATE ON public.progress_records
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_blog_posts ON public.blog_posts;
CREATE TRIGGER set_updated_at_blog_posts
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_community_posts ON public.community_posts;
CREATE TRIGGER set_updated_at_community_posts
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_community_comments ON public.community_comments;
CREATE TRIGGER set_updated_at_community_comments
  BEFORE UPDATE ON public.community_comments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Sync comment count on community posts
DROP TRIGGER IF EXISTS sync_comment_count_insert ON public.community_comments;
CREATE TRIGGER sync_comment_count_insert
  AFTER INSERT ON public.community_comments
  FOR EACH ROW EXECUTE FUNCTION public.sync_comment_count();

DROP TRIGGER IF EXISTS sync_comment_count_delete ON public.community_comments;
CREATE TRIGGER sync_comment_count_delete
  AFTER DELETE ON public.community_comments
  FOR EACH ROW EXECUTE FUNCTION public.sync_comment_count();

-- ─── STEP 10: MOCK DATA ──────────────────────────────────────

DO $$
DECLARE
  admin_uuid UUID := gen_random_uuid();
  student1_uuid UUID := gen_random_uuid();
  student2_uuid UUID := gen_random_uuid();
  prog_awareness_id UUID := gen_random_uuid();
  prog_foundation_id UUID := gen_random_uuid();
  prog_mastery_id UUID := gen_random_uuid();
  course_awareness_id UUID := gen_random_uuid();
  course_foundation_id UUID := gen_random_uuid();
  course_mastery1_id UUID := gen_random_uuid();
  course_mastery2_id UUID := gen_random_uuid();
  course_mastery3_id UUID := gen_random_uuid();
  mod_aw1_id UUID := gen_random_uuid();
  mod_aw2_id UUID := gen_random_uuid();
  mod_fd1_id UUID := gen_random_uuid();
  mod_fd2_id UUID := gen_random_uuid();
  mod_m1_1_id UUID := gen_random_uuid();
  mod_m1_2_id UUID := gen_random_uuid();
  les_aw1_id UUID := gen_random_uuid();
  les_aw2_id UUID := gen_random_uuid();
  les_fd1_id UUID := gen_random_uuid();
  les_fd2_id UUID := gen_random_uuid();
  les_m1_1_id UUID := gen_random_uuid();
  les_m1_2_id UUID := gen_random_uuid();
  order1_id UUID := gen_random_uuid();
  order2_id UUID := gen_random_uuid();
  order3_id UUID := gen_random_uuid();
  cat_nat_id UUID := gen_random_uuid();
  cat_nut_id UUID := gen_random_uuid();
  cat_breath_id UUID := gen_random_uuid();
  cat_emotion_id UUID := gen_random_uuid();
  cat_stories_id UUID := gen_random_uuid();
  post1_id UUID := gen_random_uuid();
  post2_id UUID := gen_random_uuid();
  cp1_id UUID := gen_random_uuid();
  cp2_id UUID := gen_random_uuid();
BEGIN

  -- ── AUTH USERS ──────────────────────────────────────────────
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
    is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
    recovery_token, recovery_sent_at, email_change_token_new, email_change,
    email_change_sent_at, email_change_token_current, email_change_confirm_status,
    reauthentication_token, reauthentication_sent_at, phone, phone_change,
    phone_change_token, phone_change_sent_at
  ) VALUES
    (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'admin@vijayheals.com', crypt('admin123', gen_salt('bf', 10)), NOW(), NOW(), NOW(),
     jsonb_build_object('full_name', 'Dr. Vijay Singla', 'role', 'admin'),
     jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
     false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
    (student1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'priya@vijayheals.com', crypt('student123', gen_salt('bf', 10)), NOW(), NOW(), NOW(),
     jsonb_build_object('full_name', 'Priya Sharma', 'role', 'student'),
     jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
     false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
    (student2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'arjun@vijayheals.com', crypt('student123', gen_salt('bf', 10)), NOW(), NOW(), NOW(),
     jsonb_build_object('full_name', 'Arjun Mehta', 'role', 'student'),
     jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
     false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null)
  ON CONFLICT (id) DO NOTHING;

  -- ── PROGRAMS ────────────────────────────────────────────────
  INSERT INTO public.programs (id, title, slug, tagline, description, long_description, duration, price, price_label, price_note, payment_type, status, featured, sort_order, outcomes, who_is_it_for) VALUES
    (prog_awareness_id, 'Awareness Session', 'awareness-session', 'Your first step into natural healing',
     'A free 1-hour live session that introduces you to naturopathy, Dr. Vijay''s healing philosophy, and the transformation pathway.',
     'The Awareness Session is the entry point to the VijayHeals ecosystem. In this free, live 1-hour session, Dr. Vijay Singla introduces the foundational principles of naturopathy.',
     '1 hour', 0, 'Free', 'No credit card required', 'one_time'::public.payment_type, 'published'::public.publish_status, true, 1,
     '["Understand why your body holds illness","Learn the 3-stage healing pathway","Discover your primary healing blocks"]'::JSONB,
     '["Anyone curious about natural healing","People who have tried conventional medicine without lasting results"]'::JSONB),
    (prog_foundation_id, 'Foundation Course', 'foundation-course', 'Reset your body in 3 days',
     'A 3-day intensive that resets your physical and energetic body. 1 hour per day, structured for lasting impact.',
     'The Foundation Course is the implementation phase of your healing journey. Over 3 focused days, Dr. Vijay Singla guides you through a systematic reset.',
     '3 days · 1 hour/day', 999, '₹999', 'One-time payment', 'one_time'::public.payment_type, 'published'::public.publish_status, true, 2,
     '["Reset your digestive and nervous system","Establish a daily healing practice","Clear energetic blockages from the body"]'::JSONB,
     '["Students who have completed the Awareness Session","Those ready to move from understanding to practice"]'::JSONB),
    (prog_mastery_id, 'Transformation Mastery', 'transformation-mastery', 'Deep healing over 3 months',
     'The flagship 3-month program for complete physical, emotional, and energetic transformation under Dr. Vijay''s direct guidance.',
     'Transformation Mastery is the complete healing journey — a 3-month guided program that takes you from surface-level wellness into deep, lasting transformation.',
     '3 months', 2499, '₹2,499/month', 'Cancel anytime', 'subscription'::public.payment_type, 'published'::public.publish_status, true, 3,
     '["Complete physical and energetic reset","Emotional pattern resolution","Sustainable daily healing practices","Community and ongoing support","Certificate of completion"]'::JSONB,
     '["Students who have completed the Foundation Course","Those committed to deep, lasting transformation"]'::JSONB)
  ON CONFLICT (id) DO NOTHING;

  -- ── COURSES ─────────────────────────────────────────────────
  INSERT INTO public.courses (id, program_id, title, description, sort_order, status) VALUES
    (course_awareness_id, prog_awareness_id, 'Naturopathy Fundamentals', 'Core principles of natural healing', 1, 'published'::public.publish_status),
    (course_foundation_id, prog_foundation_id, 'The 3-Day Body Reset', 'Systematic physical and energetic reset', 1, 'published'::public.publish_status),
    (course_mastery1_id, prog_mastery_id, 'Month 1: Physical Foundation', 'Building the physical healing base', 1, 'published'::public.publish_status),
    (course_mastery2_id, prog_mastery_id, 'Month 2: Emotional Clearing', 'Processing and releasing emotional patterns', 2, 'published'::public.publish_status),
    (course_mastery3_id, prog_mastery_id, 'Month 3: Energetic Integration', 'Integrating all healing dimensions', 3, 'published'::public.publish_status)
  ON CONFLICT (id) DO NOTHING;

  -- ── MODULES ─────────────────────────────────────────────────
  INSERT INTO public.modules (id, course_id, program_id, title, description, sort_order, status, focus_area) VALUES
    (mod_aw1_id, course_awareness_id, prog_awareness_id, 'Why the Body Holds Illness', 'Understanding the root causes of physical and emotional blockages', 1, 'published'::public.publish_status, 'Understanding'),
    (mod_aw2_id, course_awareness_id, prog_awareness_id, 'The Healing Pathway Explained', 'The 3-stage journey from awareness to transformation', 2, 'published'::public.publish_status, 'Pathway'),
    (mod_fd1_id, course_foundation_id, prog_foundation_id, 'Day 1: Digestive Reset', 'Clearing the gut and establishing clean nutrition', 1, 'published'::public.publish_status, 'Physical'),
    (mod_fd2_id, course_foundation_id, prog_foundation_id, 'Day 2: Breath & Nervous System', 'Regulating the nervous system through breathwork', 2, 'published'::public.publish_status, 'Breath'),
    (mod_m1_1_id, course_mastery1_id, prog_mastery_id, 'Physical Body Audit', 'Comprehensive assessment of physical health patterns', 1, 'published'::public.publish_status, 'Body'),
    (mod_m1_2_id, course_mastery1_id, prog_mastery_id, 'Nutrition as Medicine', 'Food as the primary healing tool', 2, 'published'::public.publish_status, 'Nutrition')
  ON CONFLICT (id) DO NOTHING;

  -- ── LESSONS ─────────────────────────────────────────────────
  INSERT INTO public.lessons (id, module_id, course_id, program_id, title, description, sort_order, status, access_level, unlock_type, is_free, duration) VALUES
    (les_aw1_id, mod_aw1_id, course_awareness_id, prog_awareness_id, 'The Root Cause Framework', 'Why symptoms are signals, not the problem', 1, 'published'::public.publish_status, 'free'::public.access_level, 'immediate'::public.lesson_unlock_type, true, '18 min'),
    (les_aw2_id, mod_aw1_id, course_awareness_id, prog_awareness_id, 'Emotional Patterns & Physical Illness', 'The mind-body connection in naturopathy', 2, 'published'::public.publish_status, 'free'::public.access_level, 'sequential'::public.lesson_unlock_type, true, '22 min'),
    (les_fd1_id, mod_fd1_id, course_foundation_id, prog_foundation_id, 'Morning Reset Protocol', 'Starting Day 1 with intention and clarity', 1, 'published'::public.publish_status, 'enrolled'::public.access_level, 'immediate'::public.lesson_unlock_type, false, '35 min'),
    (les_fd2_id, mod_fd1_id, course_foundation_id, prog_foundation_id, 'Gut Healing Foods', 'What to eat and what to eliminate on Day 1', 2, 'published'::public.publish_status, 'enrolled'::public.access_level, 'sequential'::public.lesson_unlock_type, false, '28 min'),
    (les_m1_1_id, mod_m1_1_id, course_mastery1_id, prog_mastery_id, 'Your Physical Body Audit', 'Comprehensive self-assessment for Month 1', 1, 'published'::public.publish_status, 'enrolled'::public.access_level, 'immediate'::public.lesson_unlock_type, false, '45 min'),
    (les_m1_2_id, mod_m1_2_id, course_mastery1_id, prog_mastery_id, 'The Healing Kitchen', 'Building your naturopathic food environment', 1, 'published'::public.publish_status, 'enrolled'::public.access_level, 'sequential'::public.lesson_unlock_type, false, '50 min')
  ON CONFLICT (id) DO NOTHING;

  -- Update sequential unlock references
  UPDATE public.lessons SET unlock_after_lesson_id = les_aw1_id WHERE id = les_aw2_id;
  UPDATE public.lessons SET unlock_after_lesson_id = les_fd1_id WHERE id = les_fd2_id;
  UPDATE public.lessons SET unlock_after_lesson_id = les_m1_1_id WHERE id = les_m1_2_id;

  -- ── RESOURCES ───────────────────────────────────────────────
  INSERT INTO public.resources (title, description, resource_type, file_url, access_level, program_id, featured, status, sort_order) VALUES
    ('The Healing Kitchen Guide', 'A comprehensive guide to naturopathic nutrition and food as medicine', 'ebook'::public.resource_type, '#', 'enrolled'::public.access_level, prog_foundation_id, true, 'published'::public.publish_status, 1),
    ('Daily Breathwork Sequences', 'Audio-guided pranayama practices for morning and evening', 'audio'::public.resource_type, '#', 'enrolled'::public.access_level, prog_foundation_id, true, 'published'::public.publish_status, 2),
    ('Emotional Body Map Worksheet', 'A reflective worksheet to identify where emotions live in your body', 'worksheet'::public.resource_type, '#', 'enrolled'::public.access_level, prog_mastery_id, true, 'published'::public.publish_status, 3),
    ('Sleep Optimisation Protocol', 'A step-by-step guide to restorative sleep through naturopathic practices', 'pdf'::public.resource_type, '#', 'enrolled'::public.access_level, prog_mastery_id, false, 'published'::public.publish_status, 4),
    ('Awareness Session Workbook', 'Companion workbook for the free Awareness Session', 'pdf'::public.resource_type, '#', 'free'::public.access_level, prog_awareness_id, false, 'published'::public.publish_status, 5)
  ON CONFLICT (id) DO NOTHING;

  -- ── SERVICES ────────────────────────────────────────────────
  INSERT INTO public.services (title, slug, summary, description, cta_label, cta_href, status, featured, sort_order) VALUES
    ('One-on-One Naturopathy Consultation', 'one-on-one-consultation', 'A private, in-depth session with Dr. Vijay Singla to assess your unique healing needs.', 'In this 60-minute private consultation, Dr. Vijay Singla conducts a comprehensive assessment of your physical, emotional, and energetic state.', 'Book a Consultation', '/awareness-session', 'published'::public.publish_status, true, 1),
    ('Group Healing Circles', 'group-healing-circles', 'Monthly group sessions focused on collective healing, breathwork, and energy alignment.', 'These intimate group sessions bring together a small cohort of students for guided breathwork, shared reflection, and collective energy practices.', 'Join the Next Circle', '/awareness-session', 'published'::public.publish_status, true, 2),
    ('Corporate Wellness Programs', 'corporate-wellness', 'Structured wellness programs designed for teams and organisations seeking sustainable health.', 'Tailored for organisations, these programs introduce naturopathic principles into the workplace.', 'Enquire for Your Team', '/awareness-session', 'published'::public.publish_status, false, 3)
  ON CONFLICT (id) DO NOTHING;

  -- ── LEADS ───────────────────────────────────────────────────
  INSERT INTO public.leads (name, email, phone, source, lead_status) VALUES
    ('Sunita Kapoor', 'sunita@example.com', '+91 99001 23456', 'Awareness Session', 'new'::public.lead_status),
    ('Rahul Verma', 'rahul@example.com', '+91 88001 23456', 'Blog', 'contacted'::public.lead_status),
    ('Meena Joshi', 'meena@example.com', null, 'Referral', 'converted'::public.lead_status),
    ('Deepak Nair', 'deepak@example.com', '+91 77001 23456', 'Instagram', 'new'::public.lead_status)
  ON CONFLICT (id) DO NOTHING;

  -- ── ORDERS ──────────────────────────────────────────────────
  INSERT INTO public.orders (id, user_id, program_id, amount, currency, order_status, payment_type) VALUES
    (order1_id, student1_uuid, prog_mastery_id, 2499, 'INR', 'paid'::public.order_status, 'subscription'::public.payment_type),
    (order2_id, student1_uuid, prog_foundation_id, 999, 'INR', 'paid'::public.order_status, 'one_time'::public.payment_type),
    (order3_id, student2_uuid, prog_foundation_id, 999, 'INR', 'paid'::public.order_status, 'one_time'::public.payment_type)
  ON CONFLICT (id) DO NOTHING;

  -- ── ENROLLMENTS ─────────────────────────────────────────────
  INSERT INTO public.enrollments (user_id, program_id, order_id, enrolled_at, enrollment_status) VALUES
    (student1_uuid, prog_mastery_id, order1_id, NOW() - INTERVAL '83 days', 'active'::public.enrollment_status),
    (student1_uuid, prog_foundation_id, order2_id, NOW() - INTERVAL '128 days', 'active'::public.enrollment_status),
    (student2_uuid, prog_foundation_id, order3_id, NOW() - INTERVAL '57 days', 'active'::public.enrollment_status)
  ON CONFLICT DO NOTHING;

  -- ── SUBSCRIPTIONS ───────────────────────────────────────────
  INSERT INTO public.subscriptions (user_id, program_id, order_id, sub_status, current_period_start, current_period_end) VALUES
    (student1_uuid, prog_mastery_id, order1_id, 'active'::public.subscription_status, NOW() - INTERVAL '30 days', NOW() + INTERVAL '30 days')
  ON CONFLICT (id) DO NOTHING;

  -- ── PROGRESS RECORDS ────────────────────────────────────────
  INSERT INTO public.progress_records (user_id, lesson_id, module_id, course_id, program_id, is_completed, progress_percent, completed_at, last_accessed_at) VALUES
    (student1_uuid, les_m1_1_id, mod_m1_1_id, course_mastery1_id, prog_mastery_id, true, 100, NOW() - INTERVAL '70 days', NOW() - INTERVAL '70 days'),
    (student1_uuid, les_m1_2_id, mod_m1_2_id, course_mastery1_id, prog_mastery_id, true, 100, NOW() - INTERVAL '63 days', NOW() - INTERVAL '63 days'),
    (student1_uuid, les_fd1_id, mod_fd1_id, course_foundation_id, prog_foundation_id, true, 100, NOW() - INTERVAL '125 days', NOW() - INTERVAL '125 days'),
    (student2_uuid, les_fd1_id, mod_fd1_id, course_foundation_id, prog_foundation_id, true, 100, NOW() - INTERVAL '50 days', NOW() - INTERVAL '50 days')
  ON CONFLICT (user_id, lesson_id) DO NOTHING;

  -- ── CERTIFICATES ────────────────────────────────────────────
  INSERT INTO public.certificates (user_id, program_id, issued_at, certificate_url, is_eligible) VALUES
    (student1_uuid, prog_foundation_id, NOW() - INTERVAL '115 days', '#', true)
  ON CONFLICT (id) DO NOTHING;

  -- ── BLOG CATEGORIES ─────────────────────────────────────────
  INSERT INTO public.blog_categories (id, name, slug, description, sort_order) VALUES
    (cat_nat_id, 'Naturopathy Basics', 'naturopathy-basics', 'Foundational principles of natural healing', 1),
    (cat_nut_id, 'Healing Nutrition', 'healing-nutrition', 'Food as medicine and naturopathic diet', 2),
    (cat_breath_id, 'Breathwork & Energy', 'breathwork-energy', 'Pranayama, energy practices, and vitality', 3),
    (cat_emotion_id, 'Emotional Healing', 'emotional-healing', 'Mind-body connection and emotional wellness', 4),
    (cat_stories_id, 'Student Stories', 'student-stories', 'Transformation journeys from our community', 5)
  ON CONFLICT (id) DO NOTHING;

  -- ── BLOG TAGS ───────────────────────────────────────────────
  INSERT INTO public.blog_tags (name, slug) VALUES
    ('Gut Health', 'gut-health'),
    ('Breathwork', 'breathwork'),
    ('Sleep', 'sleep'),
    ('Detox', 'detox'),
    ('Stress', 'stress'),
    ('Immunity', 'immunity'),
    ('Transformation', 'transformation')
  ON CONFLICT (slug) DO NOTHING;

  -- ── BLOG POSTS ──────────────────────────────────────────────
  INSERT INTO public.blog_posts (id, title, slug, excerpt, body, author_id, author_name, category_id, published_at, status, featured, word_count, read_time_minutes, seo_title, seo_description) VALUES
    (post1_id, 'Why Your Body Holds Illness: The Naturopathic Perspective', 'why-body-holds-illness-naturopathic-perspective',
     'Most people treat symptoms. Naturopathy asks a different question: why is the body creating this symptom in the first place?',
     'The symptom is a signal, not the problem. Your body is extraordinarily intelligent and does not create pain or dysfunction randomly.',
     admin_uuid, 'Dr. Vijay Singla', cat_nat_id, NOW() - INTERVAL '24 days', 'published'::public.publish_status, true, 380, 2,
     'Why Your Body Holds Illness — Naturopathic Perspective | VijayHeals',
     'Discover why naturopathy treats the root cause of illness, not just symptoms.'),
    (post2_id, 'The Healing Power of Conscious Breathing', 'healing-power-conscious-breathing',
     'Breath is the one physiological function that bridges the conscious and unconscious mind.',
     'Of all the healing practices available to us, conscious breathing is perhaps the most immediate and accessible.',
     admin_uuid, 'Dr. Vijay Singla', cat_breath_id, NOW() - INTERVAL '17 days', 'published'::public.publish_status, false, 340, 2,
     'The Healing Power of Conscious Breathing | VijayHeals',
     'Learn how breathwork activates the parasympathetic nervous system and accelerates healing.')
  ON CONFLICT (id) DO NOTHING;

  -- ── TESTIMONIALS ────────────────────────────────────────────
  INSERT INTO public.testimonials (name, role, content, program_id, rating, featured, status, sort_order) VALUES
    ('Priya Sharma', 'Transformation Mastery Graduate', 'I had been dealing with chronic fatigue for 8 years. After 3 months with Dr. Vijay, I have more energy than I did in my twenties. This program changed my life.', prog_mastery_id, 5, true, 'published'::public.publish_status, 1),
    ('Arjun Mehta', 'Foundation Course Graduate', 'The 3-day reset was exactly what I needed. I came in skeptical and left with a completely different relationship with my body.', prog_foundation_id, 5, true, 'published'::public.publish_status, 2),
    ('Sunita Kapoor', 'Transformation Mastery Student', 'Dr. Vijay''s approach is unlike anything I''ve experienced. He does not just treat symptoms — he helps you understand your body at a level that creates lasting change.', prog_mastery_id, 5, true, 'published'::public.publish_status, 3)
  ON CONFLICT (id) DO NOTHING;

  -- ── FAQS ────────────────────────────────────────────────────
  INSERT INTO public.faqs (question, answer, sort_order, status) VALUES
    ('What is naturopathy?', 'Naturopathy is a system of healthcare that uses natural therapies to support the body''s innate healing capacity. It treats the whole person, not just symptoms.', 1, 'published'::public.publish_status),
    ('Is the Awareness Session really free?', 'Yes, completely free. No credit card required. The Awareness Session is Dr. Vijay''s gift to anyone seeking clarity about their health.', 2, 'published'::public.publish_status),
    ('Can I cancel the monthly Mastery subscription?', 'Yes, you can cancel at any time. Your access continues until the end of the current billing period. There are no cancellation fees.', 3, 'published'::public.publish_status)
  ON CONFLICT (id) DO NOTHING;

  -- ── ANNOUNCEMENTS ───────────────────────────────────────────
  INSERT INTO public.announcements (title, body, target_role, status, published_at, expires_at, created_by) VALUES
    ('April Awareness Session — Register Now', 'The next free Awareness Session is on April 12, 2026. Limited spots available. Register at the link below.', 'all', 'published'::public.publish_status, NOW() - INTERVAL '7 days', NOW() + INTERVAL '4 days', admin_uuid),
    ('New Resource Added: Sleep Optimisation Protocol', 'A new PDF resource has been added to the Resource Vault for all enrolled students.', 'student', 'published'::public.publish_status, NOW() - INTERVAL '14 days', null, admin_uuid)
  ON CONFLICT (id) DO NOTHING;

  -- ── COMMUNITY POSTS ─────────────────────────────────────────
  INSERT INTO public.community_posts (id, user_id, author_name, category, title, body, reactions, comment_count, is_pinned, status) VALUES
    (cp1_id, student1_uuid, 'Priya S.', 'Healing Win'::public.community_category, 'First full night of sleep in 3 years',
     'After implementing the sleep protocol from Month 1, I slept through the night for the first time in years. I woke up and cried. This is what healing feels like.',
     47, 12, true, 'published'::public.publish_status),
    (cp2_id, student2_uuid, 'Arjun M.', 'Gratitude'::public.community_category, 'Grateful for this community',
     'Three months ago I was skeptical about online healing programs. Today I am writing this with a body that feels genuinely different. Thank you Dr. Vijay and everyone here.',
     38, 8, false, 'published'::public.publish_status)
  ON CONFLICT (id) DO NOTHING;

  -- ── COMMUNITY COMMENTS ──────────────────────────────────────
  INSERT INTO public.community_comments (post_id, user_id, author_name, body, reactions, status) VALUES
    (cp1_id, student2_uuid, 'Arjun M.', 'This made me tear up. So happy for you, Priya!', 5, 'published'::public.publish_status),
    (cp2_id, student1_uuid, 'Priya S.', 'You have come so far. This community is everything.', 8, 'published'::public.publish_status)
  ON CONFLICT (id) DO NOTHING;

  -- ── SHIPMENTS ───────────────────────────────────────────────
  INSERT INTO public.shipment_statuses (user_id, order_id, product_name, tracking_number, carrier, shipment_status, estimated_delivery) VALUES
    (student1_uuid, order1_id, 'Healing Guide Book', 'IND123456789', 'India Post', 'in_transit'::public.shipment_status_type, CURRENT_DATE + INTERVAL '2 days')
  ON CONFLICT (id) DO NOTHING;

  -- ── SITE SECTIONS ───────────────────────────────────────────
  INSERT INTO public.site_sections (section_key, label, content, status) VALUES
    ('homepage_hero', 'Homepage Hero', jsonb_build_object(
      'headline', 'Heal from within.',
      'subheadline', 'Naturally.',
      'body', 'Dr. Vijay Singla guides you through a structured healing pathway — grounded in naturopathy, designed for lasting transformation.',
      'primaryCta', 'Join the Free Awareness Session',
      'secondaryCta', 'Explore the Journey'
    ), 'published'::public.publish_status),
    ('homepage_about', 'Homepage About Section', jsonb_build_object(
      'headline', 'A different kind of healer',
      'body', 'Dr. Vijay Singla has spent 12 years in clinical naturopathic practice, guiding over 2,400 students through structured healing journeys.',
      'yearsExperience', '12',
      'studentsHealed', '2,400+',
      'completionRate', '94%'
    ), 'published'::public.publish_status)
  ON CONFLICT (section_key) DO NOTHING;

  -- ── SEO METADATA ────────────────────────────────────────────
  INSERT INTO public.seo_metadata (page_key, title, description, keywords, og_title, og_description) VALUES
    ('homepage', 'VijayHeals — Natural Healing with Dr. Vijay Singla', 'Structured naturopathic healing programs for lasting physical, emotional, and energetic transformation.', 'naturopathy, natural healing, Dr. Vijay Singla, wellness', 'VijayHeals — Heal from Within', 'Join Dr. Vijay Singla for a structured healing journey grounded in naturopathy.'),
    ('programs', 'Healing Programs — VijayHeals', 'Explore the VijayHeals program pathway: Awareness Session, Foundation Course, and Transformation Mastery.', 'healing programs, naturopathy courses, transformation mastery', 'VijayHeals Programs', 'From awareness to mastery — find your healing pathway.'),
    ('blog', 'Healing Insights Blog — VijayHeals', 'Articles on naturopathy, breathwork, nutrition, emotional healing, and student transformation stories.', 'naturopathy blog, healing articles, breathwork, nutrition', 'VijayHeals Blog', 'Insights on natural healing, breathwork, and transformation.')
  ON CONFLICT (page_key) DO NOTHING;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Mock data insertion error: %', SQLERRM;
END $$;
