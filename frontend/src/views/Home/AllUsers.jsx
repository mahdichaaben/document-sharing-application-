import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@context/AuthContext';  // Import the useAuth hook to get the token

const AllUsers = () => {
  const API_BASE_URL = "http://localhost:8081";
  const { authUser } = useAuth();  // Get the authenticated user (and token) from context
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5); // Number of users per page
  const [totalUsers, setTotalUsers] = useState(0); // Total users count

  // Fetch users on initial load
  useEffect(() => {
    if (authUser?.token) {
      fetchUsers(authUser.token);
    }
  }, [authUser]); // Re-fetch users when the token changes

  const fetchUsers = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);

      if (Array.isArray(response.data)) {
        setUsers(response.data);
        setTotalUsers(response.data.length); // Set total users for pagination
      } else {
        console.error('Fetched data is not an array', response.data);
        setUsers([]);
      }
    } catch (error) {
      console.error('There was an error fetching the users:', error);
      setUsers([]);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${authUser?.token}`,  // Pass the token here too
        },
      });
      fetchUsers(authUser?.token); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
  };

  const handleUpdate = async () => {
    if (!editUser) return;
    try {
      await axios.put(`${API_BASE_URL}/api/users/${editUser.id}`, editUser, {
        headers: {
          Authorization: `Bearer ${authUser?.token}`,  // Pass the token here too
        },
      });
      setEditUser(null);
      fetchUsers(authUser?.token); // Refresh after update
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Get the users to display on the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  return (
    <div className="p-6 bg-background">
      <div className="mb-4 flex items-center justify-between">
        <button
          className="px-4 py-2 bg-primary text-white rounded"
          onClick={() => setEditUser({})} // Set empty user for creating new user
        >
          Add New User
        </button>
      </div>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-secondary">
            <tr>
              <th className="py-2 px-4 border border-border">Name</th>
              <th className="py-2 px-4 border border-border">Email</th>
              <th className="py-2 px-4 border border-border">Profile</th>
              <th className="py-2 px-4 border border-border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border border-border">{user.name}</td>
                <td className="py-2 px-4 border border-border">{user.email}</td>
                <td className="py-2 px-4 border border-border">{user.profile}</td>
                <td className="py-2 px-4 border border-border">
                  <button
                    onClick={() => handleEdit(user)}
                    className="px-2 py-1 bg-accent text-white rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editUser && (
        <div className="mt-6 p-4 bg-white border border-border rounded shadow-md">
          <h2 className="text-lg font-semibold">Edit User</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="my-2">
              <label className="block">Name</label>
              <input
                type="text"
                className="w-full p-2 border border-border rounded"
                value={editUser.name || ''}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
              />
            </div>
            <div className="my-2">
              <label className="block">Email</label>
              <input
                type="email"
                className="w-full p-2 border border-border rounded"
                value={editUser.email || ''}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
              />
            </div>
            <div className="my-2">
              <label className="block">Profile</label>
              <input
                type="text"
                className="w-full p-2 border border-border rounded"
                value={editUser.profile || ''}
                onChange={(e) => setEditUser({ ...editUser, profile: e.target.value })}
              />
            </div>
            <button
              onClick={handleUpdate}
              className="mt-4 px-4 py-2 bg-primary text-white rounded"
            >
              Update User
            </button>
          </form>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => paginate(currentPage - 1)}
          className="px-4 py-2 bg-primary text-white rounded mr-2"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 text-lg">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          className="px-4 py-2 bg-primary text-white rounded ml-2"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllUsers;
