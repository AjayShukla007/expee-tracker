import React from 'react'
import AddToCart from './AddToCart'
// import styles from './ProductCart.module.css';


const ProductCard = () => {
  return (
    <div className='p-5 my-5 bg-sky-500 text-white text-xl hover:bg-sky-600'>
        <AddToCart/>
    </div>
  )
}

export default ProductCard