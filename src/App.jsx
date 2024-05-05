import { useEffect, useState } from "react";
import { TodoProvider } from "./contexts";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function App() {
  const logoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/India_Post_Logo.svg/2560px-India_Post_Logo.svg.png";

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const timestamp = Date.now();
  const today = new Date(timestamp);

  const day = today.getDate();
  const monthIndex = today.getMonth();
  const year = today.getFullYear();

  const monthAbbreviation = months[monthIndex];
  const formattedDate = `${day < 10 ? '0' + day : day}-${monthAbbreviation}-${year}`;

  const [todos, setTodos] = useState([]);
  const [name, setName] = useState('');
  const [post, setPost] = useState('');
  const [showPDF, setShowPDF] = useState(true);
  const [showInfo, setShowInfo] = useState(true);

  const addTodo = (todo) => {
    setTodos((prev) => [{ id: Date.now(), ...todo }, ...prev]);
  };

  const updateTodo = (id, todo) => {
    setTodos((prev) =>
      prev.map((prevTdo) => (prevTdo.id === id ? todo : prevTdo))
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((prevTodo) =>
        prevTodo.id === id
          ? { ...prevTodo, completed: !prevTodo.completed }
          : prevTodo
      )
    );
  };

  const closePopup = ()=>{
    setShowInfo(false);
  }

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("todos1"));
    if (todos && todos.length > 0) {
      setTodos(todos);
    }
  }, []); // Add an empty dependency array to run this effect only once on component mount
  
  useEffect(() => {
    try {
      const { name, post } = JSON.parse(localStorage.getItem("info"));
      // Check if name is not empty before setting state
      if (name !== "") {
        setName(name);
        setPost(post);
      }
    } catch (error) {
      console.log('Error parsing JSON from localStorage:', error);
    }
  }, []); // Add an empty dependency array to run this effect only once on component mount
  

  useEffect(() => {
    localStorage.setItem("todos1", JSON.stringify(todos));
    localStorage.setItem("info", JSON.stringify({name,post}));
  }, [todos, name, post]);

  const createPDF = async () => {
    setShowPDF(true);

    const doc = new jsPDF({ orientation: "portrait" });

    const styles = {
      theme: "grid",
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      startY: 40,
      margin: { top: 46, right: 10, bottom: 10, left: 10 },
      tableWidth: "auto",
      bodyStyles: { cellPadding: 4 },
    };

    doc.autoTable({
      html: "#table-pdf",
      head: [
        [
          "SL NO.",
          "Article Number",
          "Addressee Details",
          "Addressee's Signature",
        ],
      ],
      body: todos.map((item, i) => [
        i + 1,
        item.number,
        item.address.split("\n").join("\n"),
      ]),
      headStyles: { fontStyle: "bold" },
      didDrawPage: function (data) {
        const pageSize = doc.internal.pageSize;
        const pageWidth = pageSize.width;
        const pageHeight = pageSize.height;

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);

        doc.text("Department Of Post India", pageWidth / 2, 14, {
          align: "center",
          fontSize: 40,
        });
        doc.text(
          "Delivery Slip Of Rudranagar SO-743374",
          pageWidth / 2,
          20,
          { align: "center", fontSize: 40 }
        );
        doc.text(`Name Of the Postman : ${name}`, 10, 30);
        doc.text(`Post Office : ${post}`, 10, 37);
        doc.text(`Issue Date: ${formattedDate}`, pageWidth - 10, 30, {
          align: "right",
        });

        // Add the logo
        const logoWidth = 25;
        const logoHeight = 20;
        const logoX = pageWidth - logoWidth - 5; // X-coordinate for logo
        const logoY = 5; // Y-coordinate for logo (top margin)

        doc.addImage(logoUrl, "PNG", logoX, logoY, logoWidth, logoHeight);
      },
      ...styles,
    });

    doc.save("data.pdf");
  };

  return (
    <TodoProvider
      value={{ todos, addTodo, updateTodo, deleteTodo, toggleComplete}}
    >
      <div>
        {showInfo && (
          <div className="z-10 fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
          <div className="relative bg-gray-600 w-full lg:w-96 h-[26rem] lg:h-[26rem] rounded-md flex flex-col items-center pt-10">
            <h2 className="text-xl font-semibold font-mono mb-5">Add Your Information</h2>

            <label className=" font-semibold ml-[-10rem] mt-5">Postman Name : </label>
            <input
              className="m-2 px-4 py-2 w-72 rounded-md border-none outline-none bg-gray-800 text-white "
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label className=" font-semibold ml-[-9rem] mt-5">Post Office Name : </label>
            <input
              className="m-2 px-4 py-2 w-72 rounded-md border-none outline-none bg-gray-800 text-white "
              type="text"
              value={post}
              onChange={(e) => setPost(e.target.value)}
            />
            <div onClick={closePopup} className="bg-gray-900 m-2 py-3 w-72 rounded-md text-gray-300 mt-10 cursor-pointer text-center">Submit Info</div>
          </div>
        </div>
        )}
        <div
          onClick={createPDF}
          className="bg-green-500 lg:w-fit w-72 text-center absolute py-3 px-6 rounded-md cursor-pointer right-4 top-32 lg:right-14 lg:top-10"
        >
          Export
        </div>
        <div>
          <h1 className="text-center text-black font-semibold lg:text-2xl m-8 font-mono">
            Department Of Post India <br /> Delivery Slip Of Rudranagar SO-743374
          </h1>
          <div className="mt-24 lg:mt-0">
            <TodoForm />
          </div>
          <div className="flex items-center justify-center overflow-x-auto">
            <table className="mb-10 text-center border-2 border-gray-300 border-collapse bg-gray-700 ">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">SL NO.</th>
                  <th className="border border-gray-300 p-2 lg:block hidden">Article Number</th>
                  <th className="border border-gray-300 p-2">
                    Addressee Details
                  </th>
                  <th className="border border-gray-300 p-2">
                    Addressee's Signature
                  </th>
                  <th className="border border-gray-300 p-2">Edit Button</th>
                </tr>
              </thead>
              {/* Loop and Add TodoItem here */}
              {todos.map((todo, i) => (
                <TodoItem key={todo.id} todo={todo} Tid={i} />
              ))}
            </table>
          </div>
        </div>
        {showPDF && (
          <table id="table-pdf" className="w-[100vw] lg:w-[80vw] lg:ml-10">
            <caption>
              <h1
                style={{
                  textAlign: "center",
                }}
              >
                Department Of Post India <br /> Delivery Slip Of Rudranagar SO-743374
              </h1>
            </caption>
            <caption style={{ textAlign: "left", marginLeft: "10px" }}>
              Name Of the Postman : {name}
            </caption>
            <caption style={{ textAlign: "left", marginLeft: "10px" }}>
              Post Office : {post}
            </caption>
            <caption style={{ textAlign: "right", marginRight: "10px" }}>
              Issue Date: {formattedDate}
            </caption>
            <thead>
              <tr>
                <th>SL NO.</th>
                <th>Article Number</th>
                <th>Addressee Details</th>
                <th>Addressee's Signature or <br />Reason for non delivery</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((item, i) => (
                <tr key={item.id} className="pl-10">
                  <td>{i + 1}</td>
                  <td>{item.number}</td>
                  <td>
                    {item.address.split("\n").map((line, index) => (
                      <p key={index}>
                        {line} <br />
                      </p>
                    ))}
                  </td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </TodoProvider>
  );
}

export default App;
