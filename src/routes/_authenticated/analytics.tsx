import {createFileRoute} from "@tanstack/react-router";
import {AnalyticsScreen} from "@/features/analytics/AnalyticsScreen";
export const Route=createFileRoute("/_authenticated/analytics")({head:()=>({meta:[{title:"Analytics \u00b7 KukuThrive"},{name:"description",content:"Production and profit trends."},{property:"og:title",content:"Analytics \u00b7 KukuThrive"},{property:"og:description",content:"Production and profit trends."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<AnalyticsScreen />);}
