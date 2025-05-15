import supabase from "../utils/Utilsupabase";
import { useEffect } from "react";

async function InsertUser(user: string, password: string) {
  // Check if the user already exists
  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("user")
    .eq("user", user)
    .single();

  if (fetchError) {
    return fetchError;
  }

  if (existingUser) {
    return { error: "User already exists" };
  }

  // Insert the new user
  const { error: insertError } = await supabase
    .from("users")
    .insert([{ user: user, password: password }]);

  if (insertError) {
    return insertError;
  } else {
    return { success: true };
  }
}

async function InsertScore(score: number, userId: string) {
  // Check if the user exists in the scores table
  const { data: existingScore, error: fetchError } = await supabase
    .from("scores")
    .select("id, user_id")
    .eq("user_id", userId)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    // Ignore "No rows found" error
    return fetchError;
  }

  if (existingScore) {
    // Update the existing score
    const { error: updateError } = await supabase
      .from("scores")
      .update({ score: score })
      .eq("user_id", userId);

    if (updateError) {
      return updateError;
    } else {
      return { success: "Score updated successfully" };
    }
  } else {
    // Insert a new score
    const { error: insertError } = await supabase
      .from("scores")
      .insert([{ score: score, user_id: userId }]);

    if (insertError) {
      return insertError;
    } else {
      return { success: "Score inserted successfully" };
    }
  }
}

function useInsertOnEvents(score: number, userId: string) {
  useEffect(() => {
    const handleBeforeUnload = async () => {
      await InsertScore(score, userId);
    };

    const timer = setTimeout(async () => {
      await InsertScore(score, userId);
    }, 60000); // 60秒後にデータを挿入

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [score, userId]);
}

export { InsertUser, InsertScore, useInsertOnEvents };
