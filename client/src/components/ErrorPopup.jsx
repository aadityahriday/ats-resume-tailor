export default function ErrorPopup({ error, onClose }) {
  if (!error) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-bg/80 backdrop-blur-sm animate-fade-in">
      <div className="max-w-md w-full bg-surface border border-error/20 p-8 rounded-2xl shadow-xl animate-slide-in-up">
        <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
          ⚠️
        </div>
        <h1 className="text-2xl font-serif text-text mb-4 text-center">Oops, something went wrong.</h1>
        <div className="bg-error/5 border border-error/20 rounded-lg p-4 mb-6 text-left">
          <p className="text-error font-mono text-sm break-words">
            {error}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full px-6 py-2.5 bg-amber text-bg font-mono font-bold rounded-lg hover:bg-amber-hover transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
