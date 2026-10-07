'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MEMBER_TABS = [
  { label: 'Map', href: '/' },
  { label: 'List', href: '/list' },
];

const PROSPECT_TABS = [
  { label: 'Map', href: '/prospects' },
  { label: 'List', href: '/prospects/list' },
];

const AUDIENCES = [
  { label: 'Members', href: '/' },
  { label: 'Prospects', href: '/prospects' },
];

export default function Tabs() {
  const pathname = usePathname();
  const isProspects = pathname.startsWith('/prospects');
  const tabs = isProspects ? PROSPECT_TABS : MEMBER_TABS;

  return (
    <div className="tabs-wrapper">
      <nav className="tabs-row" aria-label="View switcher">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`tab-link${isActive ? ' active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <nav className="audience-row" aria-label="Audience switcher">
        {AUDIENCES.map((audience) => {
          const isActive =
            audience.href === '/prospects' ? isProspects : !isProspects;

          return (
            <Link
              key={audience.href}
              href={audience.href}
              className={`audience-link${isActive ? ' active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {audience.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}