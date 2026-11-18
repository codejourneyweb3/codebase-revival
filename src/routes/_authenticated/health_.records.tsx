import {createFileRoute} from "@tanstack/react-router";
import {HealthList} from "@/features/health/HealthList";
export const Route=createFileRoute("/_authenticated/health_/records")({head:()=>({meta:[{title:"Health records \u00b7 KukuThrive"},{name:"description",content:"Flock health, treatments and visits."},{property:"og:title",content:"Health records \u00b7 KukuThrive"},{property:"og:description",content:"Flock health, treatments and visits."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<HealthList />);}
