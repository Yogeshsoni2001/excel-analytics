import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage('Please select a file');

    const formData = new FormData();
    formData.append('excel', file);
 
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); // Token stored after login

      const res = await axios.post(
        'http://localhost:5000/api/file/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message || 'Upload successful!');
    } catch (err) {
      console.error(err);
      setMessage('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  return (
   
<Layout>
  <div className="min-h-screen bg-white text-center">
    {/* Page Header */}
    <div className="bg-cyan-200 py-4">
      <h1 className="text-2xl font-semibold">Your Projects</h1>
    </div>

    {/* Upload Form */}
    <form onSubmit={handleUpload} className="mt-10 flex flex-col items-center w-full">
      <div className="bg-cyan-50 p-6 w-full max-w-md rounded shadow">
        <p className="text-lg font-medium mb-4">Upload Your Projects</p>

        {/* Drag & Drop Upload Block */}
        <label htmlFor="fileInput" className="cursor-pointer flex justify-center mb-4 w-full">
          <div className="w-full rounded-lg overflow-hidden">
            <div className="flex">
              <div className="w-full">
                <div className="relative h-48 rounded-lg border-2 border-blue-400 bg-white flex justify-center items-center shadow-md hover:shadow-xl transition-shadow duration-500 ease-in-out">
                  {/* Centered Icon and Text */}
                  <div className="absolute flex flex-col items-center pointer-events-none">
              <img
                src="https://img.icons8.com/?size=100&id=42965&format=png&color=000000"
                alt="Upload Excel"
                className="mb-3 w-16 h-16 object-contain"
              />
              <span className="block text-gray-500 font-semibold">Drag & drop your files here</span>
              <span className="block text-xs text-gray-400 font-normal mt-1">and click to upload</span>
            </div>

                  {/* Transparent Full-Area File Input */}
                  <input
                    type="file"
                    id="fileInput"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="h-full w-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </label>

        {/* Upload Button */}
        <button
  type="submit"
  disabled={loading}
  className="overflow-hidden relative w-full h-12 bg-blue-400 text-white border-none rounded-md text-sm font-bold cursor-pointer group transition disabled:opacity-50 mt-6"
>
  {loading ? 'Uploading...' : 'Upload File'}

  {/* Background animation layers */}
  <span className="overflow-hidden absolute w-full h-32 -top-8 -left-2 bg-white rotate-20 transform scale-x-0 group-hover:scale-x-110 transition-transform group-hover:duration-500 duration-1000 origin-left z-0"></span>
  <span className="absolute w-full h-32 -top-8 -left-2 bg-blue-400 rotate-20 transform scale-x-0 group-hover:scale-x-110 transition-transform group-hover:duration-700 duration-700 origin-left z-0"></span>
  <span className="absolute w-full h-32 -top-8 -left-2 bg-blue-600 rotate-20 transform scale-x-0 group-hover:scale-x-110 transition-transform group-hover:duration-1000 duration-500 origin-left z-0"></span>

  {/* Animated overlay text */}
  <span className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
    {loading ? 'Please Wait' : 'Upload File'}
  </span>
</button>


        {/* Upload Message */}
        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
      </div>
    </form>
  </div>
</Layout>
  );
};

export default UploadPage;
