import { jwtDecode } from 'jwt-decode'; // ✅ Correct way

import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  
  const [files, setFiles] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return; 
    } 

    const decoded = jwtDecode(token);
    if (!decoded.isAdmin) {
      alert('Access denied. Admins only.');
      navigate('/admin');
      return;
    }

    fetchData(token);
  }, 
  [navigate]);

  const fetchData = async (token) => {
    const headers = { Authorization: `Bearer ${token}` };

    const fileRes = await axios.get('http://localhost:5000/api/file/all', { headers });
    setFiles(fileRes.data);

    const userRes = await axios.get('http://localhost:5000/api/users/all', { headers });
    setUsers(userRes.data);
  };

  const deleteFile = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/file/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchData(token);
  };

  const deleteUser = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchData(token);
  };

  

  return (
    <div className="min-h-screen p-10 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-2">Uploaded Files</h3>
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">File ID</th>
              <th className="p-2">Uploaded</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {files.map((f) => (
              <tr key={f._id}>
                <td className="p-2">{f._id}</td>
                <td className="p-2">{new Date(f.createdAt).toLocaleString()}</td>
                <td className="p-2">
                  <button
                    onClick={() => deleteFile(f._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Users</h3>
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">User ID</th>
              <th className="p-2">Email</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td className="p-2">{u._id}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">
                  <button
                    onClick={() => deleteUser(u._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
