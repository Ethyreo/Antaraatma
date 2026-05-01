-- ============================================================
-- RESET ALL DATA AND SEED NEW ADMIN ACCOUNT
-- Clears all existing data and creates sole admin:
-- Email: theantaraatmahealing@gmail.com
-- Password: drvijaysingla@1
-- ============================================================

DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    existing_admin_id UUID;
BEGIN

    -- ─── STEP 1: DELETE ALL BUSINESS DATA (children first) ───

    DELETE FROM public.community_reactions;
    DELETE FROM public.community_comments;
    DELETE FROM public.community_posts;
    DELETE FROM public.blog_post_tags;
    DELETE FROM public.blog_posts;
    DELETE FROM public.certificates;
    DELETE FROM public.progress_records;
    DELETE FROM public.subscriptions;
    DELETE FROM public.enrollments;
    DELETE FROM public.orders;
    DELETE FROM public.lesson_assets;
    DELETE FROM public.lessons;
    DELETE FROM public.modules;
    DELETE FROM public.courses;
    DELETE FROM public.resources;
    DELETE FROM public.shipment_statuses;
    DELETE FROM public.student_invitations;
    DELETE FROM public.announcements;
    DELETE FROM public.site_sections;
    DELETE FROM public.seo_metadata;
    DELETE FROM public.faqs;
    DELETE FROM public.testimonials;
    DELETE FROM public.leads;
    DELETE FROM public.programs;
    DELETE FROM public.services;
    DELETE FROM public.blog_tags;
    DELETE FROM public.blog_categories;

    -- ─── STEP 2: DELETE ALL USER PROFILES AND AUTH USERS ───

    DELETE FROM public.user_profiles;
    DELETE FROM auth.users;

    -- ─── STEP 3: CREATE NEW ADMIN ACCOUNT ───

    -- Check if admin already exists (idempotency)
    SELECT id INTO existing_admin_id FROM auth.users WHERE email = 'theantaraatmahealing@gmail.com' LIMIT 1;

    IF existing_admin_id IS NULL THEN
        INSERT INTO auth.users (
            id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
            created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
            is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
            recovery_token, recovery_sent_at, email_change_token_new, email_change,
            email_change_sent_at, email_change_token_current, email_change_confirm_status,
            reauthentication_token, reauthentication_sent_at, phone, phone_change,
            phone_change_token, phone_change_sent_at
        ) VALUES (
            admin_uuid,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'theantaraatmahealing@gmail.com',
            crypt('drvijaysingla@1', gen_salt('bf', 10)),
            now(),
            now(),
            now(),
            jsonb_build_object('full_name', 'Dr. Vijay Singla', 'role', 'admin'),
            jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
            false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
        );

        -- Create user_profile for admin
        INSERT INTO public.user_profiles (id, email, full_name, role, is_active, onboarding_completed)
        VALUES (admin_uuid, 'theantaraatmahealing@gmail.com', 'Dr. Vijay Singla', 'admin'::public.user_role, true, true)
        ON CONFLICT (email) DO UPDATE SET role = 'admin'::public.user_role, is_active = true;

        RAISE NOTICE 'New admin account created: theantaraatmahealing@gmail.com';
    ELSE
        -- Ensure correct role for existing account
        INSERT INTO public.user_profiles (id, email, full_name, role, is_active, onboarding_completed)
        VALUES (existing_admin_id, 'theantaraatmahealing@gmail.com', 'Dr. Vijay Singla', 'admin'::public.user_role, true, true)
        ON CONFLICT (email) DO UPDATE SET role = 'admin'::public.user_role, is_active = true;

        RAISE NOTICE 'Admin account already exists, ensured correct role.';
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Migration failed: %', SQLERRM;
END $$;
