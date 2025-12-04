import { getSupabase } from "./supabase";
import { User } from "@supabase/supabase-js";

export async function signUp(
  email: string,
  password: string
): Promise<{ user: User | null; error: string | null }> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    return { user: data.user, error: null };
  } catch {
    return { user: null, error: "Failed to sign up" };
  }
}

export async function signIn(
  email: string,
  password: string
): Promise<{ user: User | null; error: string | null }> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    return { user: data.user, error: null };
  } catch {
    return { user: null, error: "Failed to sign in" };
  }
}

export async function signOut(): Promise<{ error: string | null }> {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch {
    return { error: "Failed to sign out" };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}
