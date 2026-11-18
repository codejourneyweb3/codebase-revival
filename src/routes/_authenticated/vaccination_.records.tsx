import {createFileRoute} from "@tanstack/react-router";
import {VaccinationList} from "@/features/health/VaccinationList";
export const Route=createFileRoute("/_authenticated/vaccination_/records")({head:()=>({meta:[{title:"Vaccination records \u00b7 KukuThrive"},{name:"description",content:"Vaccination schedule per flock."},{property:"og:title",content:"Vaccination records \u00b7 KukuThrive"},{property:"og:description",content:"Vaccination schedule per flock."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<VaccinationList />);}
