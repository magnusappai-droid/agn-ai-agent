'use client';

import { Firm, Signal } from '@/lib/supabase';

const classificationLabel: Record<string, string> = {
  critical: 'Critical',
  important: 'Important',
  positive: 'Positive',
  neutral: 'Neutral',
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

export default function FirmModal({
  firm,
  signals,
  savedIds,
  onToggleSave,
  onClose,
}: {
  firm: Firm;
  signals: Signal[];
  savedIds: Set<string>;
  onToggleSave: (signalId: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        <div className="modal-header">
          <span className="modal-eyebrow">{firm.region || firm.country}</span>
          <h2 className="modal-title">{firm.name}</h2>
          <div className="modal-meta">
            {firm.country && <span>{firm.country}</span>}
            {firm.membership_tier && <span>· {firm.membership_tier.replace('_', ' ')}</span>}
          </div>
        </div>

        {firm.summary && <p className="modal-summary">{firm.summary}</p>}

        <div className="modal-signals">
          <h3>Recent signals</h3>
          {signals.length === 0 && (
            <p className="modal-empty">No signals recorded yet for this firm.</p>
          )}
          {signals
            .filter((s) => s.duplicate_status !== 'likely_duplicate')
            .map((signal) => (
              <div className="signal-card" key={signal.id}>
                <div className="signal-card-top">
                  <span
                    className="signal-badge"
                    style={{ backgroundColor: classificationColor[signal.classification] }}
                  >
                    {classificationLabel[signal.classification]}
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
                    onToggle={() => onToggleSave(signal.id)}
                  />
                </div>
                <p className="signal-text">{signal.raw_text}</p>
                {signal.suggested_action && (
                  <p className="signal-action">
                    <strong>Suggested:</strong> {signal.suggested_action}
                  </p>
                )}
                {signal.source_url && (
                  <a href={signal.source_url} target="_blank" rel="noopener noreferrer" className="signal-link">
                    View source →
                  </a>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
