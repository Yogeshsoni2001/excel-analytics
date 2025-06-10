import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import Layout from '../components/Layout';
import { Bar, Pie, Line, Scatter } from 'react-chartjs-2';
import Plot from 'react-plotly.js'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const [file, setFile] = useState(null);
  const [allFiles, setAllFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState('');
  const [rawData, setRawData] = useState([]);
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [chartType, setChartType] = useState('Bar');
  const [message, setMessage] = useState('');
  const [showChartSection, setShowChartSection] = useState
    (false);
  const [loading,] = useState(false);

  const chartRef = useRef(null);

  const token = localStorage.getItem('token');
  const userName = localStorage.getItem("userName") || "User";

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/file/all', {
          headers: { Authorization: `Bearer ${token}` },
        }); 
        setAllFiles(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFiles();
  }, [token]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage('Please select a file');

    const formData = new FormData();
    formData.append('excel', file);

    try {
      await axios.post('http://localhost:5000/api/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('Upload successful!');
      setFile(null);
      setShowChartSection(true);

      const updatedFiles = await axios.get('http://localhost:5000/api/file/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllFiles(updatedFiles.data);
    } catch (err) {
      console.error(err);
      setMessage('Upload failed');
    }
  };

  const handleFileSelect = (fileId) => {
    setSelectedFileId(fileId);
    const file = allFiles.find((f) => f._id === fileId);
    if (file) {
      setRawData(file.data);
      setXAxis('');
      setYAxis('');
    }
  };

  const getKeys = () => (rawData.length > 0 ? Object.keys(rawData[0]) : []);

  const chartData = {
    labels: rawData.map((row) => row[xAxis]),
    datasets: [
      {
        label: `${yAxis} vs ${xAxis}`,
        data:
          chartType === 'Scatter'
            ? rawData.map((row) => ({ x: row[xAxis], y: row[yAxis] }))
            : rawData.map((row) => row[yAxis]),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        borderRadius: 4,
        tension: 0.3,
        showLine: chartType === 'Line',
        fill: false,
        pointRadius: chartType === 'Scatter' ? 5 : 3,
      },
    ],
  };

  const renderChart = () => {
    const chartProps = { data: chartData, ref: chartRef, options: { responsive: true } };

    if (chartType === '3DColumn') {
      // 3D Column using Plotly
      return (
        <Plot
          data={[
            {
              type: 'mesh3d',
              x: rawData.map((row) => row[xAxis]),
              y: rawData.map((row) => row[yAxis]),
              z: rawData.map((_, i) => i),
              opacity: 0.7,
              color: 'blue',
            },
          ]}
          layout={{
            title: '3D Column Chart',
            scene: {
              xaxis: { title: xAxis },
              yaxis: { title: yAxis },
              zaxis: { title: 'Index' },
            },
            autosize: true,
          }}
          style={{ width: '100%', height: '500px' }}
        />
      );
    }

    switch (chartType) {
      case 'Bar':
        return <Bar {...chartProps} />;
      case 'Pie':
        return <Pie {...chartProps} />;
      case 'Line':
        return <Line {...chartProps} />;
      case 'Scatter':
        return <Scatter {...chartProps} />;
      default:
        return null;
    }
  };

  const downloadImage = () => {
    if (chartType === '3DColumn') {
      alert('Image download is not supported for 3D charts.');
      return;
    }

    const chart = chartRef.current;
    if (!chart) return;

    const link = document.createElement('a');
    link.download = `${chartType}_chart.png`;
    link.href = chart.toBase64Image();
    link.click();
  };

  const downloadCSV = () => {
    const keys = getKeys();
    const csvContent = [keys.join(',')].concat(
      rawData.map((row) => keys.map((k) => row[k]).join(','))
    ).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'data.csv');
    link.click();
  };

  const downloadPDF = async () => {
    if (chartType === '3DColumn') {
      alert('PDF download is not supported for 3D charts.');
      return;
    }

    const chartCanvas = chartRef.current?.canvas;
    if (chartCanvas) {
      const canvasImage = await html2canvas(chartCanvas);
      const imgData = canvasImage.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.text('Chart Report', 10, 10);
      pdf.addImage(imgData, 'PNG', 10, 20, 180, 100);
      pdf.save('chart-report.pdf');
    }
  };

  return (
    <Layout>

      <div className="p-4 sm:p-8 bg-gradient-to-r from-white via-blue-50 to-blue-200 min-h-screen  ">

        
        <h1 className="text-2xl text-center sm:text-3xl font-bold mb-6 text-gray-700">Hello {userName}, Welcome Back!</h1>

        {/* Upload Section */}
        <form onSubmit={handleUpload} className="bg-white p-6 rounded shadow max-w-xl w-full mx-auto">
          <label htmlFor="fileInput" className="cursor-pointer flex justify-center mb-4 w-full">
            <div className="max-w-md w-full mx-auto rounded-lg overflow-hidden">
              <div className="flex">
                <div className="w-full p-3">
                  <div className="relative h-48 rounded-lg border-2 border-blue-500 bg-gray-50 flex justify-center items-center shadow-lg hover:shadow-xxl transition-shadow duration-500 ease-in-out">
                    {/* Centered Image and Text */}
                    <div className="absolute flex flex-col items-center pointer-events-none">
                      <img
                        src="https://img.icons8.com/?size=100&id=42965&format=png&color=000000"
                        alt="Upload Excel"
                        className="mb-3 w-16 h-16 object-contain"
                      />
                      <span className="block text-gray-500 font-semibold">Drag & drop your files here</span>
                      <span className="block text-xs text-gray-400 font-normal mt-1">and click to upload</span>
                    </div>

                    {/* Hidden Input Layer */}
                    <input
                      type="file"
                      id="fileInput"
                      accept=".xlsx,.xls"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="h-full w-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="overflow-hidden relative w-full h-12 bg-blue-500 text-white border-none rounded-md text-sm font-bold cursor-pointer group transition disabled:opacity-50 mt-6"
          >
            {loading ? 'Uploading...' : 'Upload File'}

            {/* Background animation layers */}
            <span className="overflow-hidden absolute w-full h-32 -top-8 -left-2 bg-white rotate-20 transform scale-x-0 group-hover:scale-x-110 transition-transform group-hover:duration-500 duration-1000 origin-left z-0"></span>
            <span className="absolute w-full h-32 -top-8 -left-2 bg-blue-700 rotate-20 transform scale-x-0 group-hover:scale-x-110 transition-transform group-hover:duration-700 duration-700 origin-left z-0"></span>
            <span className="absolute w-full h-32 -top-8 -left-2 bg-blue-800 rotate-20 transform scale-x-0 group-hover:scale-x-110 transition-transform group-hover:duration-1000 duration-500 origin-left z-0"></span>

            {/* Animated overlay text */}
            <span className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              {loading ? 'Please Wait' : 'Upload File'}
            </span>
          </button>


          {message && <p className="mt-3 text-center text-gray-600">{message}</p>}
        </form>


        {/* Visualization Section */}
        {showChartSection && (
          <div className="mt-10  max-w-xl w-full mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Create Visualization</h2>

            <div className="mb-4">
              <label className="block mb-1 font-medium text-sm text-gray-600">Select File:</label>
              <select
                className="block w-full p-3 text-xs border rounded"
                value={selectedFileId}
                onChange={(e) => handleFileSelect(e.target.value)}
              >
                <option value="">-- Select Uploaded File --</option>
                {allFiles.map((file) => (
                  <option key={file._id} value={file._id}>
                    {file.originalFileName} - {new Date(file.createdAt).toLocaleString()}
                  </option>

                ))}
              </select>
            </div>

             {rawData.length > 0 && (
              <>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm text-gray-600">X-Axis:</label>
                  <select
                    className="block w-full p-3 text-xs border rounded"
                    value={xAxis}
                    onChange={(e) => setXAxis(e.target.value)}
                  >
                    <option value="">-- Select X Axis --</option>
                    {getKeys().map((key) => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm text-gray-600">Y-Axis:</label>
                  <select
                    className="block w-full p-3 text-xs border rounded"
                    value={yAxis}
                    onChange={(e) => setYAxis(e.target.value)}
                  >
                    <option value="">-- Select Y Axis --</option>
                    {getKeys().map((key) => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm text-gray-600">Chart Type:</label>
                  <select
                    className="block w-full p-3 text-xs border rounded"
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                  >
                    <option value="Bar">Bar</option>
                    <option value="Line">Line</option>
                    <option value="Pie">Pie</option>
                    <option value="Scatter">Scatter</option>
                    <option value="3DColumn">3D Column</option>
                  </select>
                </div>

                {(xAxis && yAxis) && (
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-semibold mb-4">Chart Preview</h3>
                    {renderChart()}

                    <div className="flex gap-4 mt-6">
                      <button
                  onClick={downloadImage}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out w-full sm:w-auto justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    fill="none"
                    className="w-5 h-5 mr-2 -ml-1"
                  >
                    <path
                      d="M12 4v12m8-8l-8 8-8-8"
                      strokeWidth="2"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  </svg>
                  Chart Image
                </button>

                <button
                  onClick={downloadPDF}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out w-full sm:w-auto justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    fill="none"
                    className="w-5 h-5 mr-2 -ml-1"
                  >
                    <path
                      d="M12 4v12m8-8l-8 8-8-8"
                      strokeWidth="2"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  </svg>
                  PDF Report
                </button>
                     


                     <button
                  onClick={downloadCSV}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out w-full sm:w-auto justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    fill="none"
                    className="w-5 h-5 mr-2 -ml-1"
                  >
                    <path
                      d="M12 4v12m8-8l-8 8-8-8"
                      strokeWidth="2"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  </svg>
                  CSV Data
                </button>
                    </div>
                  </div>
                )}
              </>
            )}

          </div>

        )}


      </div>

    </Layout>
  );
};

export default DashboardPage;
