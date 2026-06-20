// 20/06/2026
import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

let cachedSettings = null;
let listeners = [];

async function fetchSettings() {
  const all = await base44.entities.StoreSettings.list();
  cachedSettings = all.length > 0 ? all[0] : {
    free_delivery_enabled: true,
    free_delivery_minimum: 5000,
    whatsapp_number: '923001234567',
  };
  listeners.forEach(l => l(cachedSettings));
}

export function useStoreSettings() {
  const [settings, setSettings] = useState(cachedSettings || {
    free_delivery_enabled: true,
    free_delivery_minimum: 5000,
    whatsapp_number: '923001234567',
  });

  useEffect(() => {
    listeners.push(setSettings);
    if (!cachedSettings) fetchSettings();
    else setSettings(cachedSettings);
    return () => { listeners = listeners.filter(l => l !== setSettings); };
  }, []);

  return settings;
}