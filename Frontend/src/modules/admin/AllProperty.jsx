import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { formatRupiah } from "../user/propertyDisplay";

axios.defaults.withCredentials = true;

const AdminAllProperty = () => {
  const [allProperties, setAllProperties] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const getAllProperty = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/getallproperties`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setAllProperties(response.data.data);
      } else {
        message.error(response.data.message || "Unauthorized access");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        message.error("Session expired, please login again");
        navigate("/login");
      } else {
        message.error("Failed to fetch Property");
      }
    }
  };

  useEffect(() => {
    getAllProperty();
  }, []);

  const openEdit = (property) => {
    setEditingProperty({ ...property });
  };

  const closeEdit = () => {
    setEditingProperty(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditingProperty((property) => ({ ...property, [name]: value }));
  };

  const saveProperty = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    const updates = {
      ...[
        "propertyType",
        "propertyAdType",
        "propertyAddress",
        "ownerContact",
        "propertyAmt",
        "additionalInfo",
        "isAvailable",
      ].reduce((fields, field) => {
        if (editingProperty[field] !== undefined) {
          fields[field] = editingProperty[field] ?? "";
        }
        return fields;
      }, {}),
    };

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/updateproperty/${editingProperty._id}`,
        updates,
        { withCredentials: true }
      );
      if (response.data.success) {
        message.success(response.data.message);
        closeEdit();
        getAllProperty();
      } else {
        message.error(response.data.message || "Failed to update property");
      }
    } catch (error) {
      console.error("Error updating property:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        message.error("Admin access is required to update properties");
      } else {
        message.error(
          error.response?.data?.message ||
            `${error.message} Failed to update property.`
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border border-gray-700 bg-gray-900/80 backdrop-blur-md shadow-2xl rounded-xl overflow-hidden">
        <thead className="bg-indigo-600/80 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Property ID</th>
            <th className="py-3 px-4 text-center">Owner ID</th>
            <th className="py-3 px-4 text-center">Property Type</th>
            <th className="py-3 px-4 text-center">Property Ad Type</th>
            <th className="py-3 px-4 text-center">Property Address</th>
            <th className="py-3 px-4 text-center">Owner Contact</th>
            <th className="py-3 px-4 text-center">Property Amt</th>
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {allProperties.length > 0 ? (
            allProperties.map((property, index) => (
              <tr
                key={property._id}
                className={`transition duration-200 ${index % 2 === 0 ? "bg-gray-800/60" : "bg-gray-900/60"
                  } hover:bg-indigo-500/20`}
              >
                <td className="py-2 px-4 border-b border-gray-700 text-gray-200">
                  {property._id}
                </td>
                <td className="py-2 px-4 border-b border-gray-700 text-center text-gray-300">
                  {property.ownerId}
                </td>
                <td className="py-2 px-4 border-b border-gray-700 text-center text-indigo-400 font-medium">
                  {property.propertyType}
                </td>
                <td className="py-2 px-4 border-b border-gray-700 text-center text-gray-300">
                  {property.propertyAdType || "N/A"}
                </td>
                <td className="py-2 px-4 border-b border-gray-700 text-center text-gray-300">
                  {property.propertyAddress}
                </td>
                <td className="py-2 px-4 border-b border-gray-700 text-center text-gray-300">
                  {property.ownerContact}
                </td>
                <td className="py-2 px-4 border-b border-gray-700 text-center font-semibold text-green-400">
                  {formatRupiah(property.propertyAmt)}
                </td>
                <td className="py-2 px-4 border-b border-gray-700 text-center">
                  <button
                    type="button"
                    onClick={() => openEdit(property)}
                    className="rounded-lg border border-indigo-500 px-3 py-1 text-indigo-300 hover:bg-indigo-500/20"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="8"
                className="text-center py-6 text-gray-400 font-medium italic"
              >
                No properties found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {editingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <form
            onSubmit={saveProperty}
            className="max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-xl border border-gray-700 bg-gray-900 p-6 text-white shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-indigo-400">Edit Property</h3>
              <button type="button" onClick={closeEdit} aria-label="Close editor" className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>
            {[
              ["propertyType", "Property Type"],
              ["propertyAdType", "Ad Type"],
              ["propertyAddress", "Address"],
              ["ownerContact", "Owner Contact"],
            ].map(([name, label]) => (
              <label key={name} className="block text-sm font-medium text-gray-300">
                {label}
                <input
                  type="text"
                  name={name}
                  value={editingProperty[name] ?? ""}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
                />
              </label>
            ))}
            <label className="block text-sm font-medium text-gray-300">
              Price (IDR / Rp)
              <input
                type="number"
                name="propertyAmt"
                min="0"
                step="1"
                inputMode="numeric"
                value={editingProperty.propertyAmt ?? ""}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
              />
              <span className="mt-1 block text-xs text-gray-400">
                Preview: {formatRupiah(editingProperty.propertyAmt)}
              </span>
            </label>
            <label className="block text-sm font-medium text-gray-300">
              Additional Details
              <textarea
                name="additionalInfo"
                value={editingProperty.additionalInfo ?? ""}
                onChange={handleChange}
                rows={3}
                className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
              />
            </label>
            <label className="block text-sm font-medium text-gray-300">
              Availability
              <select
                name="isAvailable"
                value={editingProperty.isAvailable || "Available"}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </label>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={closeEdit} disabled={isSaving} className="rounded-lg border border-gray-600 px-4 py-2 hover:bg-gray-800 disabled:opacity-60">
                Cancel
              </button>
              <button type="submit" disabled={isSaving} className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60">
                {isSaving ? "Saving and uploading..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminAllProperty;
