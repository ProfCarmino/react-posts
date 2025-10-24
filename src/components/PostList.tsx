import { useEffect, useMemo, useState } from 'react';
import type { Post } from '../types';
import { PostsAPI } from '../api/posts';
import PostForm from './PostForm';

export default function PostList() {
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [editing, setEditing] = useState<Post | null>(null);

  async function load() {
    setErr(null);
    try {
      setLoading(true);
      const data = await PostsAPI.list();
      // ordena por createdAt desc (se existir), senão por título
      const ordered = [...data].sort((a, b) => {
        const ca = a.createdAt ?? '';
        const cb = b.createdAt ?? '';
        return cb.localeCompare(ca) || a.title.localeCompare(b.title);
      });
      setItems(ordered);
    } catch (e: any) {
      setErr(e?.message ?? 'Falha ao carregar');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function createPost(payload: { date: string; title: string; readTime: string }) {
    await PostsAPI.create(payload);
    await load();
  }

  async function updatePost(
  id: string,
  payload: { date: string; title: string; readTime: string }
) {
  await PostsAPI.update(id, payload); // <-- removido { id, ...payload }
  setEditing(null);
  await load();
}

  async function removePost(id: string) {
    if (!confirm('Excluir este post?')) return;
    await PostsAPI.remove(id);
    await load();
  }

  const list = useMemo(() => items, [items]);

  return (
    <div className="stack">
      <h2>Posts</h2>

      <PostForm submitLabel="Criar" onSubmit={createPost} />

      <div className="list card">
        {loading && <div className="muted">Carregando...</div>}
        {err && <div className="alert error">{err}</div>}
        {!loading && !err && list.length === 0 && <div className="muted">Nenhum post ainda.</div>}

        {!loading && !err && list.map(p => (
          <div key={p.id} className="row">
            {editing?.id === p.id ? (
              <PostForm
                initial={p}
                submitLabel="Atualizar"
                onCancel={() => setEditing(null)}
                onSubmit={(payload) => updatePost(p.id, payload)}
              />
            ) : (
              <>
                <div className="col grow">
                  <div className="title">{p.title}</div>
                  <div className="meta">
                    <span>{p.date}</span>
                    <span>•</span>
                    <span>{p.readTime}</span>
                    {p.createdAt && <span>• criado {new Date(p.createdAt).toLocaleString()}</span>}
                    {p.updatedAt && <span>• atualizado {new Date(p.updatedAt).toLocaleString()}</span>}
                  </div>
                </div>
                <div className="col actions">
                  <button className="btn" onClick={() => setEditing(p)}>Editar</button>
                  <button className="btn danger" onClick={() => removePost(p.id)}>Excluir</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
