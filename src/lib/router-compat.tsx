import { Link as RouterLink, Navigate as RouterNavigate, useLocation as useRouterLocation, useNavigate as useRouterNavigate, useParams as useRouterParams } from "@tanstack/react-router";
import type { AnchorHTMLAttributes, ReactNode } from "react";
export function Link({to,children,className,onClick,title,...rest}: Omit<AnchorHTMLAttributes<HTMLAnchorElement>,"href"> & {to:string;children?:ReactNode}) {return <RouterLink to={to === "/" ? "/dashboard" : to} {...(className?{className}:{})} {...(onClick?{onClick}:{})} {...(title?{title}:{})} aria-label={rest["aria-label"]}>{children}</RouterLink>;}
export function Navigate({to,replace}: {to:string;replace?:boolean;state?:unknown}) { return <RouterNavigate to={to} replace={replace ?? false}/>; }
export function useNavigate() {const n=useRouterNavigate();return (to:string|number|{to:string;replace?:boolean})=>{if(typeof to === "number") {window.history.go(to);return;}return n(typeof to === "string" ? {to:to === "/" ? "/dashboard" : to}:to);};}
export function useLocation(){return useRouterLocation();}
export function useParams<T extends Record<string,string|undefined> = Record<string,string>>():T {const params = useRouterParams({strict:false});return params as T;}
