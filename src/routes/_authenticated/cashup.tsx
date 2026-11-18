import {createFileRoute} from "@tanstack/react-router";
import {CashupScreen} from "@/features/cash-up/CashupScreen";
export const Route=createFileRoute("/_authenticated/cashup")({head:()=>({meta:[{title:"Cash-up \u00b7 KukuThrive"},{name:"description",content:"Daily cash count against recorded sales and spending."},{property:"og:title",content:"Cash-up \u00b7 KukuThrive"},{property:"og:description",content:"Daily cash count against recorded sales and spending."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<CashupScreen />);}
