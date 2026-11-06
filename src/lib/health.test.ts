import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/server', () => ({
  connection: () => Promise.resolve(),
}));

import { getHealth } from './health';

describe('getHealth', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('reports ok with the service name and node version', async () => {
    const report = await getHealth();

    expect(report.status).toBe('ok');
    expect(report.service).toBe('customer-feedback-module');
    expect(report.nodeVersion).toBe(process.version);
  });

  it('returns checkedAt as a valid ISO timestamp', async () => {
    const report = await getHealth();

    expect(new Date(report.checkedAt).toISOString()).toBe(report.checkedAt);
  });

  it('reports the incharge email as not configured when unset', async () => {
    vi.stubEnv('INCHARGE_EMAIL', '');

    const report = await getHealth();

    expect(report.inchargeEmailConfigured).toBe(false);
  });

  it('reports configured without exposing the address', async () => {
    vi.stubEnv('INCHARGE_EMAIL', 'someone@example.com');

    const report = await getHealth();

    expect(report.inchargeEmailConfigured).toBe(true);
    expect(JSON.stringify(report)).not.toContain('someone@example.com');
  });
});

