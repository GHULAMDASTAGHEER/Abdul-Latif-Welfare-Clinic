import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addPurchaseInvoice } from "../redux/slices/purchaseSlice";
import { updateStock } from "../redux/slices/inventorySlice";
import "../css/Reports.css";

export default function PurchaseReports() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const invoices = useSelector(state => state.purchase.invoices);
  const items = useSelector(state => state.inventory.items);
  const [activeTab, setActiveTab] = useState("invoices");
  const [dateFilter, setDateFilter] = useState("");
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [purchaseItems, setPurchaseItems] = useState([{ itemId: "", quantity: 0, price: 0 }]);
  const [supplierName, setSupplierName] = useState("");

  const filteredInvoices = dateFilter
    ? invoices.filter(inv => new Date(inv.date).toLocaleDateString() === new Date(dateFilter).toLocaleDateString())
    : invoices;

  const totalPurchases = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);

  const itemWisePurchases = filteredInvoices.reduce((acc, invoice) => {
    invoice.items.forEach(item => {
      if (!acc[item.name]) {
        acc[item.name] = { name: item.name, quantity: 0, cost: 0 };
      }
      acc[item.name].quantity += item.quantity;
      acc[item.name].cost += item.price * item.quantity;
    });
    return acc;
  }, {});

  const itemWiseData = Object.values(itemWisePurchases);

  const addPurchaseItem = () => {
    setPurchaseItems([...purchaseItems, { itemId: "", quantity: 0, price: 0 }]);
  };

  const updatePurchaseItem = (index, field, value) => {
    setPurchaseItems(purchaseItems.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handlePurchaseSubmit = (e) => {
    e.preventDefault();
    const purchaseData = purchaseItems.map(pi => {
      const item = items.find(i => i.id === parseInt(pi.itemId));
      return { ...item, quantity: parseInt(pi.quantity), purchasePrice: parseFloat(pi.price) };
    });

    const invoice = {
      id: Date.now(),
      invoiceNo: `PINV-${Date.now()}`,
      date: new Date().toISOString(),
      supplierName,
      items: purchaseData,
      total: purchaseData.reduce((sum, item) => sum + (item.purchasePrice * item.quantity), 0),
      type: "purchase"
    };

    dispatch(addPurchaseInvoice(invoice));
    
    purchaseData.forEach(item => {
      dispatch(updateStock({ id: item.id, quantity: item.quantity }));
    });

    alert("Purchase recorded successfully!");
    setShowPurchaseForm(false);
    setPurchaseItems([{ itemId: "", quantity: 0, price: 0 }]);
    setSupplierName("");
  };

  return (
    <div className="reports-container">
      <div className="page-header">
        <div>
          <h1>Purchase Reports</h1>
          <p>Manage purchases and view analytics</p>
        </div>
        <div className="header-actions">
          <button onClick={() => setShowPurchaseForm(true)} className="btn-primary">New Purchase</button>
          <button onClick={() => navigate("/dashboard")} className="btn-secondary">Back to Dashboard</button>
        </div>
      </div>

      <div className="tabs">
        <button
          className={activeTab === "invoices" ? "tab active" : "tab"}
          onClick={() => setActiveTab("invoices")}
        >
          Purchase Invoices
        </button>
        <button
          className={activeTab === "summary" ? "tab active" : "tab"}
          onClick={() => setActiveTab("summary")}
        >
          Purchase Summary
        </button>
        <button
          className={activeTab === "itemwise" ? "tab active" : "tab"}
          onClick={() => setActiveTab("itemwise")}
        >
          Item-wise Purchases
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
                <p><strong>Supplier:</strong> {invoice.supplierName}</p>
                <p><strong>Items:</strong> {invoice.items.length}</p>
                <div className="items-summary">
                  {invoice.items.map((item, idx) => (
                    <div key={idx} className="item-row">
                      <span>{item.name}</span>
                      <span>{item.quantity} x Rs. {item.purchasePrice}</span>
                      <span>Rs. {item.quantity * item.purchasePrice}</span>
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
            <div className="empty-state">No purchase invoices found</div>
          )}
        </div>
      )}

      {activeTab === "summary" && (
        <div className="summary-section">
          <div className="summary-cards">
            <div className="summary-card">
              <div className="summary-icon">💰</div>
              <div className="summary-info">
                <div className="summary-label">Total Purchases</div>
                <div className="summary-value">Rs. {totalPurchases.toFixed(2)}</div>
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
                <div className="summary-label">Average Purchase</div>
                <div className="summary-value">
                  Rs. {filteredInvoices.length ? (totalPurchases / filteredInvoices.length).toFixed(2) : 0}
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
                <th>Total Quantity Purchased</th>
                <th>Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {itemWiseData.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>Rs. {item.cost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {itemWiseData.length === 0 && (
            <div className="empty-state">No purchase data available</div>
          )}
        </div>
      )}

      {showPurchaseForm && (
        <div className="modal-overlay" onClick={() => setShowPurchaseForm(false)}>
          <div className="purchase-modal" onClick={(e) => e.stopPropagation()}>
            <h2>New Purchase Invoice</h2>
            <form onSubmit={handlePurchaseSubmit}>
              <div className="form-group">
                <label>Supplier Name</label>
                <input
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  required
                />
              </div>
              {purchaseItems.map((pi, index) => (
                <div key={index} className="purchase-item-row">
                  <div className="form-group">
                    <label>Item</label>
                    <select
                      value={pi.itemId}
                      onChange={(e) => updatePurchaseItem(index, 'itemId', e.target.value)}
                      required
                    >
                      <option value="">Select item...</option>
                      {items.map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Quantity</label>
                    <input
                      type="number"
                      value={pi.quantity}
                      onChange={(e) => updatePurchaseItem(index, 'quantity', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Price per Unit</label>
                    <input
                      type="number"
                      step="0.01"
                      value={pi.price}
                      onChange={(e) => updatePurchaseItem(index, 'price', e.target.value)}
                      required
                    />
                  </div>
                </div>
              ))}
              <button type="button" onClick={addPurchaseItem} className="btn-add">+ Add Item</button>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Save Purchase</button>
                <button type="button" onClick={() => setShowPurchaseForm(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

