"use client";
import { useEffect, useState } from "react";

//import { PlusIcon } from "@heroicons/react/24/solid";

import { PlusIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";



interface Department {
  departmentid?: number;
  departmentcode: string;
  departmentname: string;
  phonenumber: string;
  location: string;
  description?: string;
  status: string;
}

export default function Home() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Department>({
    departmentcode: "",
    departmentname: "",
    phonenumber: "",
    location: "",
    description: "",
    status: "ACTIVE",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fetch departments
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4002/api/departments");
      const data = await res.json();
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // ✅ Handle input with validation
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "phonenumber") {
      // Allow only digits
      const onlyDigits = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: onlyDigits });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ Clear form
  const handleClear = () => {
    setFormData({
      departmentcode: "",
      departmentname: "",
      phonenumber: "",
      location: "",
      description: "",
      status: "ACTIVE",
    });
    setEditingId(null);
  };

  // ✅ Submit with phone validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(formData.phonenumber)) {
      alert("❌ Enter a valid 10-digit phone number (digits only).");
      return;
    }

    const url = editingId
      ? `http://localhost:4002/api/departments/${editingId}`
      : "http://localhost:4002/api/departments";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert(editingId ? "✅ Department updated!" : "✅ Department added!");
        handleClear();
        fetchDepartments();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Edit
  const handleEdit = (dept: Department) => {
    setFormData(dept);
    setEditingId(dept.departmentid || null);
  };

  // Delete
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this department?")) {
      try {
        const res = await fetch(`http://localhost:4002/api/departments/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          alert("✅ Department deleted!");
          fetchDepartments();
        }
      } catch (error) {
        console.error("Error deleting department:", error);
      }
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-lg">Loading departments...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      
      
<div className="flex justify-between items-center max-w-4xl mx-auto mb-6">
  <h1 className="text-3xl font-bold text-gray-800">
    Create New Department
  </h1>

  <button
  onClick={handleClear} // Clears form for adding new department
  className="flex items-center bg-amber-600 text-white px-4 py-2 rounded-2xl hover:bg-amber-800"
>
  <PlusIcon className="w-5 h-5 mr-2" />
  Add Department
</button>

</div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {editingId ? "Edit Department" : "Create New Department"}
          
          </h2> 
          
        </div>

        <p className="text-gray-600 text-base mb-4">
    Enter The Information For The New Department Below
  </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            name="departmentcode"
            value={formData.departmentcode}
            onChange={handleChange}
            placeholder="Department Code"
            className="border p-2 rounded"
            required
          />
          <input
            name="departmentname"
            value={formData.departmentname}
            onChange={handleChange}
            placeholder="Department Name"
            className="border p-2 rounded"
            required
          />
          <input
            name="phonenumber"
            value={formData.phonenumber}
            onChange={handleChange}
            placeholder="Phone Number (10 digits)"
            className="border p-2 rounded"
            required
            maxLength={10}
          />
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="border p-2 rounded"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-2 rounded col-span-2"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>

          {/* Buttons Row */}
          <div className="col-span-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
            >
              Clear
            </button>
            <button
              type="submit"
              className="flex items-center bg-amber-600 text-white px-4 py-2 rounded-2xl hover:bg-amber-800"
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              {editingId ? "Update Department" : "Save Department"}
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Existing Departments</h2>
          <button
            onClick={fetchDepartments}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>

<p className="text-gray-600 text-base mb-4">
    List Of All Departments In The System
  </p>


        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3">ID</th>
              <th className="border p-3">Code</th>
              <th className="border p-3">Name</th>
              <th className="border p-3">Phone</th>
              <th className="border p-3">Location</th>
              <th className="border p-3">Status</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.departmentid}>
                <td className="border p-3 text-center">{dept.departmentid}</td>
                <td className="border p-3">{dept.departmentcode}</td>
                <td className="border p-3">{dept.departmentname}</td>
                <td className="border p-3">{dept.phonenumber}</td>
                <td className="border p-3">{dept.location}</td>
                <td className="border p-3 text-center">{dept.status}</td>
                <td className="border p-3 text-center">
                  <button
                    onClick={() => handleEdit(dept)}
                    className="px-2 py-1 bg-yellow-400 rounded mr-2 hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(dept.departmentid!)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
}
