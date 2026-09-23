import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard.jsx";

const columnStyles = {
  todo: "border-t-slate-400",
  "in-progress": "border-t-amber-400",
  done: "border-t-emerald-500",
};

export default function Column({ id, title, tasks, onTaskClick }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex-1 min-w-[260px]">
      <div
        className={`bg-slate-100 rounded-xl border-t-4 ${columnStyles[id]} p-3 transition ${
          isOver ? "bg-indigo-50 ring-2 ring-indigo-200" : ""
        }`}
      >
        <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center justify-between">
          {title}
          <span className="text-xs font-normal text-slate-400">{tasks.length}</span>
        </h2>

        <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
          <div ref={setNodeRef} className="space-y-2 min-h-[80px]">
            {tasks.length === 0 ? (
              // Empty columns are also valid drop targets, so this placeholder
              // still needs to fill the min-height area for dropping to work.
              <div className="h-20 flex items-center justify-center text-xs text-slate-400">
                No tasks yet
              </div>
            ) : (
              tasks.map((task) => <TaskCard key={task._id} task={task} onClick={onTaskClick} />)
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}