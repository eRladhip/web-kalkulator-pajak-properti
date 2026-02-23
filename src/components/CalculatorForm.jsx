import React, {useState, useEffect} from 'react'
import { calculateTaxes, IDR } from '../utils/taxUtils'
import ResultCard from './ResultCard'
import HistoryList from './HistoryList'
import Tooltip from './Tooltip'
import { FaCopy, FaFilePdf, FaSyncAlt, FaHistory, FaUserTie } from 'react-icons/fa'

const STORAGE_KEY = 'kalkulatorPajakHistory'

const defaultState = {
  jenisProperti: 'rumah_komersial',
  hargaTransaksi: 0,
  njop: '',
  npop: '',
  npoptkp: 80000000,
  statusPenjual: 'perorangan',
  statusPembeli: 'perorangan',
  tanggal: new Date().toISOString().slice(0,10)
}

export default function CalculatorForm(){
  const [form, setForm] = useState(()=> ({...defaultState}))
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [consultantMode, setConsultantMode] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  useEffect(()=>{
    const raw = localStorage.getItem(STORAGE_KEY)
    if(raw) setHistory(JSON.parse(raw))
  }, [])

  function saveHistory(entry){
    const arr = [entry, ...history].slice(0,10)
    setHistory(arr)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
  }

  function handleChange(e){
    const {name, value} = e.target
    setForm(f=> ({...f, [name]: value}))
  }

  function handleNumber(name, value){
    const v = value.replace(/[^0-9]/g,'')
    setForm(f=> ({...f, [name]: v}))
  }

  function onSubmit(e){
    e.preventDefault()
    const res = calculateTaxes(form)
    // build simple suggestions for 'Mode Konsultan'
    const sugg = []
    if(res.bphtb.amount > 0) sugg.push('Pertimbangkan negosiasi harga atau verifikasi NJOP/NPOP untuk menurunkan dasar BPHTB.')
    if(res.ppn.govtCovered > 0) sugg.push('Insentif DTP terpakai — bagian PPN ditanggung pemerintah.')
    if(res.pph.amount > (Number(form.hargaTransaksi || 0) * 0.02)) sugg.push('Periksa status penjual (badan vs perorangan) untuk optimasi PPh.')
    if(res.total === 0) sugg.push('Total pajak 0 — pastikan data input benar.')

    setResult(res)
    setSuggestions(sugg)
    saveHistory({ ...form, result: res, tanggal: form.tanggal })
  }

  function onReset(){
    setForm({...defaultState})
    setResult(null)
  }

  function onCopy(){
    if(!result) return
    const text = `PPh: ${IDR(result.pph.amount)}\nPPN: ${IDR(result.ppn.amount)}\nBPHTB: ${IDR(result.bphtb.amount)}\nTOTAL: ${IDR(result.total)}`
    navigator.clipboard.writeText(text)
      .then(()=> alert('Hasil disalin ke clipboard'))
      .catch(()=> alert('Gagal menyalin'))
  }

  async function onDownload(){
    const el = document.getElementById('kalkulator-root')
    try{
      const html2pdf = (await import('html2pdf.js')).default
      // html2pdf expects window.html2pdf helper; call as function
      const opt = { margin: 0.4, filename: 'kalkulator-pajak.pdf', html2canvas: { scale: 2 } }
      html2pdf().from(el).set(opt).save()
    }catch(err){
      console.error(err)
      alert('PDF generator tidak tersedia. Pastikan dependensi terpasang.')
    }
  }

  function onUseHistory(item){
    setForm({...item, hargaTransaksi: item.hargaTransaksi, tanggal: item.tanggal})
    if(item.result) setResult(item.result)
  }

  function onClearHistory(){
    localStorage.removeItem(STORAGE_KEY)
    setHistory([])
  }

  return (
    <div id="kalkulator-root" className="space-y-4">
      <form onSubmit={onSubmit} className="card grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm">Jenis Properti <Tooltip title="Pilih jenis untuk menentukan tarif PPh & PPN (rumah subsidi, komersial, tanah).">ℹ️</Tooltip></label>
          <select name="jenisProperti" value={form.jenisProperti} onChange={handleChange} className="w-full p-2 rounded bg-black/10">
            <option value="rumah_subsidi_developer">Rumah Subsidi (Developer)</option>
            <option value="rumah_subsidi_op">Rumah Subsidi (Orang Pribadi)</option>
            <option value="rumah_komersial">Rumah Komersial</option>
            <option value="tanah">Tanah</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm">Harga Transaksi</label>
          <input name="hargaTransaksi" value={form.hargaTransaksi} onChange={(e)=>handleNumber('hargaTransaksi', e.target.value)} className="w-full p-2 rounded bg-black/10" />
        </div>

        <div className="space-y-2">
          <label className="text-sm">NJOP (opsional)</label>
          <input name="njop" value={form.njop} onChange={(e)=>handleNumber('njop', e.target.value)} className="w-full p-2 rounded bg-black/10" />
        </div>

        <div className="space-y-2">
          <label className="text-sm">NPOP (opsional)</label>
          <input name="npop" value={form.npop} onChange={(e)=>handleNumber('npop', e.target.value)} className="w-full p-2 rounded bg-black/10" />
        </div>

        <div className="space-y-2">
          <label className="text-sm">NPOPTKP (default Rp80.000.000) <Tooltip title="NPOPTKP adalah Nilai Perolehan Objek Pajak Tidak Kena Pajak; dapat berbeda per daerah.">ℹ️</Tooltip></label>
          <input name="npoptkp" value={form.npoptkp} onChange={(e)=>handleNumber('npoptkp', e.target.value)} className="w-full p-2 rounded bg-black/10" />
        </div>

        <div className="space-y-2">
          <label className="text-sm">Status Penjual <Tooltip title="Status penjual mempengaruhi tarif PPh final (perorangan/badan).">ℹ️</Tooltip></label>
          <select name="statusPenjual" value={form.statusPenjual} onChange={handleChange} className="w-full p-2 rounded bg-black/10">
            <option value="perorangan">Perorangan</option>
            <option value="perorangan_nonwp">Perorangan (Non WP)</option>
            <option value="badan">Badan</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm">Status Pembeli</label>
          <select name="statusPembeli" value={form.statusPembeli} onChange={handleChange} className="w-full p-2 rounded bg-black/10">
            <option value="perorangan">Perorangan</option>
            <option value="badan">Badan</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm">Tanggal Transaksi</label>
          <input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} className="w-full p-2 rounded bg-black/10" />
        </div>

        <div className="md:col-span-2 flex gap-2 mt-2">
          <button type="submit" className="btn btn-primary"> <FaCalculator className="inline"/> Hitung</button>
          <button type="button" onClick={onReset} className="btn btn-secondary"> <FaSyncAlt/> Reset</button>
          <button type="button" onClick={onCopy} className="btn btn-accent"> <FaCopy/> Salin Hasil</button>
          <button type="button" onClick={onDownload} className="btn btn-pdf"> <FaFilePdf/> Unduh PDF</button>
          <label className="ml-auto flex items-center gap-2 text-sm">
            <input type="checkbox" checked={consultantMode} onChange={(e)=>setConsultantMode(e.target.checked)} /> <FaUserTie/> Mode Konsultan
          </label>
        </div>
      </form>

      {result && <ResultCard result={result} onCopy={onCopy} onDownload={onDownload} suggestions={consultantMode ? suggestions : []} />}

      <div className="card">
        <h4 className="font-semibold">Riwayat Perhitungan</h4>
        <HistoryList items={history} onUse={onUseHistory} onClear={onClearHistory} />
      </div>
    </div>
  )
}
