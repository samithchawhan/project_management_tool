import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");

  const [editingProject, setEditingProject] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/projects"
      );

      setProjects(response.data.projects);
    } catch (error) {
      setMessage("Failed to load projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDeleteProject = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/projects/${projectId}`
      );

      setMessage("Project deleted successfully!");

      fetchProjects();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to delete project"
      );
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setEditName(project.name);
    setEditDescription(project.description || "");
    setMessage("");
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/api/projects/${editingProject._id}`,
        {
          name: editName,
          description: editDescription,
        }
      );

      setMessage("Project updated successfully!");

      setEditingProject(null);
      setEditName("");
      setEditDescription("");

      fetchProjects();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to update project"
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
      }}
    >
      {/* TOP NAVBAR */}

      <header
        style={{
          height: "76px",
          background:
            "linear-gradient(135deg, #111827, #1e1b4b)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 45px",
          boxShadow:
            "0 4px 20px rgba(15, 23, 42, 0.15)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              boxShadow:
                "0 5px 15px rgba(99,102,241,0.4)",
            }}
          >
            ✓
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "22px",
              letterSpacing: "-0.5px",
            }}
          >
            Task
            <span style={{ color: "#818cf8" }}>
              Flow
            </span>
          </h2>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "rgba(255,255,255,0.08)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.15)",
            padding: "10px 18px",
            borderRadius: "9px",
            fontWeight: "600",
            transition: "0.2s",
          }}
        >
          ← Dashboard
        </button>
      </header>

      {/* MAIN CONTENT */}

      <main
        style={{
          padding: "45px",
          maxWidth: "1250px",
          margin: "0 auto",
        }}
      >
        {/* PAGE HEADING */}

        <div
          style={{
            marginBottom: "35px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#eef2ff",
              color: "#4f46e5",
              padding: "7px 12px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: "700",
              marginBottom: "14px",
            }}
          >
            📁 WORKSPACE
          </div>

          <h1
            style={{
              fontSize: "38px",
              margin: "0 0 10px 0",
              color: "#111827",
              letterSpacing: "-1px",
            }}
          >
            Your Projects
          </h1>

          <p
            style={{
              color: "#64748b",
              fontSize: "16px",
              margin: 0,
            }}
          >
            Organize your work, track progress and
            manage everything in one place.
          </p>
        </div>

        {/* SUCCESS MESSAGE */}

        {message && (
          <div
            style={{
              background: "#ecfdf5",
              color: "#047857",
              border: "1px solid #a7f3d0",
              padding: "13px 16px",
              borderRadius: "10px",
              marginBottom: "25px",
              fontWeight: "600",
            }}
          >
            ✓ {message}
          </div>
        )}

        {/* PROJECT COUNT */}

        {projects.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              <strong style={{ color: "#111827" }}>
                {projects.length}
              </strong>{" "}
              {projects.length === 1
                ? "project"
                : "projects"}{" "}
              in your workspace
            </p>
          </div>
        )}

        {/* EMPTY STATE */}

        {projects.length === 0 ? (
          <div
            style={{
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(10px)",
              border: "1px solid #e2e8f0",
              padding: "80px 40px",
              textAlign: "center",
              borderRadius: "20px",
              boxShadow:
                "0 10px 40px rgba(15,23,42,0.06)",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                margin: "0 auto 20px",
                borderRadius: "22px",
                background:
                  "linear-gradient(135deg, #eef2ff, #ddd6fe)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "36px",
              }}
            >
              📁
            </div>

            <h2
              style={{
                color: "#111827",
                marginBottom: "8px",
              }}
            >
              No projects yet
            </h2>

            <p
              style={{
                color: "#64748b",
                marginBottom: "25px",
              }}
            >
              Create your first project from the
              dashboard to get started.
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              style={{
                background:
                  "linear-gradient(135deg, #4f46e5, #7c3aed)",
                color: "white",
                border: "none",
                padding: "12px 22px",
                borderRadius: "9px",
                fontWeight: "700",
                boxShadow:
                  "0 6px 18px rgba(79,70,229,0.25)",
              }}
            >
              + Create Project
            </button>
          </div>
        ) : (
          /* PROJECT GRID */

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            {projects.map((project) => (
              <div
                key={project._id}
                style={{
                  background: "white",
                  borderRadius: "18px",
                  padding: "25px",
                  border: "1px solid #e2e8f0",
                  boxShadow:
                    "0 8px 30px rgba(15,23,42,0.06)",
                  transition:
                    "transform 0.2s, box-shadow 0.2s",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* CARD TOP GRADIENT */}

                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "5px",
                    background:
                      "linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7)",
                  }}
                />

                {/* ICON */}

                <div
                  style={{
                    width: "54px",
                    height: "54px",
                    borderRadius: "15px",
                    background:
                      "linear-gradient(135deg, #eef2ff, #ede9fe)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "25px",
                    marginBottom: "20px",
                  }}
                >
                  📁
                </div>

                {/* PROJECT NAME */}

                <h2
                  style={{
                    fontSize: "21px",
                    color: "#111827",
                    marginBottom: "10px",
                  }}
                >
                  {project.name}
                </h2>

                {/* DESCRIPTION */}

                <p
                  style={{
                    color: "#64748b",
                    minHeight: "48px",
                    lineHeight: "1.6",
                    fontSize: "14px",
                    marginBottom: "20px",
                  }}
                >
                  {project.description ||
                    "No description provided."}
                </p>

                {/* OPEN BUTTON */}

                <button
                  onClick={() =>
                    navigate(
                      `/project/${project._id}`
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    background:
                      "linear-gradient(135deg, #4f46e5, #7c3aed)",
                    color: "white",
                    border: "none",
                    borderRadius: "9px",
                    fontWeight: "700",
                    fontSize: "14px",
                    boxShadow:
                      "0 5px 15px rgba(79,70,229,0.2)",
                    marginBottom: "10px",
                  }}
                >
                  Open Project →
                </button>

                {/* EDIT + DELETE */}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <button
                    onClick={() =>
                      handleEditProject(project)
                    }
                    style={{
                      flex: 1,
                      padding: "10px",
                      background: "#f8fafc",
                      color: "#475569",
                      border: "1px solid #e2e8f0",
                      borderRadius: "9px",
                      fontWeight: "600",
                      fontSize: "13px",
                    }}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteProject(
                        project._id
                      )
                    }
                    style={{
                      flex: 1,
                      padding: "10px",
                      background: "#fff1f2",
                      color: "#e11d48",
                      border: "1px solid #fecdd3",
                      borderRadius: "9px",
                      fontWeight: "600",
                      fontSize: "13px",
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* EDIT MODAL */}

      {editingProject && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.65)",
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 100,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "520px",
              background: "white",
              padding: "32px",
              borderRadius: "20px",
              boxShadow:
                "0 25px 70px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: "25px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "13px",
                  background: "#eef2ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                }}
              >
                ✏️
              </div>

              <div>
                <h2
                  style={{
                    margin: 0,
                    color: "#111827",
                  }}
                >
                  Edit Project
                </h2>

                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  Update your project details
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateProject}>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "7px",
                }}
              >
                Project Name
              </label>

              <input
                type="text"
                value={editName}
                onChange={(e) =>
                  setEditName(e.target.value)
                }
                required
                style={{
                  width: "100%",
                  padding: "13px",
                  marginBottom: "20px",
                  border: "1px solid #d1d5db",
                  borderRadius: "9px",
                  outline: "none",
                  fontSize: "14px",
                }}
              />

              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "7px",
                }}
              >
                Description
              </label>

              <textarea
                value={editDescription}
                onChange={(e) =>
                  setEditDescription(
                    e.target.value
                  )
                }
                rows="4"
                style={{
                  width: "100%",
                  padding: "13px",
                  marginBottom: "25px",
                  border: "1px solid #d1d5db",
                  borderRadius: "9px",
                  resize: "vertical",
                  fontSize: "14px",
                }}
              />

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setEditingProject(null)
                  }
                  style={{
                    flex: 1,
                    padding: "13px",
                    background: "#f8fafc",
                    color: "#475569",
                    border: "1px solid #e2e8f0",
                    borderRadius: "9px",
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "13px",
                    background:
                      "linear-gradient(135deg, #4f46e5, #7c3aed)",
                    color: "white",
                    border: "none",
                    borderRadius: "9px",
                    fontWeight: "700",
                    boxShadow:
                      "0 5px 15px rgba(79,70,229,0.2)",
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;