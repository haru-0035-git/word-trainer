import supabase from "../utils/Utilsupabase";
import bcrypt from "bcryptjs";

async function AuthUser(username: string, password: string) {
  const { data, error } = await supabase
    .from("users")
    .select("name, password") // Include 'name' field
    .eq("name", username)
    .single();

  if (error || !data || !bcrypt.compareSync(password, data.password)) {
    return {
      success: false,
      message: "ユーザー名またはパスワードが違います。",
    };
  }

  return { success: true, data: { username: data.name } }; // Return username explicitly
}

export default AuthUser;
