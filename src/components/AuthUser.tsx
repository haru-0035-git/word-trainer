import supabase from "../utils/Utilsupabase";

async function AuthUser(username: string, password: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (error || !data) {
    return {
      success: false,
      message: "ユーザー名またはパスワードが違います。",
    };
  }

  return { success: true, data };
}

export default AuthUser;
