import {createFileRoute} from "@tanstack/react-router";
import {StaffPaymentsScreen} from "@/features/staff-payments/StaffPaymentsScreen";
export const Route=createFileRoute("/_authenticated/staff-payments")({head:()=>({meta:[{title:"Staff payments \u00b7 KukuThrive"},{name:"description",content:"Wages and payments to farm workers."},{property:"og:title",content:"Staff payments \u00b7 KukuThrive"},{property:"og:description",content:"Wages and payments to farm workers."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<StaffPaymentsScreen />);}
