import React, {useState} from 'react'
import Tooltip from './Tooltip'
import { FaCopy, FaFilePdf } from 'react-icons/fa'

export default function ResultCard({result, onCopy, onDownload, suggestions = []}){
  const [open, setOpen] = useState(false)
  if(!result) return null
  const { pph, ppn, bphtb, npop, npoptkp, total, format } = result

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">Ringkasan Pajak</h3>
          <div className="text-sm text-gray-300">Rincian PPh, PPN, dan BPHTB</div>
        </div>
        <div className="space-x-2">
          <button onClick={onCopy} className="btn btn-accent"><FaCopy/> Salin Hasil</button>
          <button onClick={onDownload} className="btn btn-pdf"><FaFilePdf/> Unduh PDF</button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-white/3 rounded">
          <div className="text-xs text-gray-300">PPh Penjual ({(pph.rate*100).toFixed(2)}%)</div>
          <div className="font-medium mt-1">{format.IDR(pph.amount)}</div>
        </div>
        <div className="p-3 bg-white/3 rounded">
          <div className="text-xs text-gray-300">PPN ({(ppn.rate*100).toFixed(2)}%)</div>
          <div className="font-medium mt-1">{format.IDR(ppn.amount)}</div>
          {ppn.govtCovered>0 && <div className="text-xs text-green-300">DTP pemerintah: {format.IDR(ppn.govtCovered)}</div>}
        </div>
        <div className="p-3 bg-white/3 rounded">
          <div className="text-xs text-gray-300">BPHTB (5% × dasar)</div>
          <div className="font-medium mt-1">{format.IDR(bphtb.amount)}</div>
        </div>
      </div>

      <div className="mt-4 border-t pt-3 flex items-center justify-between">
        <div className="text-sm text-gray-300">NPOP digunakan: {format.IDR(npop)} — NPOPTKP: {format.IDR(npoptkp)}</div>
        <div className="text-xl font-bold">Total: {format.IDR(total)}</div>
      </div>

      <div className="mt-3">
        <button className="text-sm text-blue-200" onClick={()=>setOpen(!open)}>{open? 'Sembunyikan' : 'Lihat Rincian'}</button>
        {open && (
          <div className="mt-2 text-xs text-gray-300">
            <div><strong>Dasar Hukum:</strong> UU HPP & PMK 2024-2025 (PPh Final, PPN, BPHTB).</div>
            <div className="mt-1"><strong>Catatan insentif:</strong> DTP untuk rumah ≤Rp5.000.000 — pemerintah menanggung PPN sampai bagian Rp2.000.000.</div>
          </div>
        )}
      </div>
      {suggestions && suggestions.length>0 && (
        <div className="mt-4 p-3 bg-yellow-900/20 rounded text-sm">
          <div className="font-semibold">Saran Mode Konsultan</div>
          <ul className="list-disc list-inside mt-2">
            {suggestions.map((s, i)=>(<li key={i}>{s}</li>))}
          </ul>
        </div>
      )}
    </div>
  )
}
