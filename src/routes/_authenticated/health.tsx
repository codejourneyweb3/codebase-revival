import {createFileRoute} from "@tanstack/react-router";
import {HealthScreen} from "@/features/kukuthrive/HealthScreen";
import {RecordsLink} from "@/features/kukuthrive/ui";
export const Route=createFileRoute("/_authenticated/health")({head:()=>({meta:[{title:"Health & veterinary \u00b7 KukuThrive"},{name:"description",content:"Daily health checks, health events, mortality and culls, linked to what happened next."},{property:"og:title",content:"Health & veterinary \u00b7 KukuThrive"},{property:"og:description",content:"Daily health checks, health events, mortality and culls, linked to what happened next."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return ((
      <>
        <RecordsLink to="/health/records" label="Health records list" />
        <HealthScreen />
      </>
    ));}
