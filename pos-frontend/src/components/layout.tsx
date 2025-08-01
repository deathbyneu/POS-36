import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../App.css";
import axios from "axios";

export default function Layout({
  setIsLoggedIn,
}: {
  setIsLoggedIn: (value: boolean) => void;
}) {
  const ACCESS_KEY = "accessToken";
  const REFRESH_KEY = "refreshToken";
  const navigate = useNavigate();
  const handleLogout = async () => {
    const access_token = localStorage.getItem("accessToken");
    console.log(access_token);
    try {
      const response = await axios.post(
        "https://fe-api-training.ssit.company/api/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    delete axios.defaults.headers.common["Authorization"];
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-[#1f1f1f] text-gray-100">
      {/* Sidebar */}
      <aside className="w-70 bg-[#1a1a1a] p-6 flex flex-col space-y-80">
        <h1 className="text-4xl font-bold">POS giet nguoi</h1>
        <nav className="flex-1 flex flex-col gap-2 text-2xl">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-xl transition ${
                isActive
                  ? " text-amber-400"
                  : "text-gray-300 hover:bg-[#1f1f1f] hover:text-white"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/sales"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-xl transition ${
                isActive
                  ? " text-amber-400"
                  : "text-white hover:bg-[#1f1f1f] hover:text-white"
              }`
            }
          >
            Sales
          </NavLink>
          <NavLink
            to="/order"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-xl transition ${
                isActive
                  ? " text-amber-400"
                  : "text-white hover:bg-[#1f1f1f] hover:text-white"
              }`
            }
          >
            Order
          </NavLink>
        </nav>
        <div>
          <button className="bg-red hover:text-red-500" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6 h-screen">
        <Outlet />
      </main>
    </div>
  );
}
