import {createFileRoute} from "@tanstack/react-router";
import {EquipmentList} from "@/features/equipment/EquipmentList";
export const Route=createFileRoute("/_authenticated/equipment")({head:()=>({meta:[{title:"Equipment \u00b7 KukuThrive"},{name:"description",content:"Farm equipment and maintenance."},{property:"og:title",content:"Equipment \u00b7 KukuThrive"},{property:"og:description",content:"Farm equipment and maintenance."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<EquipmentList />);}
