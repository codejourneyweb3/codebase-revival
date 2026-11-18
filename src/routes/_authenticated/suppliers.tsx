import {createFileRoute} from "@tanstack/react-router";
import {SuppliersList} from "@/features/expenses/SuppliersList";
export const Route=createFileRoute("/_authenticated/suppliers")({head:()=>({meta:[{title:"Suppliers \u00b7 KukuThrive"},{name:"description",content:"Feed, chick and medicine suppliers."},{property:"og:title",content:"Suppliers \u00b7 KukuThrive"},{property:"og:description",content:"Feed, chick and medicine suppliers."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<SuppliersList />);}
