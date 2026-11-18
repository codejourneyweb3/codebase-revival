import {createFileRoute} from "@tanstack/react-router";
import {WaterScreen} from "@/features/kukuthrive/WaterScreen";
export const Route=createFileRoute("/_authenticated/water")({head:()=>({meta:[{title:"Water \u00b7 KukuThrive"},{name:"description",content:"Drinker register, refill log and estimated water intake per bird."},{property:"og:title",content:"Water \u00b7 KukuThrive"},{property:"og:description",content:"Drinker register, refill log and estimated water intake per bird."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<WaterScreen />);}
