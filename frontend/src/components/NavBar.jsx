import React from "react";
import { Button, Navbar, DarkThemeToggle, useThemeMode } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { removeToken, getToken } from "../Utiliti/auth"; // Assuming `getToken` checks for token existence
import logo from "../Images/Logo2.png";

const NavBar = () => {
  const navigate = useNavigate();
  const { toggleMode } = useThemeMode();

  const isLoggedIn = !!getToken(); // Check if the user is logged in based on token presence

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    removeToken();
    navigate("/");
  };

  
  return (
    <div>
      <Navbar fluid rounded>
        <Navbar.Brand onClick={() => navigate("/")}>
          <img
            src={logo}
            style={{ marginRight: "22px", height: "100px" }}
            className="mr-3 h-9 sm:h-28"
            alt="StreamReserve Logo"
          />
          <span
            onClick={() => navigate("/")}
            className="self-center whitespace-nowrap text-3xl font-semibold dark:text-white"
          >
            StreamReserve
          </span>
        </Navbar.Brand>

        <Navbar.Collapse>
          <Navbar.Link href="/" active style={{ fontSize: "1.25rem" }}>
            Home
          </Navbar.Link>
          <Navbar.Link href="/forecast" style={{ fontSize: "1.25rem" }}>
            Forecast
          </Navbar.Link>
          
        </Navbar.Collapse>

        <div className="flex md:order-2">
          <DarkThemeToggle onClick={toggleMode} className="mr-2" />
          {isLoggedIn ? (
            <Button
              onClick={handleLogout}
              style={{ width: "150px", backgroundColor: "#7b9a00", color: "white" }}
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={handleLogin}
              style={{ width: "150px", backgroundColor: "#7b9a00", color: "white" }}
            >
              Login
            </Button>
          )}
          <Navbar.Toggle />
        </div>
      </Navbar>
    </div>
  );
};

export default NavBar;
