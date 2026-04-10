-- Seed test accounts for admin and student login
-- Credentials: admin@vijayheals.com / Admin@123 and student@vijayheals.com / Student@123

DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    student_uuid UUID := gen_random_uuid();
    existing_admin_id UUID;
    existing_student_id UUID;
BEGIN
    -- Check if admin user already exists in auth.users
    SELECT id INTO existing_admin_id FROM auth.users WHERE email = 'admin@vijayheals.com' LIMIT 1;
    SELECT id INTO existing_student_id FROM auth.users WHERE email = 'student@vijayheals.com' LIMIT 1;

    -- Create admin auth user if not exists
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
            'admin@vijayheals.com',
            crypt('Admin@123', gen_salt('bf', 10)),
            now(),
            now(),
            now(),
            jsonb_build_object('full_name', 'Admin User', 'role', 'admin'),
            jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
            false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
        );

        -- Create user_profile for admin (in case trigger did not fire)
        INSERT INTO public.user_profiles (id, email, full_name, role, is_active, onboarding_completed)
        VALUES (admin_uuid, 'admin@vijayheals.com', 'Admin User', 'admin'::public.user_role, true, true)
        ON CONFLICT (email) DO UPDATE SET role = 'admin'::public.user_role, is_active = true;

        RAISE NOTICE 'Admin user created: admin@vijayheals.com';
    ELSE
        -- Ensure the existing admin profile has the correct role
        INSERT INTO public.user_profiles (id, email, full_name, role, is_active, onboarding_completed)
        VALUES (existing_admin_id, 'admin@vijayheals.com', 'Admin User', 'admin'::public.user_role, true, true)
        ON CONFLICT (email) DO UPDATE SET role = 'admin'::public.user_role, is_active = true;

        RAISE NOTICE 'Admin user already exists, ensured correct role.';
    END IF;

    -- Create student auth user if not exists
    IF existing_student_id IS NULL THEN
        INSERT INTO auth.users (
            id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
            created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
            is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
            recovery_token, recovery_sent_at, email_change_token_new, email_change,
            email_change_sent_at, email_change_token_current, email_change_confirm_status,
            reauthentication_token, reauthentication_sent_at, phone, phone_change,
            phone_change_token, phone_change_sent_at
        ) VALUES (
            student_uuid,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'student@vijayheals.com',
            crypt('Student@123', gen_salt('bf', 10)),
            now(),
            now(),
            now(),
            jsonb_build_object('full_name', 'Student User', 'role', 'student'),
            jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
            false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
        );

        -- Create user_profile for student (in case trigger did not fire)
        INSERT INTO public.user_profiles (id, email, full_name, role, is_active, onboarding_completed)
        VALUES (student_uuid, 'student@vijayheals.com', 'Student User', 'student'::public.user_role, true, true)
        ON CONFLICT (email) DO UPDATE SET role = 'student'::public.user_role, is_active = true;

        RAISE NOTICE 'Student user created: student@vijayheals.com';
    ELSE
        -- Ensure the existing student profile has the correct role
        INSERT INTO public.user_profiles (id, email, full_name, role, is_active, onboarding_completed)
        VALUES (existing_student_id, 'student@vijayheals.com', 'Student User', 'student'::public.user_role, true, true)
        ON CONFLICT (email) DO UPDATE SET role = 'student'::public.user_role, is_active = true;

        RAISE NOTICE 'Student user already exists, ensured correct role.';
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Seed test accounts failed: %', SQLERRM;
END $$;
