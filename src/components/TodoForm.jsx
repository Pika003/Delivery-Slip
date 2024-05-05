import React, { useEffect, useState } from 'react'
import { useTodo } from '../contexts/TodoContext'

function TodoForm() {
    const [showcopy, setShowCopy] = useState(false)
    const [newloc, setNewloc] = useState("")
    const [number, setNumber] = useState("")
    const [address, setAddress] = useState("")
    const [location, setLocation] = useState("")
    const [allLocation, setAllLocation] = useState([])
    const {addTodo} = useTodo()

    useEffect(() => {
      const allLocations = JSON.parse(localStorage.getItem("allLocation"));
      if (allLocations && allLocations.length > 0) {
        setAllLocation(allLocations);
      }
    }, []);

    useEffect(()=>{
      localStorage.setItem("allLocation", JSON.stringify(allLocation));
    },[allLocation])

    const add = (e)=>{
      e.preventDefault()
      if(number === "" || address === "") return;

      //Edit ........
      addTodo({number, address: `${address}\n${location}`, completed: false})
      setNumber("");
      setAddress("");
    }

    const submitCopy =()=>{
      setAllLocation(prev => [...prev, newloc]);
      setShowCopy(false);
      setNewloc('');
    }

    const addCopy=()=>{
      setShowCopy(true);
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
        <div className='flex gap-4 flex-wrap items-center justify-center'>
          <select className='px-4 py-3 rounded-md bg-gray-600 w-56' value={location} onChange={e=>setLocation(e.target.value)}>
            {allLocation && (
              allLocation.map((copy, index)=>(
                <option key={index} value={copy}>{copy}</option>
              ))
            )}
          </select>
          <div onClick={addCopy} className='p-3 rounded-md bg-gray-600'>➕</div>
          {showcopy && (
            <div className='flex gap-4 flex-wrap items-center justify-center'>
              <textarea 
              type="text" 
              placeholder='Add another copy'
              value={newloc}
              onChange={(e)=> setNewloc((e.target.value).toUpperCase())}
              className="resize-none px-4 py-3 rounded-md border-none outline-none w-56 h-12 font-bold text-black bg-gray-600 text-base "
              />
              <div onClick={submitCopy} className='p-3 rounded-md bg-gray-600'>✅</div>
            </div>
          )}
        </div>
        <button 
          className="px-4 py-3 rounded-md w-72 lg:w-32 bg-blue-900 text-white text-base border-none cursor-pointer"
          type='submit'
        >Add</button>
    </form>
  )
}

export default TodoForm;