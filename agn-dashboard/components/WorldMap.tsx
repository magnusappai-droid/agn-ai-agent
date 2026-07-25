'use client';

import { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Firm } from '@/lib/supabase';
import { getFirmCoordinates } from '@/lib/cityCoordinates';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

type FirmWithStatus = Firm & {
  highestClassification: 'positive' | 'neutral' | 'important' | 'critical' | 'none';
};

const pinColors: Record<string, string> = {
  critical: '#C0392B',
  important: '#D68910',
  positive: '#277A5C',
  neutral: '#8896A6',
  none: '#C4CDD5',
};

export default function WorldMap({
  firms,
  onSelectFirm,
}: {
  firms: FirmWithStatus[];
  onSelectFirm: (firm: FirmWithStatus) => void;
}) {
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  return (
    <div
      className="world-map-wrap"
      onMouseMove={(e) => setHoverPos({ x: e.clientX, y: e.clientY })}
      style={{ position: 'relative' }}
    >
      {hoverLabel && (
        <div
          className="map-tooltip"
          style={{ left: hoverPos.x + 14, top: hoverPos.y + 14 }}
        >
          {hoverLabel}
        </div>
      )}

      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 155 }}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#F4F1EA"
                stroke="#DCD5C4"
                strokeWidth={0.6}
                onMouseEnter={() => setHoverLabel(geo.properties.name)}
                onMouseLeave={() => setHoverLabel(null)}
                style={{
                  default: { outline: 'none' },
                  hover: { outline: 'none', fill: '#ECE6D8' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>

        {firms.map((firm) => {
          const coords = getFirmCoordinates(firm.city ?? null, firm.country);
          const color = pinColors[firm.highestClassification];
          const isPulsing = firm.highestClassification === 'critical' || firm.highestClassification === 'important';

          return (
            <Marker
              key={firm.id}
              coordinates={coords}
              onClick={() => onSelectFirm(firm)}
              onMouseEnter={() => setHoverLabel(firm.name)}
              onMouseLeave={() => setHoverLabel(null)}
            >
              {isPulsing && (
                <circle r={9} fill={color} opacity={0.35} className="pin-pulse" />
              )}
              <circle
                r={6}
                fill={color}
                stroke="#FFFFFF"
                strokeWidth={1.5}
                className="pin-dot"
              />
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
}