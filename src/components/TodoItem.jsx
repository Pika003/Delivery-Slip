import React, { useState } from "react";
import { useTodo } from "../contexts/TodoContext";

function TodoItem({ todo, Tid }) {
  const [isTodoEditable, setIsTodoEditable] = useState(false);
  const [tnumber, setTnumber] = useState(todo.number);
  const [taddress, setTaddress] = useState(todo.address);
  const { updateTodo, deleteTodo, toggleComplete } = useTodo();

  const editTodo = () => {
    updateTodo(todo.id, { ...todo, todo: { tnumber, taddress } });
    setIsTodoEditable(false);
  };

  const toggle = () => {
    toggleComplete(todo.id);
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
            onChange={(e) => setTnumber((e.target.value).toUpperCase())}
            readOnly={!isTodoEditable}
          />
        </td>
        <td className="border border-gray-300">
          <textarea
            className="resize-none w-20 text-[0.7rem] lg:text-sm m-1 px-1 py-5 lg:m-2 lg:px-4 lg:py-2 lg:w-72 rounded-md border-none outline-none bg-gray-600 text-white "
            type="text"
            value={taddress}
            onChange={(e) => setTaddress((e.target.value).toUpperCase())}
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
    </tbody>
  );
}

export default TodoItem;
