import {createFileRoute} from "@tanstack/react-router";
import {DailyOperations} from "@/features/kukuthrive/DailyOperations";
export const Route=createFileRoute("/_authenticated/daily")({head:()=>({meta:[{title:"Daily operations \u00b7 KukuThrive"},{name:"description",content:"A guided daily round: deaths and culls, feed, drinkers and a sensory house check."},{property:"og:title",content:"Daily operations \u00b7 KukuThrive"},{property:"og:description",content:"A guided daily round: deaths and culls, feed, drinkers and a sensory house check."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<DailyOperations />);}
