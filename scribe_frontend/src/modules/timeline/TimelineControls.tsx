import { useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import { TbTrash, TbPlus } from 'react-icons/tb';
import { useAppStore } from '@store/appStore';
import type { TimelineParams, TimelineEventType } from '@types/modules';
import { Select } from '@components/ui/Select';
import { Toggle } from '@components/ui/Toggle';
import { newEventId } from './timeline.utils';

const TYPE_OPTIONS = [
  { value: 'event',  label: 'Event'  },
  { value: 'battle', label: 'Battle' },
  { value: 'era',    label: 'Era'    },
  { value: 'birth',  label: 'Birth'  },
  { value: 'death',  label: 'Death'  },
];

const STYLE_OPTIONS = [
  { value: 'spirit',   label: 'Spirit'   },
  { value: 'tactical', label: 'Tactical' },
  { value: 'sketch',   label: 'Sketch'   },
  { value: 'ink',      label: 'Ink'      },
];

const TYPE_BADGE: Record<TimelineEventType, string> = {
  era:    'bg-blue-900/40 text-blue-300',
  battle: 'bg-rose-900/40 text-rose-300',
  event:  'bg-zinc-800 text-zinc-400',
  birth:  'bg-emerald-900/40 text-emerald-300',
  death:  'bg-zinc-700 text-zinc-400',
};

export const TimelineControls: FC = () => {
  const timeline        = useAppStore((s) => s.timeline);
  const set             = useAppStore((s) => s.setTimelineParam);
  const addEvent        = useAppStore((s) => s.addTimelineEvent);
  const removeEvent     = useAppStore((s) => s.removeTimelineEvent);

  const [newLabel, setNewLabel] = useState('');
  const [newYear,  setNewYear]  = useState('');
  const [newType,  setNewType]  = useState<TimelineEventType>('event');

  function update<K extends keyof TimelineParams>(key: K, value: TimelineParams[K]): void {
    set(key, value);
  }

  function handleAdd(): void {
    const year = parseInt(newYear, 10);
    if (!newLabel.trim() || Number.isNaN(year)) return;
    addEvent({ id: newEventId(), label: newLabel.trim(), year, type: newType });
    setNewLabel('');
    setNewYear('');
  }

  const sorted = [...timeline.events].sort((a, b) => a.year - b.year);

  return (
    <div className="flex flex-col gap-6 p-5">
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
          Add Event
        </h3>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={newLabel}
            placeholder="Label…"
            maxLength={40}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewLabel(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={newYear}
              placeholder="Year"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewYear(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
              className="w-24 bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
            />
            <select
              value={newType}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setNewType(e.target.value as TimelineEventType)
              }
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500"
            >
              {TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newLabel.trim() || !newYear}
            className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <TbPlus size={14} aria-hidden="true" />
            Add
          </button>
        </div>
      </section>

      <div className="border-t border-zinc-800" />

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
          Events ({timeline.events.length})
        </h3>
        <div className="flex flex-col gap-2 max-h-52 overflow-y-auto">
          {sorted.length === 0 && (
            <p className="text-xs text-zinc-600 italic">No events yet.</p>
          )}
          {sorted.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-2 group"
            >
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ${TYPE_BADGE[event.type]}`}>
                {event.type}
              </span>
              <span className="text-xs text-zinc-300 truncate flex-1">{event.label}</span>
              <span className="text-xs text-zinc-600 font-mono shrink-0">{event.year}</span>
              <button
                type="button"
                onClick={() => removeEvent(event.id)}
                aria-label={`Remove ${event.label}`}
                className="shrink-0 opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-rose-400 transition-all"
              >
                <TbTrash size={13} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-zinc-800" />

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
          Display
        </h3>
        <div className="flex flex-col gap-4">
          <Select
            label="Style"
            value={timeline.style}
            options={STYLE_OPTIONS}
            onChange={(v) => update('style', v as TimelineParams['style'])}
          />
          <Toggle
            label="Labels"
            value={timeline.showLabels}
            onChange={(v) => update('showLabels', v)}
          />
        </div>
      </section>
    </div>
  );
};
