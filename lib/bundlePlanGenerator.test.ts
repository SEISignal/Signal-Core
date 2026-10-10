import { describe, it, expect } from 'vitest';
import { generateCustomBundle } from './bundlePlanGenerator';
import { packets } from './data';

describe('Bundle Plan Generator', () => {
  it('generates a complete 3-phase curriculum with drills for selected packets', () => {
    const bundle = generateCustomBundle({
      name: 'Desert Operations Kit',
      climate: 'arid',
      profession: 'logistics',
      riskLevel: 'high',
      selectedPacketIds: ['first-aid', 'water-sanitation', 'navigation'],
      packets
    });

    expect(bundle.name).toBe('Desert Operations Kit');
    expect(bundle.climate).toBe('arid');
    expect(bundle.profession).toBe('logistics');
    expect(bundle.riskLevel).toBe('high');
    expect(bundle.phases.length).toBe(3);

    // Verify all phases have drills and milestones
    bundle.phases.forEach((phase) => {
      expect(phase.drills.length).toBeGreaterThanOrEqual(1);
      expect(phase.milestones.length).toBeGreaterThanOrEqual(1);
      phase.drills.forEach((drill) => {
        expect(drill.title).toBeDefined();
        expect(drill.instructions.length).toBeGreaterThan(0);
        expect(drill.durationMinutes).toBeGreaterThan(0);
        expect(drill.completed).toBe(false);
      });
    });

    // Verify arid climate focus is present
    const wsDrill = bundle.phases[0].drills.find(d => d.category === 'Water & Sanitation');
    expect(wsDrill).toBeDefined();
    expect(wsDrill?.environmentNote).toContain('Solar UV');
  });

  it('adapts drills and notes when subarctic climate is selected', () => {
    const bundle = generateCustomBundle({
      name: 'Boreal Winter Readiness',
      climate: 'subarctic',
      profession: 'trades',
      riskLevel: 'moderate',
      selectedPacketIds: ['first-aid', 'shelter', 'repair'],
      packets
    });

    expect(bundle.climate).toBe('subarctic');
    const faDrill = bundle.phases[0].drills.find(d => d.category === 'First Aid');
    expect(faDrill?.environmentNote).toContain('heavy insulated work gloves');

    const shelterDrill = bundle.phases[1].drills.find(d => d.category === 'Shelter & Warmth');
    expect(shelterDrill?.environmentNote).toContain('12 inches off packed snow');
  });

  it('guarantees at least 2 drills per phase even with single packet selected', () => {
    const bundle = generateCustomBundle({
      name: 'Minimal Test Bundle',
      climate: 'temperate',
      profession: 'urban_resident',
      riskLevel: 'low',
      selectedPacketIds: ['reasoning'],
      packets
    });

    expect(bundle.phases[0].drills.length).toBeGreaterThanOrEqual(2);
    expect(bundle.phases[1].drills.length).toBeGreaterThanOrEqual(2);
    expect(bundle.phases[2].drills.length).toBeGreaterThanOrEqual(2);
    expect(bundle.totalEstimatedHours).toBeGreaterThanOrEqual(6);
  });
});
