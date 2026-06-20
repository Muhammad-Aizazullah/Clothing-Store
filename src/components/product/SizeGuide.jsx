// 20/06/2026
import React from 'react';
import { X } from 'lucide-react';

const LETTER_SIZES = [
  { size: 'S',  chest: '36–38"', shoulder: '17"',  length: '28"' },
  { size: 'M',  chest: '38–40"', shoulder: '17.5"', length: '29"' },
  { size: 'L',  chest: '40–42"', shoulder: '18"',  length: '30"' },
  { size: 'XL', chest: '42–44"', shoulder: '18.5"', length: '31"' },
];

const WAIST_SIZES = [
  { size: '30', waist: '30"', hip: '34"', inseam: '30"' },
  { size: '32', waist: '32"', hip: '36"', inseam: '30"' },
  { size: '34', waist: '34"', hip: '38"', inseam: '31"' },
  { size: '36', waist: '36"', hip: '40"', inseam: '31"' },
];

export default function SizeGuide({ isOpen, onClose, sizingType }) {
  if (!isOpen) return null;

  const isWaist = sizingType === 'waist';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-background w-full max-w-lg border border-border shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="font-display text-lg tracking-[0.15em] uppercase">Size Guide</h2>
          <button onClick={onClose} className="p-1 hover:opacity-60 transition-opacity">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-xs text-muted-foreground tracking-wide mb-6">
            All measurements are in inches. For the best fit, measure over light clothing.
          </p>

          {isWaist ? (
            <>
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">Bottoms — Waist Sizing</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-muted-foreground pb-3 font-normal">Size</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-muted-foreground pb-3 font-normal">Waist</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-muted-foreground pb-3 font-normal">Hip</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-muted-foreground pb-3 font-normal">Inseam</th>
                  </tr>
                </thead>
                <tbody>
                  {WAIST_SIZES.map((row, i) => (
                    <tr key={row.size} className={i < WAIST_SIZES.length - 1 ? 'border-b border-border/50' : ''}>
                      <td className="py-3 font-medium">{row.size}</td>
                      <td className="py-3 text-muted-foreground">{row.waist}</td>
                      <td className="py-3 text-muted-foreground">{row.hip}</td>
                      <td className="py-3 text-muted-foreground">{row.inseam}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <>
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">Tops — Letter Sizing</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-muted-foreground pb-3 font-normal">Size</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-muted-foreground pb-3 font-normal">Chest</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-muted-foreground pb-3 font-normal">Shoulder</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-muted-foreground pb-3 font-normal">Length</th>
                  </tr>
                </thead>
                <tbody>
                  {LETTER_SIZES.map((row, i) => (
                    <tr key={row.size} className={i < LETTER_SIZES.length - 1 ? 'border-b border-border/50' : ''}>
                      <td className="py-3 font-medium">{row.size}</td>
                      <td className="py-3 text-muted-foreground">{row.chest}</td>
                      <td className="py-3 text-muted-foreground">{row.shoulder}</td>
                      <td className="py-3 text-muted-foreground">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* How to measure */}
          <div className="mt-6 pt-6 border-t border-border space-y-3">
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">How to Measure</p>
            {isWaist ? (
              <>
                <p className="text-xs text-muted-foreground leading-relaxed"><span className="text-foreground font-medium">Waist —</span> Measure around your natural waistline, keeping the tape comfortably loose.</p>
                <p className="text-xs text-muted-foreground leading-relaxed"><span className="text-foreground font-medium">Hip —</span> Measure around the fullest part of your hips.</p>
                <p className="text-xs text-muted-foreground leading-relaxed"><span className="text-foreground font-medium">Inseam —</span> Measure from the crotch seam to the bottom of the leg.</p>
              </>
            ) : (
              <>
                <p className="text-xs text-muted-foreground leading-relaxed"><span className="text-foreground font-medium">Chest —</span> Measure around the fullest part of your chest, keeping the tape horizontal.</p>
                <p className="text-xs text-muted-foreground leading-relaxed"><span className="text-foreground font-medium">Shoulder —</span> Measure from shoulder point to shoulder point across the back.</p>
                <p className="text-xs text-muted-foreground leading-relaxed"><span className="text-foreground font-medium">Length —</span> Measure from the highest point of the shoulder to the hem.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}