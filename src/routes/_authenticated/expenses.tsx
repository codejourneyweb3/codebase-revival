import {createFileRoute} from "@tanstack/react-router";
import {ExpensesList} from "@/features/expenses/ExpensesList";
export const Route=createFileRoute("/_authenticated/expenses")({head:()=>({meta:[{title:"Expenses \u00b7 KukuThrive"},{name:"description",content:"Farm spending by category and supplier."},{property:"og:title",content:"Expenses \u00b7 KukuThrive"},{property:"og:description",content:"Farm spending by category and supplier."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<ExpensesList />);}
