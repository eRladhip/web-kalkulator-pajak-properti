import React from 'react'

export default function Tooltip({children, title}){
  return (
    <span className="relative group inline-flex items-center">
      <span className="underline decoration-dotted cursor-help">{children}</span>
      <div className="absolute bottom-full mb-2 hidden group-hover:block w-72 p-2 text-xs rounded bg-black/80 text-white z-50">
        {title}
      </div>
    </span>
  )
}
