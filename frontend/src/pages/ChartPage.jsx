import React, { useEffect, useRef, useState } from 'react';
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
import { Bar, Pie, Line, Scatter } from 'react-chartjs-2';
import Plot from 'react-plotly.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import Layout from '../components/Layout';
 
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

const ChartPage = () => {
  const [allFiles, setAllFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState('');
  const [rawData, setRawData] = useState([]);
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [chartType, setChartType] = useState('Bar');
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/file/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAllFiles(res.data);
        if (res.data.length > 0) {
          setSelectedFileId(res.data[0]._id);
          setRawData(res.data[0].data);
        }
      } catch (err) {
        console.error('Error fetching files:', err);
      }
    };
    fetchFiles();
  }, []);

  const handleFileChange = (fileId) => {
    setSelectedFileId(fileId);
    const file = allFiles.find((f) => f._id === fileId);
    if (file) {
      setRawData(file.data);
      setXAxis('');
      setYAxis('');
    }
  };

  const getUniqueKeys = () => {
    if (rawData.length === 0) return [];
    return Object.keys(rawData[0]);
  };

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

  // Disable buttons for 3D Column charts
  const handleDownloadImage = () => {
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

  const handleDownloadPDF = async () => {
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

  const handleDownloadCSV = () => {
    if (!xAxis || !yAxis || rawData.length === 0) return;

    const csvRows = [`${xAxis},${yAxis}`];

    rawData.forEach((row) => {
      csvRows.push(`${row[xAxis]},${row[yAxis]}`);
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${chartType}_data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="min-h-screen  bg-gradient-to-r from-white via-blue-50 to-blue-200 py-6 px-4 ">
        <div className="mt-10 bg-white/50 backdrop-blur-md p-6 rounded-xl shadow-md  max-w-xl w-full mx-auto ">
          <h2 className="text-2xl font-semibold mb-6 ">Dynamic Chart Viewer</h2>

          {/* File Selector */}
          <div className="mb-4">
            <label className="block mb-1 font-light ">Select File:</label>
            <select
              className="p-2 border rounded text-xs text-gray-500 w-full"
              value={selectedFileId}
              onChange={(e) => handleFileChange(e.target.value)}
            >
              {allFiles.map((file) => (
                <option key={file._id} value={file._id}>
                  {file.originalFileName || 'Unnamed File'} -{' '}
                  {new Date(file.createdAt).toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* Axis and Chart Type Selectors */}
          <div className="mb-6 flex flex-wrap gap-4">
            <select
              className="p-2 border rounded text-xs"
              onChange={(e) => setXAxis(e.target.value)}
              value={xAxis}
            >
              <option value="">Select X-Axis</option>
              {getUniqueKeys().map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>

            <select
              className="p-2 border rounded text-xs"
              onChange={(e) => setYAxis(e.target.value)}
              value={yAxis}
            >
              <option value="">Select Y-Axis</option>
              {getUniqueKeys().map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>

            <select
              className="p-2 border rounded text-xs"
              onChange={(e) => setChartType(e.target.value)}
              value={chartType}
            >
              <option value="Bar">Bar Chart</option>
              <option value="Pie">Pie Chart</option>
              <option value="Line">Line Chart</option>
              <option value="Scatter">Scatter Chart</option>
              <option value="3DColumn">3D Column Chart</option>
            </select>
          </div>

          {/* Chart Area */}
          {xAxis && yAxis ? (
            <div className="bg-white p-6 rounded shadow">
              {renderChart()}

              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownloadImage}
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
                  onClick={handleDownloadCSV}
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
                <button
                  onClick={handleDownloadPDF}
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
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-xs">
              Please select both X and Y axes to display the chart.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ChartPage;
