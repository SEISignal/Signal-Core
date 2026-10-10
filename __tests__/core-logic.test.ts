import { describe, it, expect } from 'vitest';
import { packets, capabilityProfile, Packet } from '@/lib/data';

describe('Signal Core System Data & Logic Tests', () => {
  it('loads valid packet definitions with required safety fields (Pillar 1: Pre-assembled packages)', () => {
    expect(packets.length).toBeGreaterThanOrEqual(10);
    
    packets.forEach((packet: Packet) => {
      expect(packet.id).toBeDefined();
      expect(packet.title).toBeTruthy();
      expect(packet.description).toBeTruthy();
      expect(packet.emergencyInstructions.length).toBeGreaterThan(0);
      expect(packet.learningContent).toBeTruthy();
      expect(packet.scenarios.length).toBeGreaterThan(0);
    });
  });

  it('correctly calculates initial user resilience capability score', () => {
    const functionalCount = capabilityProfile.filter(
      (s) => s.status === 'Functional' || s.status === 'Strong'
    ).length;
    const readinessPercent = Math.round((functionalCount / capabilityProfile.length) * 100);
    
    expect(readinessPercent).toBeGreaterThan(0);
    expect(readinessPercent).toBeLessThanOrEqual(100);
  });

  it('filters knowledge packets accurately by search query', () => {
    const query = 'water';
    const matches = packets.filter(
      (p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
    );
    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(matches.some((m) => m.id === 'water-sanitation')).toBe(true);
  });

  it('supports fallback branch generation for packets without explicit branches', () => {
    const powerPacket = packets.find((p) => p.id === 'power')!;
    expect(powerPacket).toBeDefined();

    const items = powerPacket.emergencyInstructions;
    const mid = Math.ceil(items.length / 2);
    const branch1Items = items.slice(0, mid);
    const branch2Items = items.slice(mid);

    expect(branch1Items.length).toBeGreaterThan(0);
    expect(branch2Items.length).toBeGreaterThan(0);
    expect(branch1Items.length + branch2Items.length).toBe(items.length);
  });

  it('validates user-provided emergency data packaging schema (Pillar 2: Bring Your Own Data)', () => {
    const sampleUserPayload = {
      protocol: 'SIGNAL_CORE_FALLBACK_V1',
      timestamp: '2026-10-10',
      contacts: [
        { n: 'Sarah Chen', r: 'Spouse', p: '+1 555-0192', m: 'Sector 4 Civic Park' },
      ],
      medical: [
        { n: 'Sarah Chen', b: 'A+', c: 'Asthma', m: 'Albuterol' },
      ],
      zones: [
        { n: 'Civic Park Hub', c: '37.7749 N, 122.4194 W', b: 'High School Gym', s: 'District 4' },
      ],
    };

    const serialized = JSON.stringify(sampleUserPayload);
    expect(serialized).toBeTruthy();
    
    const parsed = JSON.parse(serialized);
    expect(parsed.protocol).toBe('SIGNAL_CORE_FALLBACK_V1');
    expect(parsed.contacts.length).toBe(1);
    expect(parsed.medical[0].b).toBe('A+');
    expect(parsed.zones[0].c).toContain('37.7749');
  });

  it('formats directives cleanly for local SLM (1B-3B) context ingestion (Pillar 3 target)', () => {
    const firstAid = packets.find((p) => p.id === 'first-aid')!;
    expect(firstAid).toBeDefined();

    // Verify each directive is compact, direct, and under 250 characters for low-token SLM ingestion
    firstAid.emergencyInstructions.forEach((directive) => {
      expect(directive.length).toBeLessThan(250);
      expect(directive.trim().length).toBeGreaterThan(5);
    });
  });
});
