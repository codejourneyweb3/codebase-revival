import {createFileRoute} from "@tanstack/react-router";
import {FeedInventoryScreen} from "@/features/kukuthrive/FeedInventoryScreen";
import {RecordsLink} from "@/features/kukuthrive/ui";
export const Route=createFileRoute("/_authenticated/feed")({head:()=>({meta:[{title:"Feed & inventory \u00b7 KukuThrive"},{name:"description",content:"Feed purchases, issues to houses, running stock balance and physical counts."},{property:"og:title",content:"Feed & inventory \u00b7 KukuThrive"},{property:"og:description",content:"Feed purchases, issues to houses, running stock balance and physical counts."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return ((
      <>
        <RecordsLink to="/feed/stock" label="Feed purchases & stock list" />
        <FeedInventoryScreen />
      </>
    ));}
