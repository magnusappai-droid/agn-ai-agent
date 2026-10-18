'use client';

import { Firm } from '@/lib/supabase';

type Filters = {
  region: string;
  country: string;
  valuePillar: string;
  severity: string;
  leadStatus: string;
  savedOnly: boolean;
};

export default function FilterSidebar({
  firms,
  filters,
  onChange,
  firmType = 'member',
}: {
  firms: Firm[];
  filters: Filters;
  onChange: (filters: Filters) => void;
  firmType?: 'member' | 'prospect';
}) {
  const regions = Array.from(new Set(firms.map((f) => f.region).filter(Boolean))) as string[];
  const countriesInRegion = Array.from(
    new Set(
      firms
        .filter((f) => !filters.region || f.region === filters.region)
        .map((f) => f.country)
        .filter(Boolean)
    )
  ) as string[];

  // Only offer temperatures that actually exist in the loaded prospects, so
  // the control never shows an option that returns nothing.
  const leadStatuses = (['hot', 'warm', 'cold'] as const).filter((status) =>
    firms.some((f) => f.lead_status === status)
  );

  const showTemperature = firmType === 'prospect' && leadStatuses.length > 0;

  return (
    <aside className="filter-sidebar">
      <h3 className="filter-heading">Bookmarks</h3>
      <div className="filter-group">
        <button
          className={`filter-chip ${filters.savedOnly ? 'active' : ''}`}
          onClick={() => onChange({ ...filters, savedOnly: !filters.savedOnly })}
        >
          {filters.savedOnly ? '★ Saved only' : '☆ Saved only'}
        </button>
      </div>

      {showTemperature && (
        <>
          <h3 className="filter-heading">Temperature</h3>
          <div className="filter-group">
            <button
              className={`filter-chip ${filters.leadStatus === '' ? 'active' : ''}`}
              onClick={() => onChange({ ...filters, leadStatus: '' })}
            >
              All
            </button>
            {leadStatuses.map((status) => (
              <button
                key={status}
                className={`filter-chip chip-temp chip-temp-${status} ${
                  filters.leadStatus === status ? 'active' : ''
                }`}
                onClick={() => onChange({ ...filters, leadStatus: status })}
              >
                {status}
              </button>
            ))}
          </div>
        </>
      )}

      <h3 className="filter-heading">Region</h3>
      <div className="filter-group">
        <button
          className={`filter-chip ${filters.region === '' ? 'active' : ''}`}
          onClick={() => onChange({ ...filters, region: '', country: '' })}
        >
          All
        </button>
        {regions.map((region) => (
          <button
            key={region}
            className={`filter-chip ${filters.region === region ? 'active' : ''}`}
            onClick={() => onChange({ ...filters, region, country: '' })}
          >
            {region}
          </button>
        ))}
      </div>

      {filters.region && (
        <>
          <h3 className="filter-heading">Country</h3>
          <div className="filter-group">
            <button
              className={`filter-chip ${filters.country === '' ? 'active' : ''}`}
              onClick={() => onChange({ ...filters, country: '' })}
            >
              All
            </button>
            {countriesInRegion.map((country) => (
              <button
                key={country}
                className={`filter-chip ${filters.country === country ? 'active' : ''}`}
                onClick={() => onChange({ ...filters, country })}
              >
                {country}
              </button>
            ))}
          </div>
        </>
      )}

      <h3 className="filter-heading">Value pillar</h3>
      <div className="filter-group">
        {['', 'talent', 'service_evolution', 'technology', 'other'].map((pillar) => (
          <button
            key={pillar || 'all'}
            className={`filter-chip ${filters.valuePillar === pillar ? 'active' : ''}`}
            onClick={() => onChange({ ...filters, valuePillar: pillar })}
          >
            {pillar === '' ? 'All' : pillar.replace('_', ' ')}
          </button>
        ))}
      </div>

      <h3 className="filter-heading">Severity</h3>
      <div className="filter-group">
        {['', 'critical', 'important', 'positive', 'neutral'].map((sev) => (
          <button
            key={sev || 'all'}
            className={`filter-chip ${filters.severity === sev ? 'active' : ''}`}
            onClick={() => onChange({ ...filters, severity: sev })}
          >
            {sev === '' ? 'All' : sev}
          </button>
        ))}
      </div>
    </aside>
  );
}