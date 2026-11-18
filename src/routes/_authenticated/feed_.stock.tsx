import {createFileRoute} from "@tanstack/react-router";
import {FeedList} from "@/features/stock/FeedList";
export const Route=createFileRoute("/_authenticated/feed_/stock")({head:()=>({meta:[{title:"Feed stock records \u00b7 KukuThrive"},{name:"description",content:"Feed stock, deliveries and usage."},{property:"og:title",content:"Feed stock records \u00b7 KukuThrive"},{property:"og:description",content:"Feed stock, deliveries and usage."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<FeedList />);}
