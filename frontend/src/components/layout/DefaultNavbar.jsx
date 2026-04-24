import { NavLink } from "react-router-dom";
import logo from "../../image/logo2.png"
import UserSection from "../../Features/user/components/UserSection";
import Location from "../../Features/location/components/Location";
const DefaulNavbar = ({ user, setOpen, setOpenLogin }) => {

  const navItems = [
    {name: "Home", path:"/", activeClass: "bg-purple-100 text-purple-600"},
    {name: "Movies", path:"/movies", activeClass: "bg-red-100 text-red-600"},
    {name: "Events", path:"/events", activeClass:"bg-green-100 text-green-600"},
  ];

  return (
    <nav>
      <div className="w-full h-[60px] bg-white shadow-sm px-6 py-1 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-6">
          
          <NavLink to="/">
            <img src={logo} className="w-[150px]" />
          </NavLink>

          <Location />

          <div className="ml-8 flex gap-3 items-center">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? item.activeClass
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
         
          <UserSection
            user={user}
            setOpen={setOpen}
            setOpenLogin={setOpenLogin}
          />
        </div>
      </div>
    </nav>
  );
};

export default DefaulNavbar;