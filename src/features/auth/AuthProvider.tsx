import { useEffect,type ReactNode } from "react";
import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { setDbAccount } from "@/lib/db";
export interface User {id:string;email:string;name:string;role:"owner"|"manager"|null;farmName?:string;createdAt?:string;}
export interface LegacyUser {name:string;email:string;role:"Owner"|"Manager";}
interface AuthState {user:User|null;legacyUser:LegacyUser|null;loading:boolean;login:(email:string,password:string)=>Promise<void>;logout:()=>Promise<void>;restore:()=>Promise<void>;}
export const useAuthStore=create<AuthState>((set,get)=>({user:null,legacyUser:null,loading:true,
login:async(email,password)=>{const {error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;await get().restore();},
logout:async()=>{await supabase.auth.signOut();setDbAccount("signed-out");set({user:null,legacyUser:null,loading:false});},
restore:async()=>{const {data:{user:u}}=await supabase.auth.getUser();if(!u){setDbAccount("signed-out");set({user:null,legacyUser:null,loading:false});return;}const {data:r}=await supabase.from("user_roles").select("role").eq("user_id",u.id).maybeSingle();const role=r?.role === "owner" || r?.role === "manager" ? r.role:null;const user:User={id:u.id,email:u.email??"",name:u.user_metadata?.["name"]??u.email?.split("@")[0]??"Farmer",role};setDbAccount(u.id);set({user,legacyUser:role?{name:user.name,email:user.email,role:role==="owner"?"Owner":"Manager"}:null,loading:false});}
}));
export function AuthProvider({children}:{children:ReactNode}) {useEffect(()=>{void useAuthStore.getState().restore();},[]);return <>{children}</>;}
export function useAuth(){return useAuthStore();}
