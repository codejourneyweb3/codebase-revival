import {createFileRoute} from "@tanstack/react-router";
import {FarmHousesScreen} from "@/features/kukuthrive/FarmHousesScreen";
export const Route=createFileRoute("/_authenticated/farm")({head:()=>({meta:[{title:"Farm & houses \u00b7 KukuThrive"},{name:"description",content:"Farm identity, poultry-house configuration, usable floor area and stocking density."},{property:"og:title",content:"Farm & houses \u00b7 KukuThrive"},{property:"og:description",content:"Farm identity, poultry-house configuration, usable floor area and stocking density."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<FarmHousesScreen />);}
