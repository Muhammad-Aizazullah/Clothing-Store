// 20/06/2026
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

export default function AdminSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingsId, setSettingsId] = useState(null);
  const [form, setForm] = useState({
    free_delivery_enabled: true,
    free_delivery_minimum: 5000,
    whatsapp_number: '923001234567',
  });

  useEffect(() => {
    async function load() {
      const all = await base44.entities.StoreSettings.list();
      if (all.length > 0) {
        const s = all[0];
        setSettingsId(s.id);
        setForm({
          free_delivery_enabled: s.free_delivery_enabled ?? true,
          free_delivery_minimum: s.free_delivery_minimum ?? 5000,
          whatsapp_number: s.whatsapp_number ?? '923001234567',
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    if (settingsId) {
      await base44.entities.StoreSettings.update(settingsId, form);
    } else {
      const created = await base44.entities.StoreSettings.create(form);
      setSettingsId(created.id);
    }
    toast({ description: 'Settings saved', duration: 3000 });
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="animate-pulse h-12 bg-secondary" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-8">
      {/* Delivery Settings */}
      <div className="border border-border p-6 space-y-5">
        <h3 className="text-xs tracking-[0.25em] uppercase font-medium">Delivery Settings</h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm tracking-wide">Free Delivery</p>
            <p className="text-xs text-muted-foreground mt-0.5">Offer free delivery above a minimum order</p>
          </div>
          <button
            onClick={() => setForm(f => ({ ...f, free_delivery_enabled: !f.free_delivery_enabled }))}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
              form.free_delivery_enabled ? 'bg-foreground' : 'bg-border'
            }`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-background transition-transform duration-300 ${
              form.free_delivery_enabled ? 'translate-x-7' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {form.free_delivery_enabled && (
          <div>
            <label className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">
              Minimum Order for Free Delivery (PKR)
            </label>
            <input
              type="number"
              min="0"
              value={form.free_delivery_minimum}
              onChange={e => setForm(f => ({ ...f, free_delivery_minimum: parseInt(e.target.value) || 0 }))}
              className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground transition-colors"
              placeholder="5000"
            />
          </div>
        )}
      </div>

      {/* WhatsApp Settings */}
      <div className="border border-border p-6 space-y-4">
        <h3 className="text-xs tracking-[0.25em] uppercase font-medium">WhatsApp Contact</h3>
        <div>
          <label className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">
            WhatsApp Number (with country code, no + or spaces)
          </label>
          <input
            type="text"
            value={form.whatsapp_number}
            onChange={e => setForm(f => ({ ...f, whatsapp_number: e.target.value.replace(/\D/g, '') }))}
            className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground transition-colors"
            placeholder="923001234567"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Example: 923001234567 for +92 300 123 4567
          </p>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-foreground text-background px-8 py-3 text-xs tracking-[0.2em] uppercase hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
}