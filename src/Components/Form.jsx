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
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  async function fetchTemplate() {
    try {
      const res = await fetch(
        `https://formflow-server.onrender.com/form/${id}`
      );

      console.log("Response status:", res.status);

      if (res.status === 404) {
        setNotFound(true);
        setLoading(false);
      }

      if (!res.ok) {
        setNotFound(true);
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      console.log(data);
      setTemplate(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching template:", error);
      setLoading(false);
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
    const dataWithHeading = {
      heading: template.heading,
      ...formData,
    };

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
      setFormSubmitted(true);
    } else {
      console.error("Error submitting form data");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="m-5 p-2">
      {notFound ? (
        <p className="text-red-600 font-bold">Form Not Found</p>
      ) : (
        <>
          <div className="text-2xl font-bold mb-2">{template.heading}</div>
          <div className="p-1 m-2">
            {loading ? (
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
            ) : null}
          </div>
          {/* Submit button is always included within the form */}
          <button
            type="submit"
            className="bg-blue-500 px-2 py-1 border rounded-md text-white hover:bg-yellow-400 hover:text-black"
          >
            Submit
          </button>
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
