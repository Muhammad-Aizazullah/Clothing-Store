// 20/06/2026
import React, { useState, useEffect } from 'react';
import { ChevronDown, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STATUSFLOW = ['Pending', 'Packed', 'Dispatched', 'Completed'];
const STATUSCOLORS = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Packed': 'bg-blue-100 text-blue-800',
  'Dispatched': 'bg-purple-100 text-purple-800',
  'Completed': 'bg-green-100 text-green-800',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('active');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    const all = await base44.entities.Order.list('createdDate');
    setOrders(all);
    setLoading(false);
  }

  async function updateStatus(orderId, newStatus) {
    await base44.entities.Order.update(orderId, { status: newStatus });
    load();
  }

  async function deleteOrder(orderId) {
    if (!window.confirm('Do you really want to delete this completed order?')) return;
    await base44.entities.Order.delete(orderId);
    load();
  }

  const activeOrders = orders.filter(o => o.status !== 'Completed');
  const completedOrders = orders.filter(o => o.status === 'Completed');
  const displayOrders = view === 'active' ? activeOrders : completedOrders;

  if (loading) {
    return (
      <div className="space-y-3">
        {Array(3).fill(0).map((dummy, i) => (
          <div key={i} className="animate-pulse border border-border p-5">
            <div className="h-3 bg-secondary w-1/3 mb-2" />
            <div className="h-3 bg-secondary w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setView('active')}
          className={`text-xs tracking-[0.15em] uppercase pb-1 border-b-2 transition-all ${
            view === 'active' ? 'border-foreground' : 'border-transparent text-muted-foreground'
          }`}
        >
          Active ({activeOrders.length})
        </button>
        <button
          onClick={() => setView('completed')}
          className={`text-xs tracking-[0.15em] uppercase pb-1 border-b-2 transition-all ${
            view === 'completed' ? 'border-foreground' : 'border-transparent text-muted-foreground'
          }`}
        >
          Completed ({completedOrders.length})
        </button>
      </div>

      {displayOrders.length === 0 ? (
        <div className="text-center py-16 border border-border">
          <p className="text-sm text-muted-foreground tracking-wide">
            No {view} orders
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayOrders.map(order => (
            <div key={order.id} className="border border-border">
              <div className="w-full flex items-center justify-between p-4 text-left">
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="flex-1 flex items-center justify-between text-left hover:bg-secondary/20 transition-colors py-2"
                >
                  <div>
                    <p className="text-sm font-medium tracking-wide">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {order.customerName} {order.customerPhone}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdDate).toLocaleDateString('en-PK', {
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2digit', minute: '2digit'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">PKR {order.total?.toLocaleString()}</span>
                    <span className={`text-[10px] tracking-[0.1em] uppercase px-3 py-1 ${STATUSCOLORS[order.status] || 'bg-secondary'}`}>
                      {order.status}
                    </span>
                    <ChevronDown size={16} className={`transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {view === 'completed' && (
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="p-2 text-destructive hover:bg-destructive/10 ml-2"
                    title="Delete Order"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {expandedOrder === order.id && (
                <div className="border-t border-border p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">Customer</p>
                      <p>{order.customerName}</p>
                      <p className="text-muted-foreground">{order.customerPhone}</p>
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">Shipping</p>
                      <p>{order.shippingAddress}</p>
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">Payment</p>
                      <p>{order.paymentMethod || 'COD'}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">Items</p>
                    <div className="space-y-2">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex gap-3 items-center">
                          <div className="w-10 h-12 bg-secondary flex-shrink-0 overflow-hidden">
                            {item.imageUrl && <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium">{item.productName}</p>
                            <p className="text-[10px] text-muted-foreground">{item.color} / {item.size} x {item.quantity}</p>
                          </div>
                          <p className="text-xs">PKR {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.status !== 'Completed' && (
                    <div className="flex gap-2 pt-2 border-t border-border">
                      {STATUSFLOW.map(status => {
                        const currentIdx = STATUSFLOW.indexOf(order.status);
                        const statusIdx = STATUSFLOW.indexOf(status);
                        const isNext = statusIdx === currentIdx + 1;
                        if (!isNext) return null;
                        return (
                          <button
                            key={status}
                            onClick={() => updateStatus(order.id, status)}
                            className="bg-foreground text-background px-5 py-2 text-xs tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
                          >
                            Mark as {status}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}