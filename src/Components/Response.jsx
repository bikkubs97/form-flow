import React, { useEffect, useState } from "react";

export default function Response() {
  const [responseData, setResponseData] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchResponses() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Access token not found");
      }

      const response = await fetch(
        "https://formflow-server.onrender.com/responses",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch responses");
      }

      const responseData = await response.json();
      setResponseData(responseData);
      setLoading(false); 
    } catch (error) {
      console.error(error);
      setLoading(false); 
    }
  }

  useEffect(() => {
    fetchResponses();
  }, []);

  return (
    <div className="m-4">
      <h1 className="ml-2 mt-4 text-blue-900 text-center font-bold text-2xl">Responses</h1>
      {loading ? ( 
        <div>
        <p className="ml-2 mt-4 text-blue-900 text-center font-bold text-2xl">Loading...</p>
        <div className="flex justify-center">
      <img className="w-1/4 h-1/4 animate-pulse" src="/fav.png"/>
      </div>
      </div>
      ) : responseData.length > 0 ? (
        responseData.map((item, index) => (
          <div
            className="m-2 p-4 border bg-indigo-200  text-black shadow rounded-md"
            key={index}
          >
            <h1 className="text-2xl font-bold m-2">{item.heading}</h1>
            {Object.entries(item).map(([key, value]) => (
              <p className="p-1 m-1" key={key}>
                {key}: {value}
              </p>
            ))}
          </div>
        ))
      ) : (
        <p className="ml-2 mt-4 text-blue-900 text-center  text-2xl">No responses yet</p>
      )}
    </div>
  );
}
