import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Form() {
  const { id } = useParams();
  const [template, setTemplate] = useState({
    heading: "",
    id: null,
    fields: [],
  });

  const [formData, setFormData] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const [notFound, setNotFound] = useState(false); // Add notFound state

  async function fetchTemplate() {
    try {
      const res = await fetch(
        `https://formflow-server.onrender.com/form/${id}`
      );
  
      console.log("Response status:", res.status); // Add this line for debugging
  
      if (res.status === 404) {
        setNotFound(true); // Set notFound to true for 404 response
        setLoading(false); // Set loading to false
        return;
      }
  
      if (!res.ok) {       
        setNotFound(true)
        throw new Error("Network response was not ok");
      }
  
      const data = await res.json();
      console.log(data);
      setTemplate(data);
      setLoading(false); // Set loading to false when data is received
    } catch (error) {
      console.error("Error fetching template:", error);
      setLoading(false); // Set loading to false on error
    }
  }
  



  useEffect(() => {
    fetchTemplate();
  }, []);

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
      {notFound ? ( // Display "Not Found" for 404 response
        <p className="text-red-600 font-bold">Form Not Found</p>
      ) : (
        <>
          <div className="text-2xl font-bold mb-2">{template.heading}</div>
          <div className="p-1 m-2">
            {loading ? ( // Check if loading
              <p className="animate-pulse">Loading Form...</p>
            ) : template.fields.length > 0 ? (
              template.fields.map((item, index) => (
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
              ))
            ) : (
              <button
                type="submit"
                className="bg-blue-500 px-2 py-1 border rounded-md text-white hover:bg-yellow-400 hover:text-black"
              >
                Submit
              </button>
            )}
          </div>
          {formSubmitted && (
            <p className="m-2 text-green-600 font-bold text-xl">
              Form data submitted successfully!
            </p>
          )}
        </>
      )}
    </form>
  );
}
