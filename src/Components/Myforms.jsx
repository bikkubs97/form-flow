import React, { useEffect, useState } from "react";

export default function MyForms() {
  const [submittedTemplates, setSubmittedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(function fetchTemplates() {
    const authToken = localStorage.getItem("token");

    async function fetchSubmittedTemplates() {
      const apiUrl = "https://formflow-server.onrender.com/form";

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setSubmittedTemplates(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching submitted templates:", error);
        setLoading(false);
      }
    }

    if (authToken) {
      fetchSubmittedTemplates();
    }
  }, []);

  function handleRemoveField(templateIndex, fieldIndex) {
    const updatedTemplates = [...submittedTemplates];
    updatedTemplates[templateIndex].fields.splice(fieldIndex, 1);
    setSubmittedTemplates(updatedTemplates);
  }

  async function handleUpdate(templateId, updatedForm) {
    const authToken = localStorage.getItem("token");

    const apiUrl = `https://formflow-server.onrender.com/users/data/${templateId}`;

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updatedForm),
      });

      if (!response.ok) {
        throw new Error(`Failed to update form: ${response.status}`);
      }

      console.log("Form updated successfully");
    } catch (error) {
      console.error("Error updating form:", error);
    }
  }

  async function handleDelete(templateId) {
    const authToken = localStorage.getItem("token");

    const apiUrl = `https://formflow-server.onrender.com/users/data/${templateId}`;

    try {
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete form: ${response.status}`);
      }

      const updatedTemplates = submittedTemplates.filter(
        (template) => template.id !== templateId
      );
      setSubmittedTemplates(updatedTemplates);

      console.log("Form deleted successfully");
    } catch (error) {
      console.error("Error deleting form:", error);
    }
  }

  return (
    <div>
      <h1 className="ml-2 mt-4 text-blue-900 text-center font-bold text-2xl">My Forms</h1>
      <div>
        {loading ? (
          <div>
            <p className="ml-2 mt-4 text-blue-900 text-center font-bold text-2xl">Loading...</p>
            <div className="flex justify-center">
          <img className="w-1/4 h-1/4 animate-pulse" src="/fav.png"/>
          </div>
          </div>
        ) : submittedTemplates.length > 0 ? (
          submittedTemplates.map(function renderTemplate(
            template,
            templateIndex
          ) {
            return (
              <div
                className="border rounded-md m-4 p-4 shadow bg-indigo-200"
                key={template.id}
              >
                <h2 className="font-bold text-2xl">{template.heading}</h2>
                <div className="my-2">
                  <a className="cursor-pointer hover:text-blue-950">
                    https://formflow.onrender.com/forms/{template.id}
                  </a>
                  <br />
                </div>
                <form>
                  {template.fields.map(function renderField(field, fieldIndex) {
                    return (
                      <div key={fieldIndex}>
                        <label>
                          Field Name:
                          <input
                            className="m-2 p-1 border border-blue-900 rounded-md"
                            type="text"
                            name={`fieldName-${templateIndex}-${fieldIndex}`}
                            value={field.name}
                            onChange={function handleFieldNameChange(e) {
                              const updatedTemplates = [...submittedTemplates];
                              updatedTemplates[templateIndex].fields[
                                fieldIndex
                              ].name = e.target.value;
                              setSubmittedTemplates(updatedTemplates);
                            }}
                          />
                          <br />
                        </label>
                        <label>
                          Required:
                          <input
                            className="m-2"
                            type="checkbox"
                            name={`fieldRequired-${templateIndex}-${fieldIndex}`}
                            checked={field.required}
                            onChange={function handleFieldRequiredChange(e) {
                              const updatedTemplates = [...submittedTemplates];
                              updatedTemplates[templateIndex].fields[
                                fieldIndex
                              ].required = e.target.checked;
                              setSubmittedTemplates(updatedTemplates);
                            }}
                          />
                        </label>
                        <label>
                          Input Type:
                          <select
                            name={`fieldType-${templateIndex}-${fieldIndex}`}
                            value={field.type}
                            className="bg-blue-500 border rounded-md m-2 text-white"
                            onChange={function handleFieldTypeChange(e) {
                              const updatedTemplates = [...submittedTemplates];
                              updatedTemplates[templateIndex].fields[
                                fieldIndex
                              ].type = e.target.value;
                              setSubmittedTemplates(updatedTemplates);
                            }}
                          >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="date">Date</option>
                            <option value="email">Email</option>
                            <option value="url">Link</option>
                          </select>
                        </label>
                        <button
                          type="button"
                          className="m-2 p-1 bg-red-500 border rounded-md text-white hover:bg-yellow-400 hover:text-black"
                          onClick={function handleRemoveButtonClick(e) {
                            e.preventDefault();
                            handleRemoveField(templateIndex, fieldIndex);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                  <button
                    className="m-2 p-1 bg-blue-500 border rounded-md text-white hover:bg-yellow-400 hover:text-black"
                    onClick={function handleAddFieldClick(e) {
                      e.preventDefault();
                      const updatedTemplates = [...submittedTemplates];
                      updatedTemplates[templateIndex].fields.push({
                        name: "",
                        required: false,
                        type: "text",
                      });
                      setSubmittedTemplates(updatedTemplates);
                    }}
                  >
                    Add Field
                  </button>
                  <button
                    className="m-2 p-1 bg-green-500 border rounded-md text-white hover:bg-yellow-400 hover:text-black"
                    onClick={function handleUpdateButtonClick() {
                      handleUpdate(template.id, template);
                    }}
                  >
                    Update Form
                  </button>
                  <button
                    className="m-2 p-1 bg-red-500 border rounded-md text-white hover:bg-yellow-400 hover:text-black"
                    onClick={function handleDeleteButtonClick() {
                      handleDelete(template.id);
                    }}
                  >
                    Delete
                  </button>
                </form>
              </div>
            );
          })
        ) : (
          <p className="ml-2 mt-4 text-blue-900 text-center text-2xl">You have no forms, create one.</p>
        )}
      </div>
    </div>
  );
}
