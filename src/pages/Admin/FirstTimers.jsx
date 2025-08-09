import React, { useEffect, useState } from "react";
import { db } from "../../firebaseconfig";
import { collection, getDocs, orderBy, query, deleteDoc, doc } from "firebase/firestore";
import * as XLSX from "xlsx";

function AdminFirstTimers() {
  const [firstTimers, setFirstTimers] = useState([]);
  const [filteredTimers, setFilteredTimers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Fetch First Timers from Firestore
  const fetchFirstTimers = async () => {
    const q = query(collection(db, "firstTimers"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setFirstTimers(data);
    setFilteredTimers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFirstTimers();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await deleteDoc(doc(db, "firstTimers", id));
      fetchFirstTimers();
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const dataToExport = filteredTimers.map(timer => ({
      FullName: timer.fullName,
      Phone: timer.phone,
      Email: timer.email || "",
      Address: timer.address || "",
      Occupation: timer.occupation || "",
      MaritalStatus: timer.maritalStatus || "",
      InvitedBy: timer.invitedBy || "",
      Comments: timer.comments || "",
      PrayerRequest: timer.prayerRequest || "",
      Date: timer.createdAt?.toDate().toLocaleDateString() || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FirstTimers");

    XLSX.writeFile(workbook, "FirstTimers.xlsx");
  };

  // Apply search & date filter
  useEffect(() => {
    let filtered = firstTimers;

    if (searchTerm) {
      filtered = filtered.filter(timer =>
        timer.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterDate) {
      filtered = filtered.filter(timer => {
        const recordDate = timer.createdAt?.toDate().toISOString().split("T")[0];
        return recordDate === filterDate;
      });
    }

    setFilteredTimers(filtered);
  }, [searchTerm, filterDate, firstTimers]);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6">
      {/* Top bar with filters */}
      <div className="flex flex-col flex-row md:justify-between md:items-center gap-4 mb-4">
        <h2 className="text-2xl text-center font-bold">First Timers</h2>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterDate("");
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear Filters
          </button>
          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Export to Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Full Name</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">Occupation</th>
            <th className="border p-2">Marital Status</th>
            <th className="border p-2">Invited By</th>
            <th className="border p-2">Comments</th>
            <th className="border p-2">Prayer Request</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredTimers.map((timer) => (
            <tr key={timer.id}>
              <td className="border p-2">{timer.fullName}</td>
              <td className="border p-2">{timer.phone}</td>
              <td className="border p-2">{timer.email}</td>
              <td className="border p-2">{timer.address}</td>
              <td className="border p-2">{timer.occupation}</td>
              <td className="border p-2">{timer.maritalStatus}</td>
              <td className="border p-2">{timer.invitedBy}</td>
              <td className="border p-2">{timer.comments}</td>
              <td className="border p-2">{timer.prayerRequest}</td>
              <td className="border p-2">
                {timer.createdAt?.toDate().toLocaleDateString()}
              </td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => handleDelete(timer.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {filteredTimers.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center p-4">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminFirstTimers;
