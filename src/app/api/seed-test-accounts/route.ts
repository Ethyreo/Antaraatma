import { NextResponse } from 'next/server';
import { createServiceRoleClient, requireAdminUser } from '@/lib/supabase/route';

export async function POST() {
  const auth = await requireAdminUser();
  if (auth.error) return auth.error;

  const supabaseAdmin = createServiceRoleClient();

  const accounts = [
    { email: 'admin@antaraatma.com', password: 'Admin@123', role: 'admin' },
    { email: 'student@antaraatma.com', password: 'Student@123', role: 'student' },
  ];

  const results: { email: string; status: string; error?: string }[] = [];

  for (const account of accounts) {
    // Check if user already exists by trying to list users
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find((u) => u.email === account.email);

    if (existingUser) {
      // Update password to ensure it's correct
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        { password: account.password, email_confirm: true }
      );

      if (updateError) {
        results.push({ email: account.email, status: 'error', error: updateError.message });
        continue;
      }

      // Upsert profile
      await supabaseAdmin.from('user_profiles').upsert(
        { id: existingUser.id, role: account.role, email: account.email },
        { onConflict: 'id' }
      );

      results.push({ email: account.email, status: 'updated' });
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: { role: account.role },
      });

      if (createError) {
        results.push({ email: account.email, status: 'error', error: createError.message });
        continue;
      }

      if (newUser?.user) {
        // Create profile
        await supabaseAdmin.from('user_profiles').upsert(
          { id: newUser.user.id, role: account.role, email: account.email },
          { onConflict: 'id' }
        );
      }

      results.push({ email: account.email, status: 'created' });
    }
  }

  return NextResponse.json({ success: true, results });
}
