'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

// Shared by both Map and List views so a bookmark toggled in one place
// (e.g. the FirmModal) is instantly reflected everywhere else.
export function useSavedSignals() {
  const supabase = createClient();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }
      setUserId(user.id);

      const { data } = await supabase
        .from('saved_signals')
        .select('signal_id')
        .eq('user_id', user.id);

      setSavedIds(new Set((data || []).map((row) => row.signal_id)));
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSave = useCallback(
    async (signalId: string) => {
      if (!userId) return;

      const isSaved = savedIds.has(signalId);

      // Optimistic update so the icon flips instantly, not after the round trip
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (isSaved) next.delete(signalId);
        else next.add(signalId);
        return next;
      });

      if (isSaved) {
        await supabase
          .from('saved_signals')
          .delete()
          .eq('user_id', userId)
          .eq('signal_id', signalId);
      } else {
        await supabase
          .from('saved_signals')
          .insert({ user_id: userId, signal_id: signalId });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userId, savedIds]
  );

  return { savedIds, toggleSave, loading };
}