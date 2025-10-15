import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import "../css/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const menuItems = [
    { title: "Patient Registration", icon: "👤", path: "/patient-form", color: "#4f46e5" },
    { title: "Patient List", icon: "📋", path: "/patient-list", color: "#0891b2" },
    { title: "Point of Sale", icon: "💰", path: "/pos", color: "#059669" },
    { title: "Inventory", icon: "📦", path: "/inventory", color: "#d97706" },
    { title: "Prescription", icon: "📝", path: "/prescription", color: "#7c3aed" },
    { title: "Sales Reports", icon: "📊", path: "/sales-reports", color: "#dc2626" },
    { title: "Purchase Reports", icon: "📈", path: "/purchase-reports", color: "#ea580c" },
    { title: "Sale Returns", icon: "↩️", path: "/sale-returns", color: "#be123c" },
    { title: "Purchase Returns", icon: "↪️", path: "/purchase-returns", color: "#9333ea" },
    { title: "Cash History", icon: "💵", path: "/cash-history", color: "#16a34a" },
    { title: "Maintenance", icon: "🔧", path: "/maintenance", color: "#0284c7" },
    { title: "Printer Setup", icon: "🖨️", path: "/printer-setup", color: "#64748b" },
  ];

  if (isAdmin) {
    menuItems.push({ title: "User Management", icon: "👥", path: "/users", color: "#db2777" });
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Abdul Latif Welfare Clinic</h1>
          <p>Hospital Management System</p>
        </div>
        <div className="user-info">
          <span className="user-name">{user?.fullName}</span>
          <span className="user-role">({user?.role})</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="menu-grid">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="menu-card"
              onClick={() => navigate(item.path)}
              style={{ borderLeftColor: item.color }}
            >
              <div className="menu-icon" style={{ background: item.color }}>
                {item.icon}
              </div>
              <div className="menu-title">{item.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

