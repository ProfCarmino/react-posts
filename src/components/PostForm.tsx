import { useEffect, useState } from 'react';
import type { Post } from '../types';

type Props = {
  initial?: Partial<Post>;
  onSubmit: (data: { date: string; title: string; readTime: string }) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
};

export default function PostForm({ initial, onSubmit, onCancel, submitLabel = 'Salvar' }: Readonly<Props>) {
  const [date, setDate] = useState(initial?.date ?? '');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [readTime, setReadTime] = useState(initial?.readTime ?? '');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setDate(initial?.date ?? '');
    setTitle(initial?.title ?? '');
    setReadTime(initial?.readTime ?? '');
  }, [initial?.date, initial?.title, initial?.readTime]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!date.trim() || !title.trim() || !readTime.trim()) {
      setErr('Preencha todos os campos.');
      return;
    }
    try {
      setLoading(true);
      await onSubmit({ date: date.trim(), title: title.trim(), readTime: readTime.trim() });
      setDate(''); setTitle(''); setReadTime('');
    } catch (e: any) {
      setErr(e?.message ?? 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card form">
      <div className="field">
        <label>Data (texto)</label>
        <input value={date} onChange={e => setDate(e.target.value)} placeholder="31 jul 2025" />
      </div>
      <div className="field">
        <label>Título</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="erros de designer que todos devem evitar" />
      </div>
      <div className="field">
        <label>Tempo de leitura</label>
        <input value={readTime} onChange={e => setReadTime(e.target.value)} placeholder="3 minutos de leitura" />
      </div>

      {err && <div className="alert error">{err}</div>}

      <div className="actions">
        {onCancel && <button type="button" className="btn ghost" onClick={onCancel}>Cancelar</button>}
        <button className="btn primary" disabled={loading}>{loading ? 'Salvando...' : submitLabel}</button>
      </div>
    </form>
  );
}
