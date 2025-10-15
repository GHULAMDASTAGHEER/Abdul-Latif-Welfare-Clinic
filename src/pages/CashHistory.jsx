import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../css/CashHistory.css";

export default function CashHistory() {
  const navigate = useNavigate();
  const salesInvoices = useSelector(state => state.sales.invoices);
  const purchaseInvoices = useSelector(state => state.purchase.invoices);
  const saleReturns = useSelector(state => state.sales.returns);
  const purchaseReturns = useSelector(state => state.purchase.returns);
  
  const [dateFilter, setDateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const allTransactions = [
    ...salesInvoices.map(inv => ({ ...inv, category: 'sale', icon: '💰', color: '#059669' })),
    ...purchaseInvoices.map(inv => ({ ...inv, category: 'purchase', icon: '📦', color: '#dc2626' })),
    ...saleReturns.map(ret => ({ ...ret, category: 'sale_return', icon: '↩️', color: '#f59e0b' })),
    ...purchaseReturns.map(ret => ({ ...ret, category: 'purchase_return', icon: '↪️', color: '#7c3aed' }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredTransactions = allTransactions.filter(trans => {
    const dateMatch = dateFilter ? new Date(trans.date).toLocaleDateString() === new Date(dateFilter).toLocaleDateString() : true;
    const typeMatch = typeFilter === 'all' || trans.category === typeFilter;
    return dateMatch && typeMatch;
  });

  const calculateBalance = () => {
    let balance = 0;
    filteredTransactions.forEach(trans => {
      if (trans.category === 'sale') balance += trans.total;
      if (trans.category === 'purchase') balance -= trans.total;
      if (trans.category === 'sale_return') balance -= trans.total;
      if (trans.category === 'purchase_return') balance += trans.total;
    });
    return balance;
  };

  const totalInflow = filteredTransactions
    .filter(t => t.category === 'sale' || t.category === 'purchase_return')
    .reduce((sum, t) => sum + t.total, 0);

  const totalOutflow = filteredTransactions
    .filter(t => t.category === 'purchase' || t.category === 'sale_return')
    .reduce((sum, t) => sum + t.total, 0);

  return (
    <div className="cash-history-container">
      <div className="page-header">
        <div>
          <h1>Cash History</h1>
          <p>Track all financial transactions</p>
        </div>
        <button onClick={() => navigate("/dashboard")} className="btn-secondary">Back to Dashboard</button>
      </div>

      <div className="summary-overview">
        <div className="summary-card inflow">
          <div className="summary-icon">💸</div>
          <div className="summary-info">
            <div className="summary-label">Total Inflow</div>
            <div className="summary-value">Rs. {totalInflow.toFixed(2)}</div>
          </div>
        </div>
        <div className="summary-card outflow">
          <div className="summary-icon">💳</div>
          <div className="summary-info">
            <div className="summary-label">Total Outflow</div>
            <div className="summary-value">Rs. {totalOutflow.toFixed(2)}</div>
          </div>
        </div>
        <div className="summary-card balance">
          <div className="summary-icon">💰</div>
          <div className="summary-info">
            <div className="summary-label">Net Balance</div>
            <div className="summary-value">Rs. {calculateBalance().toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="date-filter"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="type-filter"
        >
          <option value="all">All Transactions</option>
          <option value="sale">Sales</option>
          <option value="purchase">Purchases</option>
          <option value="sale_return">Sale Returns</option>
          <option value="purchase_return">Purchase Returns</option>
        </select>
        {(dateFilter || typeFilter !== 'all') && (
          <button onClick={() => { setDateFilter(""); setTypeFilter("all"); }} className="btn-clear">
            Clear Filters
          </button>
        )}
      </div>

      <div className="transactions-list">
        {filteredTransactions.map(trans => (
          <div key={`${trans.category}-${trans.id}`} className="transaction-card">
            <div className="transaction-icon" style={{ background: trans.color }}>
              {trans.icon}
            </div>
            <div className="transaction-details">
              <div className="transaction-header">
                <h4>{trans.invoiceNo || trans.returnNo}</h4>
                <span className="transaction-type" style={{ background: trans.color + '20', color: trans.color }}>
                  {trans.category.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="transaction-info">
                <p>{trans.customerName || trans.supplierName}</p>
                <p className="transaction-date">{new Date(trans.date).toLocaleString()}</p>
              </div>
            </div>
            <div className="transaction-amount" style={{ color: trans.category.includes('sale') && !trans.category.includes('return') || trans.category.includes('purchase_return') ? '#059669' : '#dc2626' }}>
              {trans.category.includes('sale') && !trans.category.includes('return') || trans.category.includes('purchase_return') ? '+' : '-'}
              Rs. {trans.total.toFixed(2)}
            </div>
          </div>
        ))}
        {filteredTransactions.length === 0 && (
          <div className="empty-state">No transactions found</div>
        )}
      </div>
    </div>
  );
}

