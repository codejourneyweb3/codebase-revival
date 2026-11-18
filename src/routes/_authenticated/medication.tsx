import {createFileRoute} from "@tanstack/react-router";
import {MedicationList} from "@/features/health/MedicationList";
export const Route=createFileRoute("/_authenticated/medication")({head:()=>({meta:[{title:"Medication \u00b7 KukuThrive"},{name:"description",content:"Medicine stock and treatments."},{property:"og:title",content:"Medication \u00b7 KukuThrive"},{property:"og:description",content:"Medicine stock and treatments."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<MedicationList />);}
