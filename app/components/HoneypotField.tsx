'use client'

/**
 * Composant Honeypot - Champ invisible pour détecter les bots
 * 
 * Les bots remplissent automatiquement tous les champs, y compris les champs cachés.
 * Les humains ne voient pas ce champ et ne le remplissent donc jamais.
 * 
 * Si ce champ est rempli, c'est un bot → la soumission est rejetée côté serveur.
 */

interface HoneypotFieldProps {
  name?: string
  value: string
  onChange: (value: string) => void
  tabIndex?: number
}

export default function HoneypotField({ 
  name = 'website', 
  value, 
  onChange,
  tabIndex = -1 
}: HoneypotFieldProps) {
  return (
    <div
      className="honeypot-field"
      style={{
        position: 'absolute',
        left: '-9999px',
        width: '1px',
        height: '1px',
        opacity: 0,
        pointerEvents: 'none'
      }}
      aria-hidden="true"
    >
      <label htmlFor={name} style={{ display: 'none' }}>
        Website (leave blank)
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        tabIndex={tabIndex}
        aria-hidden="true"
        style={{ display: 'none' }}
      />
    </div>
  )
}
