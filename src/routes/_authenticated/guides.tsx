import {createFileRoute} from "@tanstack/react-router";
import {GuidesScreen} from "@/features/kukuthrive/GuidesScreen";
export const Route=createFileRoute("/_authenticated/guides")({head:()=>({meta:[{title:"Field guides \u00b7 KukuThrive"},{name:"description",content:"Short, plain-language guides for scoring, weighing and inspections, usable offline."},{property:"og:title",content:"Field guides \u00b7 KukuThrive"},{property:"og:description",content:"Short, plain-language guides for scoring, weighing and inspections, usable offline."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<GuidesScreen />);}
