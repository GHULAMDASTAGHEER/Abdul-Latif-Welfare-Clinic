import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../css/Reports.css";

export default function SalesReports() {
  const navigate = useNavigate();
  const invoices = useSelector(state => state.sales.invoices);
  const [activeTab, setActiveTab] = useState("invoices");
  const [dateFilter, setDateFilter] = useState("");

  const filteredInvoices = dateFilter
    ? invoices.filter(inv => new Date(inv.date).toLocaleDateString() === new Date(dateFilter).toLocaleDateString())
    : invoices;

  const totalSales = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);

  const itemWiseSales = filteredInvoices.reduce((acc, invoice) => {
    invoice.items.forEach(item => {
      if (!acc[item.name]) {
        acc[item.name] = { name: item.name, quantity: 0, revenue: 0 };
      }
      acc[item.name].quantity += item.quantity;
      acc[item.name].revenue += item.price * item.quantity;
    });
    return acc;
  }, {});

  const itemWiseData = Object.values(itemWiseSales);

  return (
    <div className="reports-container">
      <div className="page-header">
        <div>
          <h1>Sales Reports</h1>
          <p>View sales invoices and analytics</p>
        </div>
        <button onClick={() => navigate("/dashboard")} className="btn-secondary">Back to Dashboard</button>
      </div>

      <div className="tabs">
        <button
          className={activeTab === "invoices" ? "tab active" : "tab"}
          onClick={() => setActiveTab("invoices")}
        >
          Sales Invoices
        </button>
        <button
          className={activeTab === "summary" ? "tab active" : "tab"}
          onClick={() => setActiveTab("summary")}
        >
          Sales Summary
        </button>
        <button
          className={activeTab === "itemwise" ? "tab active" : "tab"}
          onClick={() => setActiveTab("itemwise")}
        >
          Item-wise Sales
        </button>
      </div>

      <div className="filters">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="date-filter"
        />
        {dateFilter && (
          <button onClick={() => setDateFilter("")} className="btn-clear">Clear Filter</button>
        )}
      </div>

      {activeTab === "invoices" && (
        <div className="invoices-list">
          {filteredInvoices.map(invoice => (
            <div key={invoice.id} className="invoice-card">
              <div className="invoice-header">
                <span className="invoice-no">{invoice.invoiceNo}</span>
                <span className="invoice-date">{new Date(invoice.date).toLocaleDateString()}</span>
              </div>
              <div className="invoice-body">
                <p><strong>Customer:</strong> {invoice.customerName}</p>
                {invoice.customerPhone && <p><strong>Phone:</strong> {invoice.customerPhone}</p>}
                <p><strong>Items:</strong> {invoice.items.length}</p>
                <div className="items-summary">
                  {invoice.items.map((item, idx) => (
                    <div key={idx} className="item-row">
                      <span>{item.name}</span>
                      <span>{item.quantity} x Rs. {item.price}</span>
                      <span>Rs. {item.quantity * item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="invoice-footer">
                <span>Total:</span>
                <span className="total-amount">Rs. {invoice.total}</span>
              </div>
            </div>
          ))}
          {filteredInvoices.length === 0 && (
            <div className="empty-state">No sales invoices found</div>
          )}
        </div>
      )}

      {activeTab === "summary" && (
        <div className="summary-section">
          <div className="summary-cards">
            <div className="summary-card">
              <div className="summary-icon">💰</div>
              <div className="summary-info">
                <div className="summary-label">Total Revenue</div>
                <div className="summary-value">Rs. {totalSales.toFixed(2)}</div>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">📄</div>
              <div className="summary-info">
                <div className="summary-label">Total Invoices</div>
                <div className="summary-value">{filteredInvoices.length}</div>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">📊</div>
              <div className="summary-info">
                <div className="summary-label">Average Sale</div>
                <div className="summary-value">
                  Rs. {filteredInvoices.length ? (totalSales / filteredInvoices.length).toFixed(2) : 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "itemwise" && (
        <div className="itemwise-table">
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Total Quantity Sold</th>
                <th>Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {itemWiseData.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>Rs. {item.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {itemWiseData.length === 0 && (
            <div className="empty-state">No sales data available</div>
          )}
        </div>
      )}
    </div>
  );
}

