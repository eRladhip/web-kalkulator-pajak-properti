const IDR = (v) =>
  Number(v).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })

function parseNumber(v){
  const n = Number(String(v).replace(/[^0-9.-]+/g, ''))
  return isNaN(n) ? 0 : n
}

/**
 * calculateTaxes
 * input: { jenisProperti, hargaTransaksi, njop, npop, npoptkp, statusPenjual, statusPembeli, tanggal }
 * returns breakdown: pph, ppn, bphtb, total, details
 */
export function calculateTaxes(values){
  const harga = parseNumber(values.hargaTransaksi)
  const njop = parseNumber(values.njop)
  const npopInput = parseNumber(values.npop)
  const npoptkp = parseNumber(values.npoptkp || 80000000)

  const npop = Math.max(harga, njop || 0, npopInput || 0)

  // PPh final logic
  let pphRate = 0.025
  if(values.jenisProperti === 'rumah_subsidi_developer') pphRate = 0.01
  if(values.jenisProperti === 'rumah_subsidi_op') pphRate = 0.025
  if(values.jenisProperti === 'rumah_komersial') pphRate = 0.025
  if(values.jenisProperti === 'tanah') pphRate = 0.025

  // Example: if seller status is non-resident or special, could change; keep mapping simple
  if(values.statusPenjual === 'perorangan_nonwp') pphRate = Math.max(pphRate, 0.025)

  const pph = Math.round(harga * pphRate)

  // PPN logic: rate depends on date (11% or 12%) and property type
  const cutoff = process.env.PPN_CUTOFF_DATE || '2025-01-01'
  const txDate = values.tanggal ? new Date(values.tanggal) : new Date()
  const rateDate = new Date(cutoff)
  const ppnRate = txDate >= rateDate ? 0.12 : 0.11

  let ppn = 0
  let ppnGovtCovered = 0
  if(values.jenisProperti === 'rumah_subsidi_developer' || values.jenisProperti === 'rumah_subsidi_op'){
    // Rumah subsidi: PPN 0%
    ppn = 0
  } else {
    // general
    const base = harga
    const fullPpn = Math.round(base * ppnRate)
    // DTP incentive: rumah <= 5_000_000 gets govt cover up to Rp2.000.000 of the base (converted to PPN)
    if(values.jenisProperti === 'rumah' || values.jenisProperti === 'rumah_komersial'){
      if(harga <= 5000000){
        const coveredBase = Math.min(2000000, base)
        ppnGovtCovered = Math.round(coveredBase * ppnRate)
      }
    }
    ppn = Math.max(0, fullPpn - ppnGovtCovered)
  }

  // BPHTB: 5% × max(NPOP - NPOPTKP, 0)
  const dasarBPHTB = Math.max(0, npop - npoptkp)
  const bphtb = Math.round(dasarBPHTB * 0.05)

  const total = Math.max(0, pph + ppn + bphtb)

  return {
    pph: { amount: pph, rate: pphRate },
    ppn: { amount: ppn, rate: ppnRate, govtCovered: ppnGovtCovered },
    bphtb: { amount: bphtb, dasar: dasarBPHTB },
    npop,
    npoptkp,
    total,
    format: { IDR }
  }
}

export { IDR }
