import {createFileRoute} from "@tanstack/react-router";
import {GrowthScreen} from "@/features/kukuthrive/GrowthScreen";
export const Route=createFileRoute("/_authenticated/growth")({head:()=>({meta:[{title:"Growth & weighing \u00b7 KukuThrive"},{name:"description",content:"Sample weights, daily gain, uniformity and expected development for each flock."},{property:"og:title",content:"Growth & weighing \u00b7 KukuThrive"},{property:"og:description",content:"Sample weights, daily gain, uniformity and expected development for each flock."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<GrowthScreen />);}
