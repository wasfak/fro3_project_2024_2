import { Inter } from "next/font/google";
import Head from "next/head";
const inter = Inter({ subsets: ["latin"] });
import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState("");
  const [response, setResponse] = useState("");
  const [name, setName] = useState("");
  const [items, setItems] = useState([]);
  const [searched, setSearched] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const inputValue = event.target.value;
    if (/^\d+$/.test(inputValue)) {
      setCode(inputValue);
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
    setIsLoading(true);
    sendDataToBackend();
    setIsLoading(false);
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

      const items = Array.isArray(res.foundCode)
        ? res.foundCode
        : [res.foundCode];
      setItems(items);

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

  return (
    <>
      <Head>
        <title>صيدليات ال عبد اللطيف الطرشوبى</title>
      </Head>

      <main className={` ${inter.className} mx-24`}>
        <div className="flex flex-col items-center m-4">
          <input
            type="text"
            value={code}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter code"
            className="appearance-none bg-white border border-gray-300 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-500"
          />
          <button
            disabled={loading}
            onClick={handleClick}
            className="py-2 px-4 rounded-2xl mt-6 bg-black text-white flex items-center"
          >
            {loading ? "Searching..." : "Search"}
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}

          <h1 className="font-extrabold mt-2">{name}</h1>
          <div className="mt-4 flex flex-col items-center w-full">
            {items && items.length > 0 && (
              <div className="grid grid-cols-2 gap-4 w-[800px] border-2 border-gray-600 p-4 shadow-2xl rounded-2xl">
                {Object.entries(items[0])
                  .filter(
                    ([key]) =>
                      key !== "_id" &&
                      key !== "__v" &&
                      key !== "ItemName" &&
                      key !== "Code"
                  )
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-start w-full gap-x-8"
                    >
                      <p className="font-extrabold border-b-2 w-full">
                        {key} :
                      </p>

                      <p
                        className={
                          value === 0
                            ? "text-red-900 font-extrabold border-b-2 w-full"
                            : "font-extrabold border-b-2 w-full"
                        }
                      >
                        {value}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
