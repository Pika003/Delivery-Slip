import React, { useState } from 'react'
import { useTodo } from '../contexts/TodoContext'

function TodoForm() {
    const [number, setNumber] = useState("")
    const [address, setAddress] = useState("")
    const [location, setLocation] = useState("KRISHNANAGAR")
    const {addTodo} = useTodo()

    const add = (e)=>{
      e.preventDefault()
      if(number === "" || address === "") return;

       

      addTodo({number, address: `${address}\n${location}\nSAGAR KRISHNANAGAR, 743373`, completed: false})
      setNumber("");
      setAddress("");
    }

  return (
    <form onSubmit={add} className="mb-8 flex items-center justify-center flex-col lg:flex-row gap-3">
        <input 
            type="text" 
            placeholder='Article Number...'
            value={number}
            onChange={(e)=> setNumber((e.target.value).toUpperCase())}
            className="px-4 py-2 rounded-md border-none outline-none w-72 h-12 font-bold text-black bg-gray-600 text-base "
        />
        <textarea 
            type="text" 
            placeholder='Addressee Details...'
            value={address}
            onChange={(e)=> setAddress((e.target.value).toUpperCase())}
            className="resize-none px-4 py-3 rounded-md border-none outline-none w-72 h-12 font-bold text-black bg-gray-600 text-base "
        />
        <select className='px-4 py-3 rounded-md bg-gray-600 w-72' value={location} onChange={e=>setLocation(e.target.value)}>
          <option value="KRISHNANAGAR">KRISHNANAGAR</option>
          <option value="NARAHARIPUR">NARAHARIPUR</option>
        </select>
        
        <button 
          className="px-4 py-3 rounded-md w-72 lg:w-32 bg-blue-900 text-white text-base border-none cursor-pointer"
          type='submit'
        >Add</button>
    </form>
  )
}

export default TodoForm;