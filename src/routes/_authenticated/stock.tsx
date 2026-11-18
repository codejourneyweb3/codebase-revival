import {createFileRoute} from "@tanstack/react-router";
import {StockList} from "@/features/stock/StockList";
export const Route=createFileRoute("/_authenticated/stock")({head:()=>({meta:[{title:"Stock \u00b7 KukuThrive"},{name:"description",content:"Farm stock levels."},{property:"og:title",content:"Stock \u00b7 KukuThrive"},{property:"og:description",content:"Farm stock levels."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<StockList />);}
