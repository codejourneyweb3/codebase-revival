import {createFileRoute} from "@tanstack/react-router";
import {SalesNew} from "@/features/sales/SalesNew";
export const Route=createFileRoute("/_authenticated/sales_/new")({head:()=>({meta:[{title:"New sale \u00b7 KukuThrive"},{name:"description",content:"Record a new egg or bird sale."},{property:"og:title",content:"New sale \u00b7 KukuThrive"},{property:"og:description",content:"Record a new egg or bird sale."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<SalesNew />);}
