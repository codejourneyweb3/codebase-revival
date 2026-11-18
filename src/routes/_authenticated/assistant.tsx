import {createFileRoute} from "@tanstack/react-router";
import {AssistantScreen} from "@/features/kukuthrive/AssistantScreen";
export const Route=createFileRoute("/_authenticated/assistant")({head:()=>({meta:[{title:"Investigation assistant \u00b7 KukuThrive"},{name:"description",content:"Ask questions about your flock and get evidence-based explanations and suggested checks."},{property:"og:title",content:"Investigation assistant \u00b7 KukuThrive"},{property:"og:description",content:"Ask questions about your flock and get evidence-based explanations and suggested checks."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<AssistantScreen />);}
