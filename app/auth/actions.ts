'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    phone: formData.get('phone') as string | undefined,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  // Check if user is admin
  const { data: isAdminData } = await supabase.rpc('is_admin');
  
  revalidatePath('/', 'layout');
  
  // Redirect to admin if user is admin, otherwise to dashboard
  if (isAdminData) {
    redirect('/admin');
  } else {
    redirect('/dashboard');
  }
}

export async function signup(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  // const data = {
  //   full_name: formData.get('fullname') as string,
  //   email: formData.get('email') as string,
  //   phone: formData.get('phone') as string | undefined,
  //   password: formData.get('password') as string,
  //   role: formData.get('role') as string || 'customer',
  // };
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('full_name') as string,
        phone: formData.get('phone') as string | undefined,
        role: formData.get('role') as string || 'customer',
      }
    }
  }

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  // redirect('/auth/signin?message=Check your email to confirm your account');
  redirect('/auth/signin?message=Account created! please sign in to continue');
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/auth/signin');
}
