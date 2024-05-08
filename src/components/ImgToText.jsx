import { useEffect, useState } from "react"
import { createWorker } from "tesseract.js";

function ImgToText() {
  const [imgFile, setImgFile] = useState(null);
  const [text, setText] = useState("");

  const handleChangeImg = (e)=>{
    setImgFile(e.target.files[0]);
  }

  
  const convertImgtoText = async ()=>{
    const worker = await createWorker();
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {data} = await worker.recognize(imgFile);
    console.log(data.text);
    setText(data.text);
  }

  useEffect(()=>{
    convertImgtoText();
  },[imgFile])

  return (
    <>
      <div className=" my-5 bg-blue-700 py-2 rounded-md mx-2">
        <label className="ml-2" htmlFor="upload"></label>
        <input type="file" id="upload" accept="image/*" onChange={handleChangeImg}/>
      </div>
      {imgFile && (
        <div className="flex items-center justify-center">
            <img src={URL.createObjectURL(imgFile)} alt="" width={300} />
        </div>
      )}
      {text && (
        <textarea
          value={text}
          readOnly
          className="w-[96vw] h-[96vh] text-center lg:w-[30vw] lg:h-[40vh] mb-10"
        />
      )}
    </>
  )
}

export default ImgToText
