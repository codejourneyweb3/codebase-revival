import {createFileRoute} from "@tanstack/react-router";
import {SalesList} from "@/features/sales/SalesList";
export const Route=createFileRoute("/_authenticated/sales")({head:()=>({meta:[{title:"Sales \u00b7 KukuThrive"},{name:"description",content:"Egg and bird sales with payment status."},{property:"og:title",content:"Sales \u00b7 KukuThrive"},{property:"og:description",content:"Egg and bird sales with payment status."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<SalesList />);}
