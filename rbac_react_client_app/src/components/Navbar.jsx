export default function Navbar({ role, onLogout }) {
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <span className="font-bold">RBAC Dashboard</span>
      <div>
        {role && <span className="mr-4">Rolle: {role}</span>}
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
