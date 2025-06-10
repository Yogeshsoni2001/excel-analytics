import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { FaTrashAlt, FaRedoAlt } from 'react-icons/fa';

const History = () => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/file/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data); 
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/file/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('File deleted successfully.');
      fetchFiles();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleUseAgain = (fileData) => {
    localStorage.setItem('selectedFile', JSON.stringify(fileData));
    window.location.href = '/dashboard'; // or use navigate('/dashboard') if using React Router
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-r from-white via-blue-50 to-blue-200 py-6 px-4 ">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Upload History</h2>

          {message && (
            <p className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4">{message}</p>
          )}

          {files.length === 0 ? (
            <p className="text-gray-600">No uploads yet.</p>
          ) : (
            <div className="bg-white/30 backdrop-blur-md shadow rounded-xl overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="shadow-md uppercase">
                  <tr>
                    <th className="px-6 py-3">File Name</th>
                    <th className="px-6 py-3">Upload Time</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {files.map((file) => (
                    <tr key={file._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {file.originalFileName || 'Uploaded File'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(file.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 flex gap-3">
                        <button
                          onClick={() => handleUseAgain(file)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                        >
                          <FaRedoAlt />
                          Use Again
                        </button>
                        <button
                          onClick={() => handleDelete(file._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                        >
                          <FaTrashAlt />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default History;
