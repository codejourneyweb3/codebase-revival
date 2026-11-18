import {createFileRoute} from "@tanstack/react-router";
import {DocumentsList} from "@/features/documents/DocumentsList";
export const Route=createFileRoute("/_authenticated/documents")({head:()=>({meta:[{title:"Documents \u00b7 KukuThrive"},{name:"description",content:"Farm licences, receipts and records."},{property:"og:title",content:"Documents \u00b7 KukuThrive"},{property:"og:description",content:"Farm licences, receipts and records."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<DocumentsList />);}
