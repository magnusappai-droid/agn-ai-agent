'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase, Firm, Signal } from '@/lib/supabase';
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
  const [filters, setFilters] = useState({ region: '', country: '', valuePillar: '' });
  const [searchTerms, setSearchTerms] = useState({ country: '', city: '', firm: '' });

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
        const firmSignals = signals.filter(
          (s) => s.firm_id === firm.id && s.duplicate_status !== 'likely_duplicate'
        );
        const relevantSignals = filters.valuePillar
          ? firmSignals.filter((s) => s.value_pillar === filters.valuePillar)
          : firmSignals;

        const highest = relevantSignals.reduce((acc, s) => {
          return severityRank[s.classification] > severityRank[acc] ? s.classification : acc;
        }, 'neutral' as string);

        return {
          ...firm,
          highestClassification: relevantSignals.length > 0 ? highest : 'none',
        } as Firm & { highestClassification: string };
      })
      .filter((firm) => {
        if (!filters.valuePillar) return true;
        return signals.some((s) => s.firm_id === firm.id && s.value_pillar === filters.valuePillar);
      });
  }, [firms, signals, filters, searchTerms]);

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
          onClose={() => setSelectedFirm(null)}
        />
      )}
    </main>
  );
}