import {createFileRoute} from "@tanstack/react-router";
import {NotificationsScreen} from "@/features/kukuthrive/NotificationsScreen";
export const Route=createFileRoute("/_authenticated/notifications")({head:()=>({meta:[{title:"Notifications \u00b7 KukuThrive"},{name:"description",content:"Choose how welfare alerts, schedule reminders and data-quality prompts reach you."},{property:"og:title",content:"Notifications \u00b7 KukuThrive"},{property:"og:description",content:"Choose how welfare alerts, schedule reminders and data-quality prompts reach you."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<NotificationsScreen />);}
