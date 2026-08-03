'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase, Firm, Signal } from '@/lib/supabase';
import { useSavedSignals } from '@/lib/useSavedSignals';
import WorldMap from '@/components/WorldMap';
import FirmModal from '@/components/FirmModal';
import FilterSidebar from '@/components/FilterSidebar';
import Greeting from '@/components/Greeting';
import SearchBar from '@/components/SearchBar';
import Tabs from '@/components/Tabs'

const severityRank: Record<string, number> = {
  critical: 4,
  important: 3,
  positive: 2,
  neutral: 1,
};

export default function DashboardPage() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [selectedFirm, setSelectedFirm] = useState<Firm | null>(null);
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
    async function loadData() {
      const { data: firmsData } = await supabase.from('firms').select('*');
      const { data: signalsData } = await supabase
        .from('signals')
        .select('*')
        .order('detected_at', { ascending: false });

      setFirms(firmsData || []);
      setSignals(signalsData || []);
      setLoading(false);
    }
    loadData();
  }, []);

  const firmsWithStatus = useMemo(() => {
    return firms
      .filter((f) => !filters.region || f.region === filters.region)
      .filter((f) => !filters.country || f.country === filters.country)
      .filter((f) =>
        !searchTerms.country || (f.country || '').toLowerCase().includes(searchTerms.country.toLowerCase())
      )
      .filter((f) =>
        !searchTerms.city || ((f as any).city || '').toLowerCase().includes(searchTerms.city.toLowerCase())
      )
      .filter((f) =>
        !searchTerms.firm || f.name === searchTerms.firm)

      .map((firm) => {
        let firmSignals = signals.filter(
          (s) => s.firm_id === firm.id && s.duplicate_status !== 'likely_duplicate'
        );

        if (filters.valuePillar) {
          firmSignals = firmSignals.filter((s) => s.value_pillar === filters.valuePillar);
        }
        if (filters.severity) {
          firmSignals = firmSignals.filter((s) => s.classification === filters.severity);
        }

        // Saved-only narrows the signals considered for this pin down to
        // ones the current user has bookmarked -- this affects both
        // whether the pin shows at all, and which classification colors it.
        const relevantSignals = filters.savedOnly
          ? firmSignals.filter((s) => savedIds.has(s.id))
          : firmSignals;

        const highest = relevantSignals.reduce((acc, s) => {
          return severityRank[s.classification] > severityRank[acc] ? s.classification : acc;
        }, 'neutral' as string);

        return {
          ...firm,
          highestClassification: relevantSignals.length > 0 ? highest : 'none',
          _relevantSignalCount: relevantSignals.length,
        } as Firm & { highestClassification: string; _relevantSignalCount: number };
      })
      .filter((firm) => {
        // With a value pillar filter active, only show firms that have
        // at least one matching signal at all.
        if ((filters.valuePillar || filters.severity) && firm._relevantSignalCount === 0 && !filters.savedOnly) {
        return false;
        }
        // Saved-only: only show firms with at least one saved signal
        // (after any other filters above have already narrowed things down).
        if (filters.savedOnly && firm._relevantSignalCount === 0) {
          return false;
        }
        return true;
      });
  }, [firms, signals, filters, searchTerms, savedIds]);

  const selectedFirmSignals = selectedFirm
    ? signals
        .filter((s) => s.firm_id === selectedFirm.id)
        .sort((a, b) => new Date(b.detected_at).getTime() - new Date(a.detected_at).getTime())
    : [];

  return (
    <main className="dashboard">
      <div className="header-row">
        <Greeting />
        <SearchBar firms={firms} searchTerms={searchTerms} onChange={setSearchTerms} />
      </div>

      <Tabs />

      <div className="dashboard-body">
        <FilterSidebar firms={firms} filters={filters} onChange={setFilters} />

        <div className="map-container">
          {loading ? (
            <p className="loading-text">Loading network data…</p>
          ) : (
            <WorldMap firms={firmsWithStatus as any} onSelectFirm={setSelectedFirm as any} />
          )}
        </div>
      </div>

      {selectedFirm && (
        <FirmModal
          firm={selectedFirm}
          signals={selectedFirmSignals}
          savedIds={savedIds}
          onToggleSave={toggleSave}
          onClose={() => setSelectedFirm(null)}
        />
      )}
    </main>
  );
}
