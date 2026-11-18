import {createFileRoute} from "@tanstack/react-router";
import {StandardsScreen} from "@/features/kukuthrive/StandardsScreen";
export const Route=createFileRoute("/_authenticated/standards")({head:()=>({meta:[{title:"Standards & thresholds \u00b7 KukuThrive"},{name:"description",content:"Reference values and scored-parameter trigger levels, with source and review status."},{property:"og:title",content:"Standards & thresholds \u00b7 KukuThrive"},{property:"og:description",content:"Reference values and scored-parameter trigger levels, with source and review status."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<StandardsScreen />);}
