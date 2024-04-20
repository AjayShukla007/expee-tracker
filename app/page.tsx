'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'

import { collection, addDoc, getDoc, QuerySnapshot, query, onSnapshot } from "firebase/firestore";
import { db } from './firebase';

interface Items {
  name: string,
  price: number
}


export default function Home() {

  const [items, setitems] = useState([
    // { name: 'coffee', price: 4.95 },
    // { name: 'movie', price: 20.00 },
    // { name: 'kurkure', price: 5.00 }
  ])

  const [newItem, setNewItem] = useState<Items>({
    name: '',
    price: 0
  })
  const [total, setTotal] = useState<number>(0)
  const [warning, setWarning] = useState<string>(' ')
  // Add items to the db
  const addItems = async (e: any) => {
    e.preventDefault();
    
    if (newItem.name === '' || newItem.price === 0){
      setWarning("PLEASE ENTER VALID INPUT")
      setTimeout(() => {
        setWarning(' ')
      }, 2000);
      // console.log(warning);
      return;
    }
    // setitems([...items, newItem])
    await addDoc(collection(db, 'items'), {
      name: newItem.name.trim(),
      price: newItem.price
    })

    setNewItem({name: '', price: 0})

}


  // Read items from the db 
useEffect(() => {
  const q = query(collection(db, 'items'))
  const unSubscribe = onSnapshot(q, (QuerySnapshot)=>{
    let itemsArr :any = []

    QuerySnapshot.forEach((doc)=>{
      itemsArr.push({...doc.data(), id: doc.id})
    })
    setitems(itemsArr)
    
    // read total from the itmes array
    const calculateTotal = () => {
      const totalPrice = itemsArr.reduce((sum: number, item: { price: number }) => sum + item.price, 0)
      setTotal(totalPrice)
    }
    calculateTotal()
    return () => unSubscribe()
  })

}, [])

  // update items from the db

  // delete items from the db


  return (
    <main className='flex min-h-screen flex-col items-center justify-start p-24'>
      <p className='text-red-700 h-2'>{warning}</p>
      <h1 className='text-4xl p-4'>Expence Tracker</h1>
      <Link href="/about">About</Link>
      <div className='bg-slate-800 p-4 rounded-lg'>
        <form className='grid grid-cols-6 items-center text-black'>
          <input onChange={(e: any) => setNewItem({ ...newItem, name: e.target.value })} value={newItem.name} className='col-span-3 p-3 border ' type="text" placeholder='Enter item' />
          <input onChange={(e: any) => setNewItem({ ...newItem, price: e.target.value })} value={newItem.price} className='col-span-2 p-3 border mx-3' type="number" placeholder='Enter $' />
          <button onClick={addItems} className='text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl' type='submit'>+</button>
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
