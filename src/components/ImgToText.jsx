import { useRef, useState } from "react"
import { createWorker } from "tesseract.js";
import Tesseract from 'tesseract.js';
import { RotatingLines } from 'react-loader-spinner'

function ImgToText() {
  const [imgFile, setImgFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [Video, setVideo] = useState(false);
  const videoRef = useRef(null);
  const [text, setText] = useState("");
  const [see, setSee] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleChangeImg = (e)=>{
    setSee(false);
    setImgFile(e.target.files[0]);
  }

  const handleCapture = async () => {
    setVideo(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  };

  const handleOcr = async () => {
    try {
      setLoader(true);
      const { data } = await Tesseract.recognize(imageSrc, 'eng');
      setLoader(false);
      setText(data.text);
    } catch (error) {
      console.error('Error performing OCR:', error);
    }
  };

  const handleSnapshot = () => {
    setSee(true);
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setImageSrc(dataUrl);
    setVideo(false);
  };

  
  const convertImgtoText = async ()=>{
    setLoader(true);
    const worker = await createWorker();
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {data} = await worker.recognize(imgFile);
    setLoader(false);
    setText(data.text);
  }

  return (
    <>
      {loader && (
        <div className=" absolute left-[40%] top-[40%]">
          <RotatingLines
            visible={true}
            height="70"
            width="70"
            color="grey"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      )}

      <div className="flex mt-5 items-center bg-blue-700 py-2 rounded-md mx-2 w-[20rem]">
        <label className="ml-2" htmlFor="upload"></label>
        <input type="file" id="upload" accept="image/*" onChange={handleChangeImg}/>
        <div onClick={convertImgtoText} className="bg-green-400 px-5 py-2 mr-2 rounded-md cursor-pointer">Scan</div>
      </div>
      {imgFile && !see && (
        <div className="flex items-center justify-center">
            <img src={URL.createObjectURL(imgFile)} alt="" width={300} />
        </div>
      )}
      {text && (
        <textarea
          value={text}
          readOnly
          className="w-[96vw] h-[15rem] text-center lg:w-[30vw] lg:h-[40vh] mb-0"
        />
      )}
      <div className="text-sm flex flex-col items-center">
        {Video && (
          <video ref={videoRef} autoPlay playsInline muted />
        )}
        <div className="mt-3">
        <button className="bg-blue-500 ml-1 p-3 rounded-md" onClick={handleCapture}>Start Webcam</button>
        <button className="bg-blue-500 ml-3 p-3 rounded-md" onClick={handleSnapshot}>Capture Image</button>
        <button className="bg-green-500 ml-3 p-3 rounded-md" onClick={handleOcr}>OCR</button>
        {imageSrc && see && <img src={imageSrc} alt="Captured" className="mt-5"/>}
        </div>
      </div>
    </>
  )
}

export default ImgToText
