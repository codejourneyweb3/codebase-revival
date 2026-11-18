import {createFileRoute} from "@tanstack/react-router";
import {SettingsScreen} from "@/features/settings/SettingsScreen";
export const Route=createFileRoute("/_authenticated/settings")({head:()=>({meta:[{title:"Settings \u00b7 KukuThrive"},{name:"description",content:"Farm and account settings."},{property:"og:title",content:"Settings \u00b7 KukuThrive"},{property:"og:description",content:"Farm and account settings."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<SettingsScreen />);}
