import {createFileRoute} from "@tanstack/react-router";
import {ReportsScreen} from "@/features/reports/ReportsScreen";
import {ReportPacks} from "@/features/kukuthrive/ReportPacks";
export const Route=createFileRoute("/_authenticated/reports")({head:()=>({meta:[{title:"Reports \u00b7 KukuThrive"},{name:"description",content:"Printable farm reports."},{property:"og:title",content:"Reports \u00b7 KukuThrive"},{property:"og:description",content:"Printable farm reports."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return ((
      <>
        <ReportsScreen />
        <ReportPacks />
      </>
    ));}
