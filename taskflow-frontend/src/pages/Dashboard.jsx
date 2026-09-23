import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { listProjects, createProject, deleteProject } from "../api/projects.js";
import ProjectModal from "../components/ProjectModal.jsx";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    const data = await listProjects();
    setProjects(data);
    setLoading(false);
  }

  async function handleCreate(data) {
    const project = await createProject(data);
    setProjects((prev) => [project, ...prev]);
    setShowModal(false);
  }

  async function handleDelete(e, id) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this project and all its tasks?")) return;
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p._id !== id));
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-indigo-600" />
            <h1 className="text-lg font-bold text-slate-800">TaskFlow</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">{user?.name}</span>
            <button onClick={logout} className="text-sm text-slate-500 transition hover:text-indigo-600">
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800">Your projects</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-md transition hover:bg-indigo-700 active:scale-[0.98]"
          >
            + New project
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">No projects yet. Create your first one to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Link
                key={project._id}
                to={`/projects/${project._id}`}
                className="group bg-white rounded-xl border border-slate-200 p-5 transition hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-slate-800 group-hover:text-indigo-700 transition">
                    {project.title}
                  </h3>
                  <button
                    onClick={(e) => handleDelete(e, project._id)}
                    className="text-slate-300 transition hover:text-red-500 text-sm"
                    title="Delete project"
                  >
                    ✕
                  </button>
                </div>
                {project.description && (
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">{project.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>

      {showModal && <ProjectModal onClose={() => setShowModal(false)} onSave={handleCreate} />}
    </div>
  );
}