import {createFileRoute,Outlet,redirect} from "@tanstack/react-router";
import {supabase} from "@/integrations/supabase/client";
import {useAuthStore} from "@/features/auth/AuthProvider";
import {AppShell} from "@/components/farm/AppShell";
export const Route=createFileRoute("/_authenticated")({ssr:false,beforeLoad:async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user)throw redirect({to:"/auth"});await useAuthStore.getState().restore();},component:()=> <AppShell><Outlet/></AppShell>});
