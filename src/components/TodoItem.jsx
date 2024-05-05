import React, { useState } from "react";
import { useTodo } from "../contexts/TodoContext";

function TodoItem({ todo, Tid }) {
  const [isTodoEditable, setIsTodoEditable] = useState(false);
  const [tnumber, setTnumber] = useState(todo.number);
  const [taddress, setTaddress] = useState(todo.address);
  const [popup, setPopup] = useState(false);
  const { updateTodo, deleteTodo, todos } = useTodo();

  const editTodo = () => {
    updateTodo(todo.id, {id: todo.id, number: tnumber, address: taddress , completed: false} );
    setIsTodoEditable(false);
  };

  const saveDetails = () => {
    setIsTodoEditable((prev) => !prev);
    editTodo();
    setPopup(false);
  };

  const closeDetails = () => {
    setIsTodoEditable((prev) => !prev);
    setPopup(false);
  };

  return (
    <tbody>
      <tr>
        <td className="border border-gray-300">
          <span className="px-4 py-2 rounded-md">{Tid + 1}</span>
        </td>
        <td className="border border-gray-300">
          <input
            className="m-2 px-4 py-2 sm:py-5 w-20 sm:w-72 rounded-md border-none outline-none bg-gray-600 text-white "
            type="text"
            value={tnumber}
            onChange={(e) => setTnumber(e.target.value.toUpperCase())}
            readOnly={!isTodoEditable}
          />
        </td>
        <td className="border border-gray-300">
          <textarea
            className="resize-none w-20 text-[0.7rem] lg:text-sm m-1 px-1 py-5 lg:m-2 lg:px-4 lg:py-2 lg:w-72 rounded-md border-none outline-none bg-gray-600 text-white "
            type="text"
            value={taddress}
            onChange={(e) => setTaddress(e.target.value.toUpperCase())}
            readOnly={!isTodoEditable}
          />
        </td>
        <td className="border border-gray-300 lg:block hidden">
          <input
            className="m-2 px-4 py-2 sm:py-4 w-0 lg:w-72 rounded-md border-none outline-none font-bold text-lg bg-gray-600 text-white"
            readOnly
          />
        </td>
        <td className="border border-gray-300">
          {/* Edit and save button */}
          <button
            className="m-2 px-4 py-2 sm:py-4 bg-gray-600 rounded-md border-none"
            onClick={() => {
              if (todo.completed) return;

              if (isTodoEditable) {
                editTodo();
              } else {
                setPopup(true);
                setIsTodoEditable((prev) => !prev);
              }
            }}
            disabled={todo.toggle}
          >
            {isTodoEditable ? "📁" : "✏️"}
          </button>
          {/* Delete Button */}
          <button
            className="m-2 px-4 py-2 sm:py-4 bg-gray-600 rounded-md border-none"
            onClick={() => deleteTodo(todo.id)}
          >
            ❌
          </button>
        </td>
      </tr>
      {popup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
          <div className="relative bg-gray-600 w-full lg:w-96 h-[30rem] lg:h-[30rem] rounded-md flex flex-col items-center pt-10">
            <div
              className=" absolute left-0 top-0 w-9 h-9 bg-white rounded-xl cursor-pointer flex items-center justify-center m-2"
              onClick={closeDetails}
            > ✖️ </div>

            <h2 className="text-xl font-semibold font-mono mb-5">Edit the Information</h2>
            
            <label className=" font-semibold ml-[-10rem]">Article Number</label>
            <input
              className="m-2 px-4 py-2 w-72 rounded-md border-none outline-none bg-gray-800 text-white "
              type="text"
              value={tnumber}
              onChange={(e) => setTnumber(e.target.value.toUpperCase())}
              readOnly={!isTodoEditable}
            />

            <label className="mt-2 font-semibold ml-[-10rem]">Addressee Details</label>
            <textarea
              className="resize-none w-72 m-1 p-4 h-52 rounded-md border-none outline-none bg-gray-800 text-white "
              type="text"
              value={taddress}
              onChange={(e) => setTaddress(e.target.value.toUpperCase())}
              readOnly={!isTodoEditable}
            />
            
            <div onClick={saveDetails} className="mt-2 bg-purple-950 text-white py-2 px-6 rounded-md cursor-pointer">Submit</div>
          </div>
        </div>
      )}
    </tbody>
  );
}

export default TodoItem;
