import {createFileRoute} from "@tanstack/react-router";
import {FlockDetail} from "@/features/flocks/FlockDetail";
export const Route=createFileRoute("/_authenticated/flocks_/$id")({head:()=>({meta:[{title:"Flock detail \u00b7 KukuThrive"},{name:"description",content:"Eggs, mortality and weights for one flock."},{property:"og:title",content:"Flock detail \u00b7 KukuThrive"},{property:"og:description",content:"Eggs, mortality and weights for one flock."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<FlockDetail />);}
