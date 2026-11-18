import {createFileRoute} from "@tanstack/react-router";
import {WelfareScreen} from "@/features/kukuthrive/WelfareScreen";
export const Route=createFileRoute("/_authenticated/welfare")({head:()=>({meta:[{title:"Welfare intelligence \u00b7 KukuThrive"},{name:"description",content:"Five welfare dimensions with evidence quality, investigation prompts and intervention outcomes."},{property:"og:title",content:"Welfare intelligence \u00b7 KukuThrive"},{property:"og:description",content:"Five welfare dimensions with evidence quality, investigation prompts and intervention outcomes."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<WelfareScreen />);}
