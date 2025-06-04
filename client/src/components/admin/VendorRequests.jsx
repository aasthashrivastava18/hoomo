import React, { useState, useEffect } from 'react';
// import { vendorService } from '../../services/vendorService';
import Loader from '../common/Loader';

const VendorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vendorService.getVendorRequests()
      .then(data => {
        setRequests(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleApprove = (id) => {
    vendorService.approveVendor(id)
      .then(() => {
        setRequests(prev => prev.filter(req => req._id !== id));
      })
      .catch(err => console.error(err));
  };

  const handleReject = (id) => {
    vendorService.rejectVendor(id)
      .then(() => {
        setRequests(prev => prev.filter(req => req._id !== id));
      })
      .catch(err => console.error(err));
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-white p-5 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Vendor Requests</h2>
      {requests.length === 0 ? (
        <p>No pending vendor requests.</p>
      ) : (
        <table className="w-full text-left border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-3 py-2">Vendor Name</th>
              <th className="border border-gray-300 px-3 py-2">Email</th>
              <th className="border border-gray-300 px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req._id}>
                <td className="border border-gray-300 px-3 py-2">{req.name}</td>
                <td className="border border-gray-300 px-3 py-2">{req.email}</td>
                <td className="border border-gray-300 px-3 py-2 space-x-2">
                  <button
                    onClick={() => handleApprove(req._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(req._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VendorRequests;
