"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [policyLimit, setPolicyLimit] = useState("");

  const fetchAll = async () => {
    try {
      const [u, c, m] = await Promise.all([
        api.get("/users"),
        api.get("/corporate-accounts"),
        api.get("/user-corporate"),
      ]);

      setUsers(u.data);
      setCompanies(c.data);
      setMappings(m.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const getUserMapping = (userId) =>
    mappings.find((m) => m.user_id === userId);

  const getCompanyName = (companyId) =>
    companies.find((c) => c.id === companyId)?.company_name;

  const assignCompany = async (userId, companyId) => {
    if (!companyId) return;

    try {
      await api.post("/user-corporate", {
        user_id: userId,
        corporate_account_id: companyId,
      });
      fetchAll();
    } catch (err) {
      alert("User already assigned or error occurred");
    }
  };

  const addCompany = async () => {
    if (!companyName || !policyLimit) return;

    await api.post("/corporate-accounts", {
      company_name: companyName,
      policy_limit: Number(policyLimit),
    });

    setCompanyName("");
    setPolicyLimit("");
    setShowModal(false);
    fetchAll();
  };

  return (
    <div className="p-8 space-y-10 min-h-screen mt-20 z-0 relative text-white">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className=" p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Users</h2>

        <table className="w-full border">
          <thead className="">
            <tr>
              <th className="border p-2">Username</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Company</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => {
              const mapping = getUserMapping(user.id);

              return (
                <tr key={user.id}>
                  <td className="border p-2">{user.username}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">
                    {mapping ? (
                      <span className="font-medium">
                        {getCompanyName(mapping.corporate_account_id)}
                      </span>
                    ) : (
                      <select
                        className="border p-1 rounded text-white "
                        defaultValue=""
                        onChange={(e) =>
                          assignCompany(user.id, e.target.value)
                        }
                      >
                        <option value="">Assign Company</option>
                        {companies.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.company_name}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className=" p-6 rounded shadow">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Companies</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Company
          </button>
        </div>

        <table className="w-full border">
          <thead className="">
            <tr>
              <th className="border p-2">Company Name</th>
              <th className="border p-2">Policy Limit</th>
              <th className="border p-2">Created At</th>
            </tr>
          </thead>

          <tbody>
            {companies.map((c) => (
              <tr key={c.id}>
                <td className="border p-2">{c.company_name}</td>
                <td className="border p-2">{c.policy_limit}</td>
                <td className="border p-2">
                  {new Date(c.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded w-96 space-y-4">
            <h2 className="text-lg font-semibold">Add Company</h2>

            <input
              className="w-full border p-2 rounded"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />

            <input
              className="w-full border p-2 rounded"
              type="number"
              placeholder="Policy Limit"
              value={policyLimit}
              onChange={(e) => setPolicyLimit(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button
                onClick={addCompany}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
