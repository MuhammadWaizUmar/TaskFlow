import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Column from "../components/Column.jsx";
import TaskCard from "../components/TaskCard.jsx";
import TaskModal from "../components/TaskModal.jsx";
import { listTasks, createTask, updateTask, deleteTask } from "../api/tasks.js";

const COLUMNS = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

export default function Board() {
  const { id: projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  // Two ways to pick up and move a card:
  // - PointerSensor: mouse/touch drag (a small movement threshold stops
  //   a plain click from being mistaken for a drag)
  // - KeyboardSensor: Tab to a card, press Space to pick it up, arrow keys
  //   to move it between columns, Space again to drop, Esc to cancel.
  //   sortableKeyboardCoordinates is what makes arrow keys move between
  //   the sortable items/columns in a sensible order.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  async function loadTasks() {
    setLoading(true);
    const data = await listTasks(projectId);
    setTasks(data);
    setLoading(false);
  }

  const tasksByStatus = useCallback((status) => tasks.filter((t) => t.status === status), [tasks]);

  function handleDragStart(event) {
    const task = tasks.find((t) => t._id === event.active.id);
    setActiveTask(task);
  }

  async function handleDragEnd(event) {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const draggedTask = tasks.find((t) => t._id === active.id);
    const overTask = tasks.find((t) => t._id === over.id);
    const newStatus = overTask ? overTask.status : over.id;

    if (!draggedTask || draggedTask.status === newStatus) return;

    setTasks((prev) => prev.map((t) => (t._id === active.id ? { ...t, status: newStatus } : t)));
    try {
      await updateTask(projectId, active.id, { status: newStatus });
    } catch {
      loadTasks();
    }
  }

  async function handleSaveTask(data) {
    if (editingTask && editingTask !== "new") {
      const updated = await updateTask(projectId, editingTask._id, data);
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    } else {
      const created = await createTask(projectId, data);
      setTasks((prev) => [created, ...prev]);
    }
    setEditingTask(null);
  }

  // Confirmation before delete, same pattern as the project delete on
  // the dashboard - a destructive action always gets a native confirm().
  async function handleDeleteTask(taskId) {
    if (!confirm("Delete this task? This can't be undone.")) return;
    await deleteTask(projectId, taskId);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    setEditingTask(null);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="text-sm text-slate-500 transition hover:text-indigo-600">
            ← Projects
          </Link>
          <button
            onClick={() => setEditingTask("new")}
            className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-md transition hover:bg-indigo-700 active:scale-[0.98]"
          >
            + New task
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <p className="text-slate-400 text-sm">Loading...</p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4">
              {COLUMNS.map((col) => (
                <Column
                  key={col.id}
                  id={col.id}
                  title={col.title}
                  tasks={tasksByStatus(col.id)}
                  onTaskClick={setEditingTask}
                />
              ))}
            </div>

            <DragOverlay>
              {activeTask && (
                <div className="rotate-2 scale-105 shadow-xl">
                  <TaskCard task={activeTask} onClick={() => {}} />
                </div>
              )}
            </DragOverlay>
          </DndContext>
        )}
      </main>

      {editingTask && (
        <TaskModal
          task={editingTask === "new" ? null : editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
}