import React, { useEffect, useState } from "react";

export default function MyForms() {
  const [submittedTemplates, setSubmittedTemplates] = useState([]);

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
      } catch (error) {
        console.error("Error fetching submitted templates:", error);
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
      <div>
        {submittedTemplates.map(function renderTemplate(
          template,
          templateIndex
        ) {
          return (
            <div
              className="border border-black m-4 p-4 rounded-md bg-purple-50"
              key={template.id}
            >
              <h2 className="font-bold text-2xl">{template.heading}</h2>
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
                          className="bg-blue-500 border rounded-md m-2"
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
        })}
      </div>
    </div>
  );
}
