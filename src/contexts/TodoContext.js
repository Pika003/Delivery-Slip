import {createContext, useContext} from "react"

export const TodoContext = createContext({
    name: "",
    post: "",
    todos:[
        {
            id: 1,
            number: " todo msg ",
            address: " todo msg ",
            completed: false
        }
    ],
    setInfo: (name,post) => {},
    addTodo: (todo) => {},
    updateTodo: (id,todo) => {},
    deleteTodo: (id) => {},
    toggleComplete: (id) => {}
})

export const useTodo = ()=>{
    return useContext(TodoContext)
}

export const TodoProvider = TodoContext.Provider