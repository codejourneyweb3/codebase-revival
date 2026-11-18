import {createFileRoute} from "@tanstack/react-router";
import {EnvironmentScreen} from "@/features/kukuthrive/EnvironmentScreen";
export const Route=createFileRoute("/_authenticated/environment")({head:()=>({meta:[{title:"Environment \u00b7 KukuThrive"},{name:"description",content:"Scored heat, air, ammonia, draught and dust checks at bird height, plus optional readings."},{property:"og:title",content:"Environment \u00b7 KukuThrive"},{property:"og:description",content:"Scored heat, air, ammonia, draught and dust checks at bird height, plus optional readings."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<EnvironmentScreen />);}
