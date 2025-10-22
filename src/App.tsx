import PostList from './components/PostList';

export default function App() {
  return (
    <main className="container">
      <header className="topbar">
        <h1>Blog Admin (Express + json-server)</h1>
        <a className="link" href={`${import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}/health`} target="_blank">
          /health
        </a>
      </header>
      <PostList />
    </main>
  );
}
