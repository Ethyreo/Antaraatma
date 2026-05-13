import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/students/complete-signup
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, email, fullName, phone } = body;

    if (!userId || !email) {
      return NextResponse.json({ error: 'userId and email are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Upsert user_profiles with student role
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        email: normalizedEmail,
        full_name: fullName || '',
        phone: phone || null,
        role: 'student',
        is_active: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (profileError) throw profileError;

    // Check if a lead with this email already exists to avoid duplicates
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (!existingLead) {
      // Create a lead record so admin can see and approve the new signup
      const { error: leadError } = await supabase
        .from('leads')
        .insert({
          name: fullName || normalizedEmail,
          email: normalizedEmail,
          phone: phone || null,
          source: 'New Signup',
          lead_status: 'new',
          notes: `Self-registered via signup form. User ID: ${userId}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (leadError) {
        // Non-fatal: log but don't fail the signup
        console.error('[complete-signup] Lead insert error:', leadError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
