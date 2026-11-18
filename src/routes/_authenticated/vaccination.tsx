import {createFileRoute} from "@tanstack/react-router";
import {VaccinationScreen} from "@/features/kukuthrive/VaccinationScreen";
import {RecordsLink} from "@/features/kukuthrive/ui";
export const Route=createFileRoute("/_authenticated/vaccination")({head:()=>({meta:[{title:"Vaccination & medication \u00b7 KukuThrive"},{name:"description",content:"Farm-owned vaccination schedules, administration checklists and coverage."},{property:"og:title",content:"Vaccination & medication \u00b7 KukuThrive"},{property:"og:description",content:"Farm-owned vaccination schedules, administration checklists and coverage."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return ((
      <>
        <RecordsLink to="/vaccination/records" label="Vaccination records list" />
        <VaccinationScreen />
      </>
    ));}
