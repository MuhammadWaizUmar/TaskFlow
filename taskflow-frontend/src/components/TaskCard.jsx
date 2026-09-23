import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const priorityStyles = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

export default function TaskCard({ task, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id,
    data: { task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      // dnd-kit's `attributes` already adds role="button", tabIndex and
      // aria-describedby for the keyboard sensor - this label is what a
      // screen reader actually announces when the card receives focus.
      aria-label={`${task.title}, ${task.priority} priority, status ${task.status}. Press space to pick up and move with arrow keys.`}
      onClick={() => onClick(task)}
      onKeyDown={(e) => {
        // dnd-kit's KeyboardSensor already handles Space/Enter to pick up
        // and drop the card. Only forward "open the edit modal" for a
        // plain Enter press that isn't part of an active drag.
        if (e.key === "Enter") onClick(task);
      }}
      className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm cursor-grab active:cursor-grabbing transition hover:border-indigo-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <p className="text-sm font-medium text-slate-800">{task.title}</p>
      {task.description && (
        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between mt-2">
        <span className={`text-xs px-2 py-0.5 rounded-full ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="text-xs text-slate-400">
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}