import React, { useRef, useState } from 'react';
import { Movement } from '../types';
import {
  loadBaseDictionary,
  analyzeDescriptions,
  spellSuggestions,
  splitKeepingSeparators,
  matchesWord,
  MisspelledWord,
} from '../spellcheck';
import { fetchDictionaryWords, addDictionaryWord, replaceSpelling } from '../api';

interface CorreccionOrtograficaProps {
  movements: Movement[];
  onToast: (msg: string) => void;
  onApplied: () => void;
}

interface ResultItem extends MisspelledWord {
  suggestions: string[];
  replacement: string;
}

const tick = () => new Promise((r) => setTimeout(r, 0));

export const CorreccionOrtografica: React.FC<CorreccionOrtograficaProps> = ({ movements, onToast, onApplied }) => {
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'done'>('idle');
  const [items, setItems] = useState<ResultItem[]>([]);
  const [busyWords, setBusyWords] = useState<Set<string>>(new Set());
  const [expandedWords, setExpandedWords] = useState<Set<string>>(new Set());
  const suggestionCache = useRef<Map<string, string[]>>(new Map());

  const setReplacement = (word: string, value: string) => {
    setItems((prev) => prev.map((it) => (it.word === word ? { ...it, replacement: value } : it)));
  };

  const setItemBusy = (word: string, busy: boolean) => {
    setBusyWords((prev) => {
      const next = new Set(prev);
      if (busy) next.add(word);
      else next.delete(word);
      return next;
    });
  };

  const runAnalysis = async () => {
    setStatus('analyzing');
    try {
      const [base, custom] = await Promise.all([loadBaseDictionary(), fetchDictionaryWords()]);
      const dict = new Set<string>(base);
      custom.forEach((w) => dict.add(w.toLowerCase()));
      await tick();
      const found = analyzeDescriptions(movements, dict);
      const result: ResultItem[] = [];
      for (let i = 0; i < found.length; i++) {
        const f = found[i];
        let suggestions = suggestionCache.current.get(f.word);
        if (!suggestions) {
          suggestions = spellSuggestions(f.word, dict, 5);
          suggestionCache.current.set(f.word, suggestions);
          if (i % 8 === 0) await tick();
        }
        result.push({ ...f, suggestions, replacement: suggestions[0] ?? '' });
      }
      setItems(result);
      setStatus('done');
    } catch (e: any) {
      onToast(e.message || 'Error al analizar las descripciones');
      setStatus('idle');
    }
  };

  const handleAddWord = async (word: string) => {
    try {
      await addDictionaryWord(word);
      setItems((prev) => prev.filter((it) => it.word !== word));
      onToast(`✓ "${word}" añadida al diccionario local.`);
    } catch (e: any) {
      onToast(e.message || 'Error al añadir la palabra al diccionario');
    }
  };

  const handleReplace = async (item: ResultItem, movementId?: number) => {
    const replacement = item.replacement.trim();
    if (!replacement || replacement.toLowerCase() === item.word) return;
    setItemBusy(item.word, true);
    try {
      const res = await replaceSpelling({ word: item.word, replacement, movement_id: movementId });
      onToast(`✓ ${res.updated} descripción${res.updated === 1 ? '' : 'es'} corregida${res.updated === 1 ? '' : 's'}.`);
      if (movementId) {
        setItems((prev) =>
          prev
            .map((it) =>
              it.word === item.word
                ? {
                    ...it,
                    count: it.count - 1,
                    records: it.records.filter((r) => r.id !== String(movementId)),
                  }
                : it,
            )
            .filter((it) => it.count > 0),
        );
      } else {
        setItems((prev) => prev.filter((it) => it.word !== item.word));
      }
      onApplied();
    } catch (e: any) {
      onToast(e.message || 'Error al aplicar la corrección');
    } finally {
      setItemBusy(item.word, false);
    }
  };

  const toggleExpand = (word: string) => {
    setExpandedWords((prev) => {
      const next = new Set(prev);
      if (next.has(word)) next.delete(word);
      else next.add(word);
      return next;
    });
  };

  return (
    <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl overflow-hidden shadow-sm">
      <div className="bg-primary p-4 md:p-stack-md flex items-center gap-3 text-on-primary">
        <span className="material-symbols-outlined text-on-primary text-[28px]">spellcheck</span>
        <h3 className="font-bold text-xl md:text-2xl text-on-primary">Corrección Ortográfica de Descripciones</h3>
      </div>

      <div className="p-4 md:p-stack-md flex flex-col gap-6">
        <p className="text-sm md:text-base text-on-surface-variant font-medium">
          Analiza la columna <span className="font-semibold">Descripción</span> y localiza las palabras que no están
          en el diccionario en español. Elige una propuesta (o escribe la corrección manualmente) y aplica el cambio
          solo a ese registro o a todos. También puedes añadir la palabra al diccionario local para que no se marque
          en futuros análisis.
        </p>

        <button
          onClick={runAnalysis}
          disabled={status === 'analyzing'}
          className="w-full sm:w-auto h-14 px-8 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary-container transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">{status === 'done' ? 'refresh' : 'spellcheck'}</span>
          {status === 'done' ? 'Volver a analizar' : 'Analizar descripciones'}
        </button>

        {status === 'analyzing' && (
          <div className="flex items-center gap-3 text-on-surface-variant font-medium">
            <span className="material-symbols-outlined text-primary animate-spin">sync</span>
            Analizando descripciones...
          </div>
        )}

        {status === 'done' && items.length === 0 && (
          <div className="bg-surface-container-high border-2 border-secondary rounded-xl p-5 text-secondary font-semibold text-base flex items-center gap-3">
            <span className="material-symbols-outlined">check_circle</span>
            No se encontraron palabras fuera del diccionario.
          </div>
        )}

        {status === 'done' && items.length > 0 && (
          <div className="flex flex-col gap-5">
            <div className="font-bold text-lg text-on-surface">
              {items.length} palabra{items.length === 1 ? '' : 's'} no encontrada{items.length === 1 ? '' : 's'} en el
              diccionario.
            </div>

            {items.map((item) => {
              const valid =
                item.replacement.trim() !== '' && item.replacement.trim().toLowerCase() !== item.word;
              const busy = busyWords.has(item.word);
              const expanded = expandedWords.has(item.word);
              const shown = expanded ? item.records.length : 3;

              return (
                <div key={item.word} className="border-2 border-outline-variant rounded-xl overflow-hidden">
                  <div className="bg-surface-container-high px-4 py-3 flex flex-wrap items-center gap-3">
                    <span className="font-bold text-lg text-error">«{item.word}»</span>
                    <span className="text-sm font-medium text-on-surface-variant">
                      {item.count} ocurrencia{item.count === 1 ? '' : 's'}
                    </span>
                    <button
                      onClick={() => handleAddWord(item.word)}
                      disabled={busy}
                      className="ml-auto h-10 px-4 bg-secondary-container text-on-secondary-container font-semibold text-sm rounded-lg border-2 border-on-secondary-container hover:bg-secondary hover:text-on-secondary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">dictionary</span>
                      Añadir al diccionario
                    </button>
                  </div>

                  <div className="p-4 flex flex-col gap-3">
                    {item.suggestions.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-on-surface-variant">Sugerencias:</span>
                        {item.suggestions.map((s) => (
                          <button
                            key={s}
                            onClick={() => setReplacement(item.word, s)}
                            className={`h-9 px-3 rounded-full font-semibold text-sm border-2 transition-colors cursor-pointer ${
                              item.replacement === s
                                ? 'bg-primary text-on-primary border-primary'
                                : 'border-outline-variant text-on-surface hover:border-primary hover:text-primary'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={item.replacement}
                        onChange={(e) => setReplacement(item.word, e.target.value)}
                        placeholder="Escribe la corrección..."
                        className="flex-1 h-12 px-4 font-medium text-base border-2 border-outline-variant rounded-xl bg-surface focus:border-primary focus:outline-none"
                      />
                      <button
                        onClick={() => handleReplace(item)}
                        disabled={!valid || busy}
                        className="h-12 px-5 bg-primary text-on-primary font-bold text-sm rounded-xl hover:bg-primary-container transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {busy ? (
                          <span className="material-symbols-outlined animate-spin">sync</span>
                        ) : (
                          <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                        )}
                        Cambiar todas ({item.count})
                      </button>
                    </div>

                    {item.records.length > 0 && (
                      <div className="border-t border-outline-variant/60 pt-3 flex flex-col gap-2">
                        <span className="text-sm font-semibold text-on-surface-variant">Registros afectados</span>
                        {item.records.slice(0, shown).map((rec) => (
                          <div key={rec.id} className="flex items-center justify-between gap-3 py-1.5 border-b border-outline-variant/40 last:border-b-0">
                            <span className="text-sm text-on-surface min-w-0">
                              {splitKeepingSeparators(rec.description).map((part, i) =>
                                matchesWord(part, item.word) ? (
                                  <mark key={i} className="bg-error-container text-on-error-container font-bold rounded px-0.5">
                                    {part}
                                  </mark>
                                ) : (
                                  <span key={i}>{part}</span>
                                ),
                              )}
                            </span>
                            <button
                              onClick={() => handleReplace(item, Number(rec.id))}
                              disabled={!valid || busy}
                              className="h-9 px-3 shrink-0 bg-surface-container-high text-on-surface font-semibold text-sm rounded-lg border-2 border-transparent hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              Cambiar
                            </button>
                          </div>
                        ))}
                        {item.records.length > 3 && (
                          <button
                            onClick={() => toggleExpand(item.word)}
                            className="self-start text-primary font-semibold text-sm flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {expanded ? 'expand_less' : 'expand_more'}
                            </span>
                            {expanded ? 'Mostrar menos' : `Mostrar ${item.records.length - 3} más`}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
