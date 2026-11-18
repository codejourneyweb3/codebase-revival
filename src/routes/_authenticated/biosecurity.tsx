import {createFileRoute} from "@tanstack/react-router";
import {BiosecurityScreen} from "@/features/kukuthrive/BiosecurityScreen";
export const Route=createFileRoute("/_authenticated/biosecurity")({head:()=>({meta:[{title:"Biosecurity \u00b7 KukuThrive"},{name:"description",content:"Recurring hygiene checklists and between-flock cleanout records."},{property:"og:title",content:"Biosecurity \u00b7 KukuThrive"},{property:"og:description",content:"Recurring hygiene checklists and between-flock cleanout records."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<BiosecurityScreen />);}
