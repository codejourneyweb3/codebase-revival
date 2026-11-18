import Dexie, { type Table } from "dexie";

export type FlockType = "Layer" | "Broiler";
export interface Flock {
  id: string;
  name: string;
  type: FlockType;
  breed: string;
  dateReceived: string;
  initialCount: number;
  liveCount: number;
  supplier: string;
  costPerChick: number;
  status: "Active" | "Closed";
  health: "Good" | "Watch" | "Concern";
  notes?: string;
  targetWeightKg?: number;
}
export interface DailyReport {
  id: string;
  flockId: string;
  date: string;
  manager: string;
  status: "Draft" | "Submitted";
  condition?: string;
  sickBirds?: number;
  observations?: string;
  deaths?: number;
  deathCause?: string;
  disposal?: string;
  feedType?: string;
  feedGivenKg?: number;
  feedRemainingKg?: number;
  waterL?: number;
  temperatureC?: number;
  ventilation?: string;
  litter?: string;
  eggs?: number;
  broken?: number;
  cracked?: number;
  gradeSmall?: number;
  gradeMedium?: number;
  gradeLarge?: number;
  gradeXl?: number;
  avgWeightKg?: number;
  uniformity?: number;
  sampled?: number;
  notes?: string;
  step?: number;
}
export interface Customer {
  id: string;
  name: string;
  phone: string;
  creditLimit: number;
}
export type Product = "Eggs (tray)" | "Live chicken" | "Spent hen" | "Manure (bag)";
export interface Sale {
  id: string;
  ref: string;
  date: string;
  customerId: string;
  flockId?: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  paymentMethod: string;
  notes?: string;
  reversalOf?: string;
}
export interface Payment {
  id: string;
  saleId: string;
  date: string;
  amount: number;
  method: string;
}
export type ExpenseCategory =
  "Feed" | "Medication" | "Labour" | "Utilities" | "Equipment" | "Transport" | "Other";
export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  flockId?: string;
  supplier?: string;
  amount: number;
  paid: number;
  method: string;
  notes?: string;
}
export interface FeedStock {
  id: string;
  feedType: string;
  quantityKg: number;
  reorderKg: number;
  avgDailyKg: number;
}
export interface FeedDelivery {
  id: string;
  date: string;
  supplier: string;
  feedType: string;
  quantityKg: number;
  cost: number;
  notes?: string;
}
export interface Medication {
  id: string;
  name: string;
  type: string;
  quantity: number;
  cost: number;
  supplier: string;
  expiry: string;
}
export interface Vaccination {
  id: string;
  flockId: string;
  vaccine: string;
  dueDate: string;
  done: boolean;
}
export interface Treatment {
  id: string;
  flockId: string;
  product: string;
  date: string;
  dosage: string;
  by: string;
  withdrawalDays: number;
  response?: string;
}
export interface Visit {
  id: string;
  date: string;
  visitor: string;
  vehicle?: string;
  purpose: string;
  disinfected: boolean;
  recordedBy: string;
}
export interface Alert {
  id: string;
  type: string;
  description: string;
  related?: string;
  date: string;
  severity: "Low" | "Medium" | "High";
  read: boolean;
  resolved: boolean;
}
export interface Doc {
  id: string;
  name: string;
  type: string;
  issue: string;
  expiry: string;
  fileName?: string;
  dataUrl?: string;
}
export interface Equipment {
  id: string;
  name: string;
  purchaseDate: string;
  cost: number;
  condition: string;
  nextService: string;
}
export interface CashUp {
  id: string;
  date: string;
  method: "Cash" | "Mobile money" | "Bank";
  opening: number;
  counted: number;
}
export interface Audit {
  id?: number;
  at: string;
  user: string;
  action: string;
  entity: string;
}
export interface Outbox {
  id?: number;
  at: string;
  table: string;
  op: string;
  recordId: string;
}

/** Per-day numbers split out of a daily report so each syncs to its own server table. */
export interface EggRecord {
  id: string;
  flockId: string;
  reportId: string;
  date: string;
  collected: number;
  broken: number;
  cracked: number;
  gradeSmall: number;
  gradeMedium: number;
  gradeLarge: number;
  gradeXl: number;
}
export interface MortalityRecord {
  id: string;
  flockId: string;
  reportId: string;
  date: string;
  count: number;
  suspectedCause: string;
  disposal: string;
  notes?: string;
}
export interface FeedUsage {
  id: string;
  flockId: string;
  reportId: string;
  date: string;
  feedType: string;
  quantityKg: number;
  stockLeftKg: number;
}
export interface WeightSample {
  id: string;
  flockId: string;
  reportId: string;
  date: string;
  sampled: number;
  averageWeightKg: number;
  cvPercent: number;
}

/** Tables the server already syncs but the client had no local store for. */
export interface Photo {
  id: string;
  flockId?: string;
  date: string;
  caption: string;
  dataUrl: string;
}
export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  items: string;
  balance: number;
}
export interface ExpenseCategoryRow {
  id: string;
  name: string;
  active: boolean;
}
export interface ExpensePayment {
  id: string;
  expenseId: string;
  date: string;
  amount: number;
  method: string;
}
export interface PriceChange {
  id: string;
  product: string;
  date: string;
  unitPrice: number;
  note?: string;
}
export interface StaffPayment {
  id: string;
  date: string;
  name: string;
  role: string;
  amount: number;
  method: string;
}
export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  date: string;
  description: string;
  cost: number;
  doneBy: string;
}
export interface PushSubscriptionRow {
  id: string;
  endpoint: string;
  keys: string;
  userAgent: string;
}

class FarmDB extends Dexie {
  declare moduleRecords: Table<{id: string; feature: string; date: string; fields: Record<string,string>},string>;
  declare flocks: Table<Flock, string>;
  declare reports: Table<DailyReport, string>;
  declare customers: Table<Customer, string>;
  declare sales: Table<Sale, string>;
  declare payments: Table<Payment, string>;
  declare expenses: Table<Expense, string>;
  declare feedStock: Table<FeedStock, string>;
  declare feedDeliveries: Table<FeedDelivery, string>;
  declare medications: Table<Medication, string>;
  declare vaccinations: Table<Vaccination, string>;
  declare treatments: Table<Treatment, string>;
  declare visits: Table<Visit, string>;
  declare alerts: Table<Alert, string>;
  declare documents: Table<Doc, string>;
  declare equipment: Table<Equipment, string>;
  declare cashups: Table<CashUp, string>;
  declare audit: Table<Audit, number>;
  declare outbox: Table<Outbox, number>;
  declare eggRecords: Table<EggRecord, string>;
  declare mortalityRecords: Table<MortalityRecord, string>;
  declare feedUsage: Table<FeedUsage, string>;
  declare weightSamples: Table<WeightSample, string>;
  declare photos: Table<Photo, string>;
  declare suppliers: Table<Supplier, string>;
  declare expenseCategories: Table<ExpenseCategoryRow, string>;
  declare expensePayments: Table<ExpensePayment, string>;
  declare priceHistory: Table<PriceChange, string>;
  declare staffPayments: Table<StaffPayment, string>;
  declare maintenanceRecords: Table<MaintenanceRecord, string>;
  declare pushSubscriptions: Table<PushSubscriptionRow, string>;
  constructor() {
    super(`kukuthrive:${activeAccount}`);
    this.version(1).stores({
      flocks: "id,status,type,dateReceived",
      reports: "id,flockId,date,status",
      customers: "id",
      sales: "id,date,customerId,flockId",
      payments: "id,saleId,date",
      expenses: "id,date,flockId",
      feedStock: "id",
      feedDeliveries: "id,date",
      medications: "id",
      vaccinations: "id,flockId,dueDate",
      treatments: "id,flockId",
      visits: "id,date",
      alerts: "id,resolved",
      documents: "id",
      equipment: "id",
      cashups: "id,date",
      audit: "++id,at",
      outbox: "++id",
    });
    // v2: daily-report egg/mortality/feed/weight numbers get their own tables so each
    // row syncs to the matching server table instead of riding along inside a report.
    this.version(2).stores({
      eggRecords: "id,flockId,reportId,date",
      mortalityRecords: "id,flockId,reportId,date",
      feedUsage: "id,flockId,reportId,date",
      weightSamples: "id,flockId,reportId,date",
    });
    // v3: stores for the server tables that previously had no client counterpart, so
    // photos, suppliers, expense payments and the rest round-trip through sync.
    this.version(3).stores({
      photos: "id,flockId,date",
      suppliers: "id,name",
      expenseCategories: "id,name",
      expensePayments: "id,expenseId,date",
      priceHistory: "id,product,date",
      staffPayments: "id,date,name",
      maintenanceRecords: "id,equipmentId,date",
      pushSubscriptions: "id",
    });
    this.version(4).stores({ moduleRecords: "id,feature,date" });
  }
}

let activeAccount = "signed-out";
let _db: FarmDB | null = null;
export function setDbAccount(id: string) { if (activeAccount !== id) { _db?.close(); _db = null; activeAccount = id; } }
export function getDb() {
  if (!_db) _db = new FarmDB();
  return _db;
}

export const uid = () => crypto.randomUUID();
export const today = () => new Date().toISOString().slice(0, 10);

type TableName = Exclude<keyof FarmDB, keyof Dexie>;

/** Write locally first, then queue for background sync and log to the audit trail. */
export async function save<T extends { id: string }>(
  table: TableName,
  record: T,
  user: string,
  action = "saved",
) {
  const db = getDb();
  await db.transaction("rw", [db.table(table), db.outbox, db.audit], async () => {
    await db.table(table).put(record);
    await db.outbox.add({ at: new Date().toISOString(), table, op: "upsert", recordId: record.id });
    await db.audit.add({
      at: new Date().toISOString(),
      user,
      action: `${action} ${table}`,
      entity: record.id,
    });
  });
}

/**
 * Save a daily report and split its per-day numbers into the child tables.
 * Row ids are derived from the report id, so saving the same report again updates
 * the child rows instead of duplicating them.
 */
export async function saveDailyReport(report: DailyReport, user: string) {
  const db = getDb();
  const now = new Date().toISOString();

  const eggs: EggRecord | null =
    report.eggs === undefined
      ? null
      : {
          id: `${report.id}:eggs`,
          flockId: report.flockId,
          reportId: report.id,
          date: report.date,
          collected: report.eggs,
          broken: report.broken ?? 0,
          cracked: report.cracked ?? 0,
          gradeSmall: report.gradeSmall ?? 0,
          gradeMedium: report.gradeMedium ?? 0,
          gradeLarge: report.gradeLarge ?? 0,
          gradeXl: report.gradeXl ?? 0,
        };

  const mortality: MortalityRecord | null =
    report.deaths === undefined
      ? null
      : {
          id: `${report.id}:mortality`,
          flockId: report.flockId,
          reportId: report.id,
          date: report.date,
          count: report.deaths,
          suspectedCause: report.deathCause ?? "",
          disposal: report.disposal ?? "",
          notes: report.notes,
        };

  const feed: FeedUsage | null =
    report.feedGivenKg === undefined
      ? null
      : {
          id: `${report.id}:feed`,
          flockId: report.flockId,
          reportId: report.id,
          date: report.date,
          feedType: report.feedType ?? "",
          quantityKg: report.feedGivenKg,
          stockLeftKg: report.feedRemainingKg ?? 0,
        };

  const weight: WeightSample | null =
    report.avgWeightKg === undefined
      ? null
      : {
          id: `${report.id}:weight`,
          flockId: report.flockId,
          reportId: report.id,
          date: report.date,
          sampled: report.sampled ?? 0,
          averageWeightKg: report.avgWeightKg,
          cvPercent: report.uniformity ?? 0,
        };

  await db.transaction(
    "rw",
    [
      db.reports,
      db.eggRecords,
      db.mortalityRecords,
      db.feedUsage,
      db.weightSamples,
      db.outbox,
      db.audit,
    ],
    async () => {
      await db.reports.put(report);
      await db.outbox.add({ at: now, table: "reports", op: "upsert", recordId: report.id });

      if (eggs) {
        await db.eggRecords.put(eggs);
        await db.outbox.add({ at: now, table: "eggRecords", op: "upsert", recordId: eggs.id });
      }
      if (mortality) {
        await db.mortalityRecords.put(mortality);
        await db.outbox.add({
          at: now,
          table: "mortalityRecords",
          op: "upsert",
          recordId: mortality.id,
        });
      }
      if (feed) {
        await db.feedUsage.put(feed);
        await db.outbox.add({ at: now, table: "feedUsage", op: "upsert", recordId: feed.id });
      }
      if (weight) {
        await db.weightSamples.put(weight);
        await db.outbox.add({ at: now, table: "weightSamples", op: "upsert", recordId: weight.id });
      }

      await db.audit.add({ at: now, user, action: "saved daily report", entity: report.id });
    },
  );
}
