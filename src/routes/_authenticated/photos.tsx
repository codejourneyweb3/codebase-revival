import {createFileRoute} from "@tanstack/react-router";
import {PhotoGallery} from "@/features/photos/PhotoGallery";
export const Route=createFileRoute("/_authenticated/photos")({head:()=>({meta:[{title:"Photos \u00b7 KukuThrive"},{name:"description",content:"Flock and farm photos."},{property:"og:title",content:"Photos \u00b7 KukuThrive"},{property:"og:description",content:"Flock and farm photos."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<PhotoGallery />);}
