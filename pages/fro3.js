import { Inter } from "next/font/google";
import Head from "next/head";
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Branches() {
  const [code, setCode] = useState("");
  const [response, setResponse] = useState("");
  const [name, setName] = useState("");
  const [items, setItems] = useState([]);
  const [searched, setSearched] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [totalSales, setTotalSales] = useState(0);

  const handleChange = (event) => {
    const inputValue = event.target.value;
    if (/^\d+$/.test(inputValue)) {
      setCode(inputValue);
      setError(null);
    } else {
      setError("برجاء كتابة الكود فقط");
      setCode("");
      setResponse("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendDataToBackend();
    }
  };

  const handleClick = () => {
    sendDataToBackend();
  };

  const sendDataToBackend = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search`, {
        method: "POST",
        body: JSON.stringify({ code }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const res = await response.json();
      const foundCode = res.foundCode;

      // Extract branches and their values
      const branchEntries = Object.entries(foundCode).filter(
        ([key, value]) =>
          key !== "_id" &&
          key !== "code" &&
          key !== "name" &&
          key !== "stock" &&
          key !== "company" &&
          key !== "__v"
      );

      // Sort branches in descending order initially
      const sortedBranchEntries = branchEntries.sort(
        (a, b) => parseFloat(b[1]) - parseFloat(a[1])
      );

      setItems(sortedBranchEntries);

      // Calculate total sales
      const total = sortedBranchEntries.reduce(
        (acc, [_, value]) => acc + parseFloat(value),
        0
      );
      setTotalSales(total);

      if (res.message === "archived") {
        setResponse("Archived");
        setName("");
        setSearched("");
      } else {
        setResponse(res.foundCode.Notes);
        setName(res.foundCode.ItemName);
        setSearched(res.foundCode.searched);
      }
    } catch (error) {
      setError("An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = () => {
    const sortedItems = [...items].sort((a, b) => {
      const valueA = parseFloat(a[1]);
      const valueB = parseFloat(b[1]);

      if (sortOrder === "asc") {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });

    setItems(sortedItems);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Head>
        <title>Branches</title>
      </Head>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <h1 className="font-extrabold">Month 4/5/6</h1>
          <label htmlFor="code" className="block text-gray-700">
            Enter Code:
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
        <button
          onClick={handleClick}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-black/90 h-10 px-4 py-2"
        >
          Search
        </button>
        {loading && <p className="mt-4 text-center">Loading...</p>}
        {response && (
          <div className="mt-4">
            <p>Notes: {response}</p>
            <p>Item Name: {name}</p>
            <p>Searched: {searched}</p>
          </div>
        )}
        {items.length > 0 && (
          <div className="mt-6">
            <button
              onClick={handleSort}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-black/90 h-10 px-4 py-2"
            >
              Sort {sortOrder === "asc" ? "Ascending" : "Descending"}
            </button>
            <div className="mt-4 text-right">
              <strong>Total Sales: </strong> {totalSales}
            </div>
            <div className="overflow-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Branch</th>
                    <th className="border px-4 py-2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(([branch, value], index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2 capitalize font-bold">
                        {branch}
                      </td>
                      <td className="border px-4 py-2">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
