import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addSaleReturn } from "../redux/slices/salesSlice";
import { updateStock } from "../redux/slices/inventorySlice";
import "../css/Returns.css";

export default function SaleReturns() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const invoices = useSelector(state => state.sales.invoices);
  const returns = useSelector(state => state.sales.returns);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [returnItems, setReturnItems] = useState([]);
  const [reason, setReason] = useState("");

  const handleSelectInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setReturnItems(invoice.items.map(item => ({ ...item, returnQty: 0 })));
  };

  const updateReturnQty = (index, qty) => {
    setReturnItems(returnItems.map((item, i) => 
      i === index ? { ...item, returnQty: Math.min(qty, item.quantity) } : item
    ));
  };

  const handleSubmitReturn = () => {
    const itemsToReturn = returnItems.filter(item => item.returnQty > 0);
    
    if (itemsToReturn.length === 0) {
      alert("Please select items to return");
      return;
    }

    const returnInvoice = {
      id: Date.now(),
      returnNo: `SRN-${Date.now()}`,
      date: new Date().toISOString(),
      originalInvoice: selectedInvoice.invoiceNo,
      customerName: selectedInvoice.customerName,
      items: itemsToReturn,
      total: itemsToReturn.reduce((sum, item) => sum + (item.price * item.returnQty), 0),
      reason,
      type: "sale_return"
    };

    dispatch(addSaleReturn(returnInvoice));
    
    itemsToReturn.forEach(item => {
      dispatch(updateStock({ id: item.id, quantity: item.returnQty }));
    });

    alert("Sale return processed successfully!");
    setSelectedInvoice(null);
    setReturnItems([]);
    setReason("");
  };

  return (
    <div className="returns-container">
      <div className="page-header">
        <div>
          <h1>Sale Returns</h1>
          <p>Process customer returns and refunds</p>
        </div>
        <button onClick={() => navigate("/dashboard")} className="btn-secondary">Back to Dashboard</button>
      </div>

      <div className="returns-layout">
        <div className="invoices-section">
          <h3>Select Invoice to Return</h3>
          <div className="invoices-list-small">
            {invoices.map(invoice => (
              <div
                key={invoice.id}
                className={`invoice-item ${selectedInvoice?.id === invoice.id ? 'selected' : ''}`}
                onClick={() => handleSelectInvoice(invoice)}
              >
                <div className="invoice-no">{invoice.invoiceNo}</div>
                <div>{invoice.customerName}</div>
                <div className="invoice-date">{new Date(invoice.date).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="return-form-section">
          {selectedInvoice ? (
            <>
              <h3>Return Items from {selectedInvoice.invoiceNo}</h3>
              <div className="return-items">
                {returnItems.map((item, index) => (
                  <div key={index} className="return-item">
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>Available: {item.quantity} | Price: Rs. {item.price}</p>
                    </div>
                    <div className="return-qty">
                      <label>Return Quantity:</label>
                      <input
                        type="number"
                        min="0"
                        max={item.quantity}
                        value={item.returnQty}
                        onChange={(e) => updateReturnQty(index, parseInt(e.target.value) || 0)}
                      />
                    </div>
                    {item.returnQty > 0 && (
                      <div className="return-amount">
                        Refund: Rs. {item.price * item.returnQty}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="form-group">
                <label>Reason for Return</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for return..."
                  rows="3"
                  required
                />
              </div>
              <div className="total-refund">
                <span>Total Refund:</span>
                <span className="amount">
                  Rs. {returnItems.reduce((sum, item) => sum + (item.price * item.returnQty), 0)}
                </span>
              </div>
              <button onClick={handleSubmitReturn} className="btn-primary">Process Return</button>
            </>
          ) : (
            <div className="empty-state">Select an invoice to process return</div>
          )}
        </div>
      </div>

      <div className="returns-history">
        <h3>Return History</h3>
        <div className="returns-list">
          {returns.map(ret => (
            <div key={ret.id} className="return-card">
              <div className="return-header">
                <span className="return-no">{ret.returnNo}</span>
                <span className="return-date">{new Date(ret.date).toLocaleDateString()}</span>
              </div>
              <div className="return-body">
                <p><strong>Original Invoice:</strong> {ret.originalInvoice}</p>
                <p><strong>Customer:</strong> {ret.customerName}</p>
                <p><strong>Reason:</strong> {ret.reason}</p>
                <p><strong>Items Returned:</strong> {ret.items.length}</p>
              </div>
              <div className="return-footer">
                <span>Refund Amount:</span>
                <span className="amount">Rs. {ret.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

