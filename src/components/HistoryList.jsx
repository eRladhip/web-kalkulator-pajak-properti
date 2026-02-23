import React from 'react'

export default function HistoryList({items, onUse, onClear}){
  if(!items || items.length===0) return <div className="text-sm text-gray-300">Belum ada riwayat.</div>
  return (
    <div className="space-y-2">
      {items.map((it, idx)=> (
        <div key={idx} className="card flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-200">{new Date(it.tanggal).toLocaleDateString('id-ID')}</div>
            <div className="font-medium">{Number(it.hargaTransaksi).toLocaleString('id-ID', {style:'currency',currency:'IDR',maximumFractionDigits:0})}</div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-watercolor-500 rounded text-white text-sm" onClick={()=>onUse(it)}>Pakai</button>
          </div>
        </div>
      ))}
      <button className="text-sm text-red-300" onClick={onClear}>Hapus Riwayat</button>
    </div>
  )
}
