import { getDb, save, today, uid, type Flock } from '@/lib/db';
import { syncNow } from '@/lib/sync';

export interface ModuleRecord { id: string; feature: string; date: string; fields: Record<string, string> }
export function usableArea(length: number, width: number, obstructions: number) {
  if (![length, width, obstructions].every(Number.isFinite) || length <= 0 || width <= 0 || obstructions < 0 || obstructions >= length * width) throw new Error('Enter positive dimensions and obstructions smaller than the floor area.');
  return length * width - obstructions;
}
export function observationPrompt(fields: Record<string, string>) {
  const scores = ['heat', 'air', 'ammonia', 'litter', 'intake', 'health'].map(key => ({key, value: fields[key] ? Number(fields[key]) : undefined}));
  return scores.filter(s => s.value !== undefined && s.value >= 3).map(s => `${s.key}: observed score ${s.value}`).join('; ');
}
export function ordinalOutcome(before: string, after: string) {
  if (!before || !after) return 'Not reassessed';
  const a=Number(before), b=Number(after);
  if (![a,b].every(n=>Number.isInteger(n)&&n>=1&&n<=4)) return 'Not comparable';
  return b<a?'Improved':b>a?'Worsened':'Unchanged';
}
export function flockHouse(flock: Flock): string {
  if (flock.houseId) return flock.houseId;
  return '';
}
export async function persistModule(feature: string, fields: Record<string,string>, actor: string, id=uid()) {
  const row:ModuleRecord={id,feature,date:fields['date']||today(),fields};
  await save('moduleRecords',row,actor);
  if(navigator.onLine) { try { await syncNow(); } catch { /* queued on device */ } }
  return row;
}
export async function recordAssessment(fields: Record<string,string>, actor: string) {
  for(const key of ['heat','air','ammonia','litter','intake','health']) {
    const v=fields[key]; if(v && (!Number.isInteger(Number(v))||Number(v)<1||Number(v)>4)) throw new Error('Observed scores must be whole numbers from 1 to 4.');
  }
  if(!['heat','air','ammonia','litter','intake','health'].some(key=>fields[key])) throw new Error('Record at least one observation.');
  const row=await persistModule('assessment',{...fields,observer:actor,scaleVersion:'1'},actor);
  const prompt=observationPrompt(fields);
  if(prompt) await save('alerts',{id:`welfare:${row.id}`,type:'Welfare investigation',description:prompt,related:row.id,date:row.date,severity:Object.values(fields).some(v=>v==='4')?'High':'Medium',read:false,resolved:false},actor);
  await syncNow().catch(()=>undefined);
  return row;
}
export async function modules(feature:string) {return getDb().moduleRecords.where('feature').equals(feature).toArray();}