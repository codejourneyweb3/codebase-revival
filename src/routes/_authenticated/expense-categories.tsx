import {createFileRoute} from "@tanstack/react-router";
import {ExpenseCategoriesScreen} from "@/features/expense-categories/ExpenseCategoriesScreen";
export const Route=createFileRoute("/_authenticated/expense-categories")({head:()=>({meta:[{title:"Expense categories \u00b7 KukuThrive"},{name:"description",content:"Categories used to group spending."},{property:"og:title",content:"Expense categories \u00b7 KukuThrive"},{property:"og:description",content:"Categories used to group spending."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Page});
function Page(){return (<ExpenseCategoriesScreen />);}
