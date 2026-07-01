export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {Icon && (
        <div className="w-14 h-14 bg-stone-100 rounded-md flex items-center justify-center mb-5">
          <Icon size={24} className="text-stone-400" />
        </div>
      )}
      <h3 className="font-display text-2xl text-stone-700 mb-2">{title}</h3>
      {description && (
        <p className="font-sans text-sm text-stone-500 max-w-xs leading-relaxed mb-6">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
