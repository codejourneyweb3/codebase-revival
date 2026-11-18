import {createFileRoute} from "@tanstack/react-router";
import {PriceHistoryScreen} from "@/features/price-history/PriceHistoryScreen";
export const Route=createFileRoute("/_authenticated/price-history")({head:()=>({meta:[{title:"Price history \u00b7 KukuThrive"},{name:"description",content:"Egg and bird prices over time."},{property:"og:title",content:"Price history \u00b7 KukuThrive"},{property:"og:description",content:"Egg and bird prices over time."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<PriceHistoryScreen />);}
