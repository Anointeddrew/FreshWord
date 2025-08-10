import React, { useState } from "react";
import { db } from "../firebaseconfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import Navbar from "../components/Navbar";

function FirstTimerForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    occupation: "",
    maritalStatus: "",
    invitedBy: "",
    comments: "",
    prayerRequest: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "firstTimers"), {
        ...formData,
        createdAt: Timestamp.now(),
      });
      setSuccessMsg("Thank you! Your details have been submitted.");
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        occupation: "",
        maritalStatus: "",
        invitedBy: "",
        comments: "",
        prayerRequest: "",
      });
    } catch (err) {
      console.error("Error submitting form:", err);
    }
    setLoading(false);
  };

  return (
    <div>
      <Navbar />
    <div className="max-w-lg mx-auto text-center mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">First Timer Form</h2>
      {successMsg && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {successMsg}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email (optional)"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="occupation"
          placeholder="Occupation (optional)"
          value={formData.occupation}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="maritalStatus"
          placeholder="Marital Status (optional)"
          value={formData.maritalStatus}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="invitedBy"
          placeholder="Invited By (optional)"
          value={formData.invitedBy}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <textarea
          name="comments"
          placeholder="Comments (optional)"
          value={formData.comments}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        ></textarea>
        <textarea
          name="prayerRequest"
          placeholder="Prayer Request (optional)"
          value={formData.prayerRequest}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
    </div>
  );
}

export default FirstTimerForm;
