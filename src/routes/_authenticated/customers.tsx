import {createFileRoute} from "@tanstack/react-router";
import {CustomersList} from "@/features/customers/CustomersList";
export const Route=createFileRoute("/_authenticated/customers")({head:()=>({meta:[{title:"Customers \u00b7 KukuThrive"},{name:"description",content:"Customers and what they owe."},{property:"og:title",content:"Customers \u00b7 KukuThrive"},{property:"og:description",content:"Customers and what they owe."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<CustomersList />);}
