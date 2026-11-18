import {supabase} from "@/integrations/supabase/client";
import type {Json} from "@/integrations/supabase/types";
import {getDb} from "./db";
import {useAuthStore} from "@/features/auth/AuthProvider";
import {useSyncStatus} from "@/sync/SyncStatusStore";
const SERVER_TABLE: Record<string, string> = {
  flocks: "flocks",
  reports: "dailyReports",
  eggRecords: "eggRecords",
  mortalityRecords: "mortalityRecords",
  feedUsage: "feedUsage",
  weightSamples: "weightSamples",
  customers: "customers",
  sales: "sales",
  payments: "salePayments",
  expenses: "expenses",
  feedStock: "feedStock",
  feedDeliveries: "feedPurchases",
  medications: "medicineStock",
  vaccinations: "vaccinations",
  treatments: "medicationApplications",
  visits: "biosecurityLog",
  alerts: "alerts",
  documents: "documents",
  equipment: "equipment",
  cashups: "cashLogs",
  photos: "photos",
  suppliers: "suppliers",
  expenseCategories: "expenseCategories",
  expensePayments: "expensePayments",
  priceHistory: "priceHistory",
  staffPayments: "staffPayments",
  maintenanceRecords: "maintenanceRecords",
  pushSubscriptions: "pushSubscriptions",
  audit: "auditLog",
  moduleRecords: "moduleRecords",
};

const LOCAL_TABLE: Record<string, string> = Object.fromEntries(
  Object.entries(SERVER_TABLE).map(([local, remote]) => [remote, local]),
);


export interface SyncResult {pushed:number;pulled:number;removed:number;}
export async function pushOutbox(){const user=useAuthStore.getState().user;if(!user)return 0;const db=getDb();const pending=await db.outbox.toArray();let pushed=0;
for(const item of pending){const remote=SERVER_TABLE[item.table];if(!remote)continue;const record=await db.table(item.table).get(item.recordId);if(!record)continue;
const {data:old,error:readError}=await supabase.from("record_store").select("updated_at").eq("owner_id",user.id).eq("table_name",remote).eq("id",item.recordId).maybeSingle();if(readError)throw readError;
if(!old || old.updated_at <= item.at){const {error}=await supabase.from("record_store").upsert({owner_id:user.id,table_name:remote,id:item.recordId,data:record as Json,updated_at:item.at,deleted_at:null});if(error)throw error;}
if(item.id!==undefined)await db.outbox.delete(item.id);pushed++;}return pushed;}
export async function pullChanges(){const user=useAuthStore.getState().user;if(!user)return {written:0,removed:0};const db=getDb();let written=0,removed=0,offset=0;const pending=new Set((await db.outbox.toArray()).map(x=>`${SERVER_TABLE[x.table]}:${x.recordId}`));
for(;;){const {data,error}=await supabase.from("record_store").select("table_name,id,data,deleted_at").eq("owner_id",user.id).order("table_name").order("id").range(offset,offset+999);if(error)throw error;for(const row of data??[]){const local=LOCAL_TABLE[row.table_name];if(!local || pending.has(`${row.table_name}:${row.id}`))continue;if(row.deleted_at){await db.table(local).delete(row.id);removed++;}else {await db.table(local).put(row.data);written++;}}if(!data || data.length<1000)break;offset+=1000;}return {written,removed};}
let running:Promise<SyncResult>|null=null;
export function syncNow():Promise<SyncResult>{if(running)return running;if(!navigator.onLine||!useAuthStore.getState().user?.role)return Promise.resolve({pushed:0,pulled:0,removed:0});running=(async()=>{const status=useSyncStatus.getState();status.setSyncing(true);try{const pushed=await pushOutbox();const pull=await pullChanges();status.setPending(await getDb().outbox.count());status.markSynced();return {pushed,pulled:pull.written,removed:pull.removed};}catch(e){status.setError(e instanceof Error?e.message:"Sync failed");throw e;}finally{status.setSyncing(false);running=null;}})();return running;}
