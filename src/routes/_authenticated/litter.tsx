import {createFileRoute} from "@tanstack/react-router";
import {LitterScreen} from "@/features/kukuthrive/LitterScreen";
export const Route=createFileRoute("/_authenticated/litter")({head:()=>({meta:[{title:"Litter \u00b7 KukuThrive"},{name:"description",content:"Litter material, squeeze-test scores, turning and replacement history."},{property:"og:title",content:"Litter \u00b7 KukuThrive"},{property:"og:description",content:"Litter material, squeeze-test scores, turning and replacement history."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<LitterScreen />);}
