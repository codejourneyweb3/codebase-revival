import {createFileRoute} from "@tanstack/react-router";
import {AlertsScreen} from "@/features/alerts/AlertsScreen";
export const Route=createFileRoute("/_authenticated/alerts")({head:()=>({meta:[{title:"Alerts \u00b7 KukuThrive"},{name:"description",content:"Warnings about mortality, stock and payments."},{property:"og:title",content:"Alerts \u00b7 KukuThrive"},{property:"og:description",content:"Warnings about mortality, stock and payments."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<AlertsScreen />);}
