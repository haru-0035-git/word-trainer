import supabase from "../utils/Utilsupabase";

async function AuthUser() {
  await supabase.from("users").select();
}

export default AuthUser;
