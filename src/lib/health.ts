import { connection } from 'next/server';

export interface HealthReport {
  status: 'ok';
  service: string;
  checkedAt: string;
  nodeVersion: string;
  inchargeEmailConfigured: boolean;
}

export async function getHealth(): Promise<HealthReport> {
  await connection();

  return {
    status: 'ok',
    service: 'customer-feedback-module',
    checkedAt: new Date().toISOString(),
    nodeVersion: process.version,
    inchargeEmailConfigured: Boolean(process.env.INCHARGE_EMAIL),
  };
}
