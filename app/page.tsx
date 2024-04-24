'use client'
import React, { useState, useEffect, Key, ChangeEvent, FormEvent } from 'react'
import DOMPurify from 'dompurify';
import { collection, addDoc, getDoc, QuerySnapshot, query, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from './firebase';

interface Items {
  name: string,
  price: number,
  id?: string
}

export default function Home() {
  const [items, setitems] = useState<Items[]>([
  ])

  const [newItem, setNewItem] = useState<Items>({
    name: '',
    price: 0
  })
  const [total, setTotal] = useState<number>(0)
  const [warning, setWarning] = useState<string>(' ')
  // Add items to the db
  const addItems = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (newItem.name === '' || newItem.price === 0) {
      setWarning("PLEASE ENTER VALID INPUT")
      setTimeout(() => {
        setWarning(' ')
      }, 2000);
      // console.log(warning);
      return;
    } else {
      const filterName = DOMPurify.sanitize(newItem.name)
      const filterPrice = DOMPurify.sanitize(newItem.price.toString())
      await addDoc(collection(db, 'items'), {
        name: filterName.trim(),
        price: parseFloat(filterPrice)
      })

      setNewItem({ name: '', price: 0 })
    }


  }


  // Read items from the db 
  useEffect(() => {
    const q = query(collection(db, 'items'))
    const unSubscribe = onSnapshot(q, (QuerySnapshot) => {
      let itemsArr: Items[] = []

      QuerySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id } as Items)
      })
      setitems(itemsArr)

      // read total from the itmes array
      const calculateTotal = () => {
        const totalPrice = itemsArr.reduce(
          (sum, item) => sum + parseFloat(item.price.toString()),
          0
        );
        // console.log(totalPrice);
        setTotal(totalPrice)
      }
      calculateTotal()
      return () => unSubscribe()
    })

  }, [])

  // update items from the db
  // [] todo
  // delete items from the db
  const deleteItems = async (id: string) => {
    // console.log(id);
    // console.log(items);
    try {
      await deleteDoc(doc(db, 'items', id))

    } catch (error) {
      setWarning('connot delete right now please try again later')
      console.log(error);
    }
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-start p-24'>
      <p className='text-red-700 h-2'>{warning}</p>
      <h1 className='text-2xl p-4'>Expence Tracker</h1>
      <div className='bg-slate-800 p-4 rounded-lg'>
        <form className='grid grid-cols-6 items-center text-black'>
          <input onChange={(e: ChangeEvent<HTMLInputElement>) => setNewItem({ ...newItem, name: e.target.value })} value={newItem.name} className='col-span-3 p-3 border ' type="text" placeholder='Enter item' />
          <input onChange={(e: ChangeEvent<HTMLInputElement>) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })} value={newItem.price} className='col-span-2 p-3 border mx-3' type="number" placeholder='Enter $' />
          <button onClick={addItems} className='text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl' type='submit'>+</button>
        </form>
        <ul>
          {items.map((item, id: Key) => (
            <li key={id} className='bg-slate-900 my-4 flex justify-between'>
              <div className='p-4 w-full flex justify-between'>
                {item.name} - ${item.price}

              </div>
              <button onClick={() => deleteItems(item.id!)} className='ml-4 p-4 border-l-2 border-slate-900 hover:bg-slate-950 w-16'>X</button>
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
