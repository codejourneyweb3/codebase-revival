import {createFileRoute} from "@tanstack/react-router";
import {FlocksList} from "@/features/flocks/FlocksList";
export const Route=createFileRoute("/_authenticated/flocks")({head:()=>({meta:[{title:"Flocks \u00b7 KukuThrive"},{name:"description",content:"All layer and broiler flocks with live counts and health."},{property:"og:title",content:"Flocks \u00b7 KukuThrive"},{property:"og:description",content:"All layer and broiler flocks with live counts and health."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<FlocksList />);}
