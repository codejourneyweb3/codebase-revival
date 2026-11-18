import {createFileRoute} from "@tanstack/react-router";
import {Dashboard} from "@/features/dashboard/Dashboard";
export const Route=createFileRoute("/_authenticated/dashboard")({head:()=>({meta:[{title:"Farm overview \u00b7 KukuThrive"},{name:"description",content:"Today's eggs, birds, money and alerts across your poultry farm."},{property:"og:title",content:"Farm overview \u00b7 KukuThrive"},{property:"og:description",content:"Today's eggs, birds, money and alerts across your poultry farm."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<Dashboard />);}
