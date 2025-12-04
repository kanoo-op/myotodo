import { getSupabase } from "./supabase";
import { Todo } from "@/types/database";

export async function getTodos(): Promise<Todo[]> {
  try {
    const supabase = getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching todos:", error);
      return [];
    }

    return (data as Todo[]) || [];
  } catch {
    console.error("Supabase not initialized");
    return [];
  }
}

export async function addTodo(title: string): Promise<Todo | null> {
  try {
    const supabase = getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("User not authenticated");
      return null;
    }

    const { data, error } = await supabase
      .from("todos")
      .insert({ title, completed: false, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error("Error adding todo:", error);
      return null;
    }

    return data as Todo;
  } catch {
    console.error("Supabase not initialized");
    return null;
  }
}

export async function toggleTodo(
  id: string,
  completed: boolean
): Promise<boolean> {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("todos")
      .update({ completed })
      .eq("id", id);

    if (error) {
      console.error("Error toggling todo:", error);
      return false;
    }

    return true;
  } catch {
    console.error("Supabase not initialized");
    return false;
  }
}

export async function deleteTodo(id: string): Promise<boolean> {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      console.error("Error deleting todo:", error);
      return false;
    }

    return true;
  } catch {
    console.error("Supabase not initialized");
    return false;
  }
}

export async function updateTodoTitle(
  id: string,
  title: string
): Promise<boolean> {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("todos")
      .update({ title })
      .eq("id", id);

    if (error) {
      console.error("Error updating todo:", error);
      return false;
    }

    return true;
  } catch {
    console.error("Supabase not initialized");
    return false;
  }
}
