import Link from 'next/link';

const links = [
  { href: '/', label: 'Feedback' },
  { href: '/thank-you', label: 'Thank you' },
  { href: '/health', label: 'Health' },
];

export default function SiteNav() {
  return (
    <header className="border-b border-border bg-surface">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3"
      >
        <span className="font-semibold text-brand">Customer Feedback</span>
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="hover:underline">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
