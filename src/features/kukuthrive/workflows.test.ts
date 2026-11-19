import { describe,it,expect } from 'vitest';
import { usableArea,observationPrompt,ordinalOutcome } from './workflows';
describe('house and welfare evidence',()=>{
  it('deducts permanent obstructions from floor area',()=>expect(usableArea(20,10,15)).toBe(185));
  it('rejects unusable house dimensions',()=>expect(()=>usableArea(20,10,200)).toThrow());
  it('missing evidence is not a welfare alarm',()=>expect(observationPrompt({})).toBe(''));
  it('keeps observed scores separate from instrument readings',()=>expect(observationPrompt({ammonia:'3',ammoniaPpm:'20'})).toBe('ammonia: observed score 3'));
  it('compares ordinal direction without averaging scores',()=>expect(ordinalOutcome('4','2')).toBe('Improved'));
  it('does not call missing reassessment improved',()=>expect(ordinalOutcome('4','')).toBe('Not reassessed'));
});