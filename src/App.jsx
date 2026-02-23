import React from 'react'
import CalculatorForm from './components/CalculatorForm'

export default function App(){
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Kalkulator Pajak Properti (Indonesia)</h1>
        <p className="text-sm text-gray-300">Hitung PPh Penjual, PPN, dan BPHTB sesuai UU HPP & PMK 2024-2025</p>
      </header>

      <main>
        <CalculatorForm />
      </main>

      <footer className="mt-8 text-xs text-gray-400">Catatan: Aplikasi ini bertujuan membantu estimasi. Untuk kepastian hukum, konsultasikan dokumen resmi.</footer>
    </div>
  )
}
