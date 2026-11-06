import { Suspense } from 'react';
import { getHealth } from '@/lib/health';

async function HealthDetails() {
  const report = await getHealth();

  return (
    <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-[max-content_1fr]">
      <dt className="font-medium">Status</dt>
      <dd>{report.status}</dd>
      <dt className="font-medium">Service</dt>
      <dd>{report.service}</dd>
      <dt className="font-medium">Checked at</dt>
      <dd>{report.checkedAt}</dd>
      <dt className="font-medium">Node version</dt>
      <dd>{report.nodeVersion}</dd>
      <dt className="font-medium">Incharge email configured</dt>
      <dd>{report.inchargeEmailConfigured ? 'yes' : 'no'}</dd>
    </dl>
  );
}

export default function HealthPage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold">Health check</h1>
      <Suspense fallback={<p className="mt-4 text-muted">Checking...</p>}>
        <HealthDetails />
      </Suspense>
    </section>
  );
}
