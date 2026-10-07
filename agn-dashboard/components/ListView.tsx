'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase, Firm, Signal } from '@/lib/supabase';
import { useSavedSignals } from '@/lib/useSavedSignals';
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

function BookmarkButton({
  saved,
  onToggle,
}: {
  saved: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className={`bookmark-btn ${saved ? 'saved' : ''}`}
      onClick={onToggle}
      aria-label={saved ? 'Remove bookmark' : 'Save bookmark'}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={saved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}

export default function ListView({ firmType }: { firmType: 'member' | 'prospect' }) {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    region: '',
    country: '',
    valuePillar: '',
    severity: '',
    savedOnly: false,
  });
  const [searchTerms, setSearchTerms] = useState({ country: '', city: '', firm: '' });

  const { savedIds, toggleSave } = useSavedSignals();

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);

      const { data: firmsData } = await supabase
        .from('firms')
        .select('*')
        .eq('firm_type', firmType);

      const firmIds = (firmsData || []).map((f) => f.id);

      // Only pull signals belonging to this audience's firms, rather than
      // fetching everything and filtering client side.
      const { data: signalsData } = firmIds.length
        ? await supabase
            .from('signals')
            .select('*')
            .in('firm_id', firmIds)
            .order('detected_at', { ascending: false })
        : { data: [] as Signal[] };

      if (cancelled) return;

      setFirms(firmsData || []);
      // Filter out duplicates in JS rather than in the query, since
      // Postgres' .neq() silently excludes rows where duplicate_status
      // is NULL instead of including them.
      setSignals((signalsData || []).filter((s) => s.duplicate_status !== 'likely_duplicate'));
      setLoading(false);
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [firmType]);

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
        if (filters.savedOnly && !savedIds.has(s.id)) return false;
        if (filters.region && firm.region !== filters.region) return false;
        if (filters.country && firm.country !== filters.country) return false;
        if (filters.valuePillar && s.value_pillar !== filters.valuePillar) return false;
        if (filters.severity && s.classification !== filters.severity) return false;
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
        const dateA = new Date(a.detected_at).toDateString();
        const dateB = new Date(b.detected_at).toDateString();
  
         if (dateA !== dateB) {
         return new Date(b.detected_at).getTime() - new Date(a.detected_at).getTime();
        }
  
        return severityRank[b.classification] - severityRank[a.classification];
        });
  }, [signals, firmById, filters, searchTerms, savedIds]);

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
            <p className="loading-text">
              {filters.savedOnly ? 'No saved signals match these filters.' : 'No signals match these filters.'}
            </p>
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
                      <BookmarkButton
                        saved={savedIds.has(signal.id)}
                        onToggle={() => toggleSave(signal.id)}
                      />
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