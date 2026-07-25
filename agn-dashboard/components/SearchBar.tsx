'use client';

import { Firm } from '@/lib/supabase';

type SearchTerms = {
  country: string;
  city: string;
  firm: string;
};

export default function SearchBar({
  firms,
  searchTerms,
  onChange,
}: {
  firms: Firm[];
  searchTerms: SearchTerms;
  onChange: (terms: SearchTerms) => void;
}) {
  const sortedFirms = [...firms].sort((a, b) => a.name.localeCompare(b.name));

  const uniqueCountries = Array.from(
    new Set(firms.map((f) => f.country).filter(Boolean))
  ) as string[];

  const uniqueCities = Array.from(
    new Set(firms.map((f) => (f as any).city).filter(Boolean))
  ) as string[];

  return (
    <div className="search-bar">
      <div className="search-field">
        <input
          type="text"
          placeholder="Search country…"
          value={searchTerms.country}
          onChange={(e) => onChange({ ...searchTerms, country: e.target.value })}
          className="search-input"
          list="country-options"
        />
        <datalist id="country-options">
          {uniqueCountries.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        {searchTerms.country && (
          <button
            className="search-clear"
            onClick={() => onChange({ ...searchTerms, country: '' })}
            aria-label="Clear country search"
          >
            &times;
          </button>
        )}
      </div>

      <div className="search-field">
        <input
          type="text"
          placeholder="Search city…"
          value={searchTerms.city}
          onChange={(e) => onChange({ ...searchTerms, city: e.target.value })}
          className="search-input"
          list="city-options"
        />
        <datalist id="city-options">
          {uniqueCities.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        {searchTerms.city && (
          <button
            className="search-clear"
            onClick={() => onChange({ ...searchTerms, city: '' })}
            aria-label="Clear city search"
          >
            &times;
          </button>
        )}
      </div>

      <select
        value={searchTerms.firm}
        onChange={(e) => onChange({ ...searchTerms, firm: e.target.value })}
        className="search-input search-select"
      >
        <option value="">All firms</option>
        {sortedFirms.map((firm) => (
          <option key={firm.id} value={firm.name}>
            {firm.name}
          </option>
        ))}
      </select>
    </div>
  );
}