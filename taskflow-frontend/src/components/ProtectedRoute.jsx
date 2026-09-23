import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Wrap any page that requires login, e.g.:
//   <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
// If there's no user, redirect to /login instead of rendering the page.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // While we're still checking localStorage on first load, render nothing
  // rather than flashing a redirect to login for an already-logged-in user.
  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}