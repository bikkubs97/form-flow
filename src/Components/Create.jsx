import React, { useState } from "react";

export default function Create() {
  const [fields, setFields] = useState([
    { name: "", required: false, type: "text" },
  ]);
  const [id, setId] = useState(null);
  const [formData, setFormData] = useState({
    heading: "", // Initialize heading as an empty string
    fields: [], // Initialize fields as an empty array
  });

  function handleAddField() {
    const newFields = [...fields, { name: "", required: false, type: "text" }];
    setFields(newFields);
  }

  function handleChange(index, event) {
    const { name, value, type, checked } = event.target;
    const updatedFields = [...fields];
    if (type === "checkbox") {
      updatedFields[index][name] = checked;
    } else {
      updatedFields[index][name] = value;
    }
    setFields(updatedFields);
  }

  function handleRemoveField(index) {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  }

  function handleSubmit() {
    // Create an array of fields that need to be submitted (e.g., filter out empty fields)
    const fieldsToSubmit = fields.filter((field) => field.name.trim() !== "");

    // Update the formData with the heading and fields
    setFormData({
      ...formData,
      heading: document.querySelector("input[name='heading']").value,
      fields: fieldsToSubmit,
    });

    // Get the JWT token from local storage
    const token = localStorage.getItem("token");

    // Make a POST request to the server with the form data and JWT token
    fetch("https://formflow-server.onrender.com/users/data", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add the JWT token to the headers
      },
      body: JSON.stringify(formData), // Use the updated formData here
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Handle the successful response here
        return response.json();
      })
      .then((data) => {
        // Handle the data received from the server
        console.log("Server response:", data);
        setId(data.id);
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch
        console.error("Fetch error:", error);
      });
  }

  function handleCopyUrl() {
    const url = `http://localhost:5173/forms/${id}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        alert("URL copied to clipboard");
      })
      .catch((error) => {
        console.error("Error copying URL to clipboard: ", error);
      });
  }

  return (
    <div className="mx-5">
      <h2 className="font-bold text-2xl text-blue-600 py-5 rounded-md">
        Create Your Form
      </h2>
      <label>Form Heading:</label>
      <input
        type="text"
        name="heading"
        className="m-1 p-1 border border-blue-900 rounded-md"
        onChange={(e) => {
          setFormData({
            ...formData,
            heading: e.target.value, // Update the heading in formData
          });
        }}
      />
      {fields.map((field, index) => (
        <div className="bg-purple-200 my-2 p-4 rounded-md" key={index}>
          <label className="p-2">
            Field Name:
            <input
              type="text"
              name="name"
              value={field.name}
              onChange={(e) => handleChange(index, e)}
              className="m-2 p-1 border border-blue-900 rounded-md"
            />
          </label>
          <br />
          <label className="p-2">
            Required:
            <input
              className="m-2"
              type="checkbox"
              name="required"
              checked={field.required}
              onChange={(e) => handleChange(index, e)}
            />
          </label>
          <label className="p-2">
            Input Type:
            <select
              className="bg-blue-500 border rounded-md m-2"
              name="type"
              value={field.type}
              onChange={(e) => handleChange(index, e)}
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="email">Email</option>
              <option value="url">Link</option>
            </select>
          </label>
          <button
            className="bg-red-600 px-2 text-white border rounded-md"
            onClick={() => handleRemoveField(index)}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        className="m-2 p-1 bg-blue-500 border rounded-md text-white hover:bg-yellow-400 hover:text-black"
        onClick={handleAddField}
      >
        Add Field
      </button>
      <button
        className="m-2 p-1 bg-blue-500 border rounded-md text-white hover:bg-yellow-400 hover:text-black"
        onClick={handleSubmit}
      >
        Generate URL
      </button>{" "}
      <br />
      {id && (
        <div>
          {" "}
          <label className="p-2">Your URL :</label>
          <span
            className="hover:cursor-pointer text-blue-600 underline"
            onClick={handleCopyUrl}
          >
            http://localhost:5173/forms/{id} (Click to Copy)
          </span>
        </div>
      )}
    </div>
  );
}
