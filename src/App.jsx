import { useState } from 'react';
import './App.css';
import { useRef } from 'react';
import { useEffect } from 'react';

function App() {
  const [maxLimit, setMaxLimit] = useState('');
  const stop = useRef(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    setCanvas(0);
  }, [canvasRef]);

  const createCanvas = (data, ms) => {
    return new Promise((res) => {
      return setTimeout(() => {
        setCanvas(data);
        res(data);
      }, ms);
    });
  };

  const downloadCanvas = (data) => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL();
    const aDownloadLink = document.createElement('a');
    aDownloadLink.download = `number_${data}.png`;
    aDownloadLink.href = image;
    aDownloadLink.click();
  };

  const handleDownload = async () => {
    for (let i = 1; i <= maxLimit; i++) {
      await createCanvas(i, 500);
      downloadCanvas(i);
      if (stop.current) {
        setCanvas(0);
        stop.current = false;
        break;
      }
    }

    stop.current = false;
    setMaxLimit('');
  };

  const handleReset = () => {
    setMaxLimit('');
    stop.current = true;
    createCanvas(0)
  };

  function setCanvas(data) {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 70;
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = '#1248a1';
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = 'black';
    context.stroke();
    context.font = '70px Arial';
    context.fillStyle = '#bbc1c9';
    context.textAlign = 'center';
    context.fontWeight = 'bold';
    context.fillText(data, centerX, centerY + 20);
  }
  return (
    <div className='flex gap-7 flex-col items-center'>
      <h1 className='text-6xl font-bold pb-3 text-blue-500'>Download numbers 1 to {maxLimit === '' ? 'N' : maxLimit}</h1>
      <div className='flex gap-7 flex-col w-96'>
        <input
          pattern='[0-9]'
          placeholder='Numbers'
          type='text'
          className='p-4 rounded-md focus:outline-none focus:ring focus:border-blue-500'
          value={maxLimit}
          onChange={(e) => {
            const numericValue = e.target.value.replace(/[^0-9]/g, ""); 
            setMaxLimit(numericValue);
          }}
        />
        <canvas id='canvas' width='200' height='200' ref={canvasRef}></canvas>
        <div className='flex gap-4'>
          <button className='bg-amber-600 px-4 text-center text-gray-900 w-full h-10' onClick={handleReset}>
            Reset
          </button>

          <button className='bg-blue-500 px-4 text-center text-slate-200 w-full h-10' onClick={handleDownload}>
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
