import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Form() {
  const { id } = useParams();
  const [template, setTemplate] = useState({
    heading: "",  
    id: null,
    fields: [{ name: "name", required: true, type: "text" }],
  });

  const [formData, setFormData] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  async function fetchTemplate() {
    try {
      const res = await fetch(`https://formflow-server.onrender.com/form/${id}`);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      console.log(data);
      setTemplate(data);
    } catch (error) {
      console.error("Error fetching template:", error);
    }
  }

  useEffect(() => {
    fetchTemplate();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Include the heading in the formData object
    const dataWithHeading = {
      heading: template.heading,
      ...formData,
    };

    // Make a POST request to submit the form data to the server
    const response = await fetch(
      `https://formflow-server.onrender.com/users/responses/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataWithHeading),
      }
    );

    if (response.ok) {
      // Form data submitted successfully
      setFormSubmitted(true);
    } else {
      // Handle errors here if needed
      console.error("Error submitting form data");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="m-5 p-2">
      <div className="text-2xl font-bold mb-2">{template.heading}</div>
      <div className="p-1 m-2">
        {template.map((item, index) => (
          <div key={index}>
            <label className="p-1 m-1">{item.name}</label>
            <br />
            <input
              required={item.required}
              name={item.name}
              type={item.type}
              value={formData[item.name] || ""}
              onChange={handleChange}
              className="p-1 m-1 border border-blue-800 rounded-md w-1/2"
            />
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="bg-blue-500 px-2 py-1 border rounded-md text-white hover:bg-yellow-400 hover:text-black"
      >
        Submit
      </button>
      {formSubmitted && <p className="m-2 text-green-600 font-bold text-xl">Form data submitted successfully!</p>}
    </form>
  );
}