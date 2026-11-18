import { supabase } from "@/integrations/supabase/client";
export async function api<T>(path:string,init:RequestInit={}):Promise<T>{
 const {data:{user}}=await supabase.auth.getUser();if(!user)throw new Error("Please sign in.");
 if(path==="/api/auth/preferences") {if(init.method==="PUT"){const data=JSON.parse(String(init.body));const {error}=await supabase.from("user_preferences").upsert({user_id:user.id,data});if(error)throw error;return {data} as T;}const {data,error}=await supabase.from("user_preferences").select("data").eq("user_id",user.id).maybeSingle();if(error)throw error;return {data:data?.data??{}} as T;}
 if(path==="/api/auth/password"){const {password}=JSON.parse(String(init.body));const {error}=await supabase.auth.updateUser({password});if(error)throw error;return {} as T;}
 throw new Error("This action is not available yet.");
}
