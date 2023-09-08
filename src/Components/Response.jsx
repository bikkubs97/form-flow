import React, { useEffect, useState } from "react";

export default function Response() {
  const [responseData, setResponseData] = useState([]);

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
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchResponses();
  }, []);

  return (
    <div className="m-4">
      <h2 className="font-bold text-2xl text-blue-600 m-2 mb-4">Responses</h2>
      {responseData.map((item, index) => (
        <div
          className="m-2 p-4 border bg-purple-200  text-black border-purple-400 rounded-md"
          key={index}
        >
          <h1 className="text-2xl font-bold m-2">{item.heading}</h1>
          {Object.entries(item).map(([key, value]) => (
            <p className="p-1 m-1" key={key}>
              {key}: {value}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
