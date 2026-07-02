export default function LessonLoading() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ height: 64, borderBottom: '1px solid var(--border)' }} />
      <div className="container" style={{ maxWidth: 1080, padding: '40px 24px 80px' }}>
        <div
          style={{
            aspectRatio: '16/9',
            maxWidth: 760,
            background: 'var(--surface)',
            borderRadius: 8,
            border: '1px solid var(--border)',
          }}
        />
      </div>
    </div>
  );
}
