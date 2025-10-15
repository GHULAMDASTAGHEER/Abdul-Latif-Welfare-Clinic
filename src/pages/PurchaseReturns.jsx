import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addPurchaseReturn } from "../redux/slices/purchaseSlice";
import { updateStock } from "../redux/slices/inventorySlice";
import "../css/Returns.css";

export default function PurchaseReturns() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const invoices = useSelector(state => state.purchase.invoices);
  const returns = useSelector(state => state.purchase.returns);
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
      returnNo: `PRN-${Date.now()}`,
      date: new Date().toISOString(),
      originalInvoice: selectedInvoice.invoiceNo,
      supplierName: selectedInvoice.supplierName,
      items: itemsToReturn,
      total: itemsToReturn.reduce((sum, item) => sum + (item.purchasePrice * item.returnQty), 0),
      reason,
      type: "purchase_return"
    };

    dispatch(addPurchaseReturn(returnInvoice));
    
    itemsToReturn.forEach(item => {
      dispatch(updateStock({ id: item.id, quantity: -item.returnQty }));
    });

    alert("Purchase return processed successfully!");
    setSelectedInvoice(null);
    setReturnItems([]);
    setReason("");
  };

  return (
    <div className="returns-container">
      <div className="page-header">
        <div>
          <h1>Purchase Returns</h1>
          <p>Return items to suppliers</p>
        </div>
        <button onClick={() => navigate("/dashboard")} className="btn-secondary">Back to Dashboard</button>
      </div>

      <div className="returns-layout">
        <div className="invoices-section">
          <h3>Select Purchase Invoice</h3>
          <div className="invoices-list-small">
            {invoices.map(invoice => (
              <div
                key={invoice.id}
                className={`invoice-item ${selectedInvoice?.id === invoice.id ? 'selected' : ''}`}
                onClick={() => handleSelectInvoice(invoice)}
              >
                <div className="invoice-no">{invoice.invoiceNo}</div>
                <div>{invoice.supplierName}</div>
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
                      <p>Available: {item.quantity} | Price: Rs. {item.purchasePrice}</p>
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
                        Refund: Rs. {item.purchasePrice * item.returnQty}
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
                  Rs. {returnItems.reduce((sum, item) => sum + (item.purchasePrice * item.returnQty), 0)}
                </span>
              </div>
              <button onClick={handleSubmitReturn} className="btn-primary">Process Return</button>
            </>
          ) : (
            <div className="empty-state">Select a purchase invoice to process return</div>
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
                <p><strong>Supplier:</strong> {ret.supplierName}</p>
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

