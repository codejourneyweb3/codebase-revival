import {createFileRoute} from "@tanstack/react-router";
import {CustomerStatement} from "@/features/customers/CustomerStatement";
export const Route=createFileRoute("/_authenticated/customers_/$id")({head:()=>({meta:[{title:"Customer statement \u00b7 KukuThrive"},{name:"description",content:"Sales and payments for one customer."},{property:"og:title",content:"Customer statement \u00b7 KukuThrive"},{property:"og:description",content:"Sales and payments for one customer."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<CustomerStatement />);}
