import{Navigate,Outlet}from"react-router-dom";import{useAuth}from"../context/AuthContext";
export function ProtectedRoute(){const{isAuthenticated,loading}=useAuth();if(loading)return <div className="state">Checking authentication…</div>;return isAuthenticated?<Outlet/>:<Navigate to="/login" replace/>}
export function AdminRoute(){const{isAdmin,loading}=useAuth();if(loading)return <div className="state">Checking authorization…</div>;return isAdmin?<Outlet/>:<Navigate to="/" replace/>}
