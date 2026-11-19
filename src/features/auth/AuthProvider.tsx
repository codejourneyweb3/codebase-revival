import { useEffect,type ReactNode } from "react";
import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { setDbAccount } from "@/lib/db";
export interface User {id:string;farmId:string;email:string;name:string;role:"owner"|"manager"|null;farmName?:string;createdAt?:string;}
export interface LegacyUser {name:string;email:string;role:"Owner"|"Manager";}
interface AuthState {user:User|null;legacyUser:LegacyUser|null;loading:boolean;login:(email:string,password:string)=>Promise<void>;logout:()=>Promise<void>;restore:()=>Promise<void>;}
export const useAuthStore=create<AuthState>((set,get)=>({user:null,legacyUser:null,loading:true,
login:async(email,password)=>{const {error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;await get().restore();},
logout:async()=>{await supabase.auth.signOut();setDbAccount("signed-out");set({user:null,legacyUser:null,loading:false});},
restore:async()=>{const {data:{user:u}}=await supabase.auth.getUser();if(!u){setDbAccount("signed-out");set({user:null,legacyUser:null,loading:false});return;}const {data:r}=await supabase.from("user_roles").select("role").eq("user_id",u.id).maybeSingle();const {data:members}=await supabase.from('farm_members').select('owner_id').eq('user_id',u.id);const selected=typeof window==='undefined'?null:sessionStorage.getItem(`farm:${u.id}`);const farmId=selected && members?.some(m=>m.owner_id===selected)?selected:u.id;const role=farmId!==u.id?'manager':r?.role === "owner" || r?.role === "manager" ? r.role:null;const user:User={id:u.id,farmId,email:u.email??"",name:u.user_metadata?.["name"]??u.email?.split("@")[0]??"Farmer",role};setDbAccount(`${u.id}:${farmId}`);set({user,legacyUser:role?{name:user.name,email:user.email,role:role==="owner"?"Owner":"Manager"}:null,loading:false});}
}));
export function AuthProvider({children}:{children:ReactNode}) {useEffect(()=>{void useAuthStore.getState().restore();},[]);return <>{children}</>;}
export function useAuth(){return useAuthStore();}
