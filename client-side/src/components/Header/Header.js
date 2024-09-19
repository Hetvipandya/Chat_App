import React from 'react'
import './Header.css'
import { IoCallOutline } from "react-icons/io5";
import { MdOutlineVideoCall } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";

const Header = () => {
  return (
    <div className='column'>
      <div className="header">
        <div className='row'>
          <div className='col header_icon'><IoCallOutline /></div>
          <div className='col header_icon'><MdOutlineVideoCall /></div>
          <div className='col header_icon'><IoSearchSharp /></div>
        </div>
      </div>
  </div>
  )
}

export default Header
