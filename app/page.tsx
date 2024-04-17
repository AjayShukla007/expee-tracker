'use client'
import Image from 'next/image'

import React, { useState, useEffect } from 'react'

import Link from 'next/link'

interface Items {
  name: string,
  price: number
}

export default function Home() {

  const [items, setitems] = useState([
    { name: 'coffee', price: 4.95 },
    { name: 'movie', price: 20.00 },
    { name: 'kurkure', price: 5.00 }
  ])
  const [total, setTotal] = useState(0)

  return (
    <main className='flex min-h-screen flex-col items-center justify-start p-24'>
      <h1 className='text-4xl p-4'>Expence Tracker</h1>
      <Link href="/about">About</Link>
      <div className='bg-slate-800 p-4 rounded-lg'>
        <form className='grid grid-cols-6 items-center text-black'>
          <input className='col-span-3 p-3 border ' type="text" placeholder='Enter item' />
          <input className='col-span-2 p-3 border mx-3' type="number" placeholder='Enter $' />
          <button className='text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl' type='submit'>+</button>
        </form>
        <ul>
          {items.map((item, id) => (
            <li key={id} className='bg-slate-900 my-4 flex justify-between'>
              <div className='p-4 w-full flex justify-between'>
              {item.name} - ${item.price}

              </div>
              <button className='ml-4 p-4 border-l-2 border-slate-900 hover:bg-slate-950 w-16'>X</button>
            </li>
          ))}
        </ul>
          {items.length < 1 ? ('') : (
            <div className='flex justify-between p-3'>
              <span>Total</span>
              <span>${total}</span>
            </div>
          )}
      </div>
    </main>
  )
}
