// Small shared component so every form shows errors the same way.
export default function FormError({ message }) {
  if (!message) return null;
  return (
    <p className="rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
      {message}
    </p>
  );
}