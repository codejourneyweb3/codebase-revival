import {createFileRoute} from "@tanstack/react-router";
import {ExpensesNew} from "@/features/expenses/ExpensesNew";
export const Route=createFileRoute("/_authenticated/expenses_/new")({head:()=>({meta:[{title:"New expense \u00b7 KukuThrive"},{name:"description",content:"Record a new farm expense."},{property:"og:title",content:"New expense \u00b7 KukuThrive"},{property:"og:description",content:"Record a new farm expense."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<ExpensesNew />);}
