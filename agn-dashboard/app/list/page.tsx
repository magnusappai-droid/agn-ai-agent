'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase, Firm, Signal } from '@/lib/supabase';
import FilterSidebar from '@/components/FilterSidebar';
import SearchBar from '@/components/SearchBar';
import Greeting from '@/components/Greeting';
import Tabs from '@/components/Tabs';

const severityRank: Record<string, number> = {
  critical: 4,
  important: 3,
  positive: 2,
  neutral: 1,
};

const classificationColor: Record<string, string> = {
  critical: '#C0392B',
  important: '#D68910',
  positive: '#277A5C',
  neutral: '#8896A6',
};

export default function ListPage() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ region: '', country: '', valuePillar: '' });
  const [searchTerms, setSearchTerms] = useState({ country: '', city: '', firm: '' });

  useEffect(() => {
    async function loadData() {
      const { data: firmsData } = await supabase.from('firms').select('*');
      const { data: signalsData } = await supabase
        .from('signals')
        .select('*')
        .or('duplicate_status.is.null,duplicate_status.neq.likely_duplicate')
        .order('detected_at', { ascending: false });

      setFirms(firmsData || []);
      setSignals(signalsData || []);
      setLoading(false);
    }
    loadData();
  }, []);

  const firmById = useMemo(() => {
    const map = new Map<string, Firm>();
    firms.forEach((f) => map.set(f.id, f));
    return map;
  }, [firms]);

  const filteredSignals = useMemo(() => {
    return signals
      .filter((s) => {
        const firm = firmById.get(s.firm_id);
        if (!firm) return false;
        if (filters.region && firm.region !== filters.region) return false;
        if (filters.country && firm.country !== filters.country) return false;
        if (filters.valuePillar && s.value_pillar !== filters.valuePillar) return false;
        if (
          searchTerms.country &&
          !(firm.country || '').toLowerCase().includes(searchTerms.country.toLowerCase())
        )
          return false;
        if (
          searchTerms.city &&
          !((firm as any).city || '').toLowerCase().includes(searchTerms.city.toLowerCase())
        )
          return false;
        if (searchTerms.firm && firm.name !== searchTerms.firm) return false;
        return true;
      })
      .sort((a, b) => {
        const severityDiff = severityRank[b.classification] - severityRank[a.classification];
        if (severityDiff !== 0) return severityDiff;
        return new Date(b.detected_at).getTime() - new Date(a.detected_at).getTime();
      });
  }, [signals, firmById, filters, searchTerms]);

  return (
    <main className="dashboard">
      <div className="header-row">
        <Greeting />
        <SearchBar firms={firms} searchTerms={searchTerms} onChange={setSearchTerms} />
      </div>

      <Tabs />

      <div className="dashboard-body">
        <FilterSidebar firms={firms} filters={filters} onChange={setFilters} />

        <div className="list-container">
          {loading ? (
            <p className="loading-text">Loading network data…</p>
          ) : filteredSignals.length === 0 ? (
            <p className="loading-text">No signals match these filters.</p>
          ) : (
            filteredSignals.map((signal) => {
              const firm = firmById.get(signal.firm_id);
              return (
                <div className="list-card" key={signal.id}>
                  <div
                    className="list-card-stripe"
                    style={{ backgroundColor: classificationColor[signal.classification] }}
                  />
                  <div className="list-card-body">
                    <div className="list-card-top">
                      <span
                        className="signal-badge"
                        style={{ backgroundColor: classificationColor[signal.classification] }}
                      >
                        {signal.classification}
                      </span>
                      <span className="list-card-firm">{firm?.name || 'Unknown firm'}</span>
                      <span className="list-card-location">
                        {firm?.country}
                      </span>
                      <span className="signal-date">
                        {new Date(signal.detected_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="signal-text">{signal.raw_text}</p>
                    {signal.suggested_action && (
                      <p className="signal-action">
                        <strong>Suggested:</strong> {signal.suggested_action}
                      </p>
                    )}
                    {signal.source_url && (
                      <a
                        href={signal.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="signal-link"
                      >
                        View source →
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}