import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

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

  const handleCreateProject = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/projects", {
        name,
        description,
        owner: user.id,
      });

      setMessage("Project created successfully!");

      setName("");
      setDescription("");

      fetchProjects();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to create project"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const handleMyTasksClick = () => {
    if (projects.length > 0) {
      navigate(`/project/${projects[0]._id}`);
    } else {
      setMessage(
        "Create a project first to view your tasks."
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#f5f7fb",
      }}
    >
      {/* SIDEBAR */}

      <aside
        style={{
          width: "240px",
          background: "#111827",
          color: "white",
          padding: "28px 20px",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <h1
          style={{
            fontSize: "26px",
            marginBottom: "45px",
          }}
        >
          Task<span style={{ color: "#818cf8" }}>Flow</span>
        </h1>

        {/* DASHBOARD */}

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            width: "100%",
            background: "#4f46e5",
            color: "white",
            border: "none",
            padding: "13px",
            borderRadius: "8px",
            marginBottom: "12px",
            fontWeight: "600",
            fontSize: "16px",
            textAlign: "left",
          }}
        >
          📊 Dashboard
        </button>

        {/* PROJECTS */}

        <button
          onClick={() => navigate("/projects")}
          style={{
            width: "100%",
            background: "transparent",
            color: "#9ca3af",
            border: "none",
            padding: "13px",
            marginBottom: "8px",
            fontSize: "16px",
            textAlign: "left",
          }}
        >
          📁 Projects
        </button>

        {/* MY TASKS */}

        <button
          onClick={handleMyTasksClick}
          style={{
            width: "100%",
            background: "transparent",
            color: "#9ca3af",
            border: "none",
            padding: "13px",
            fontSize: "16px",
            textAlign: "left",
          }}
        >
          ✅ My Tasks
        </button>

        <div style={{ flex: 1 }} />

        {/* LOGOUT */}

        <button
          onClick={handleLogout}
          style={{
            padding: "12px",
            background: "#1f2937",
            border: "1px solid #374151",
            color: "#d1d5db",
            borderRadius: "8px",
          }}
        >
          🚪 Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}

      <main
        style={{
          flex: 1,
          padding: "40px",
          marginLeft: "240px",
          maxWidth: "1440px",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "35px",
          }}
        >
          <div>
            <p
              style={{
                color: "#6b7280",
                marginBottom: "7px",
              }}
            >
              Welcome back,
            </p>

            <h2
              style={{
                fontSize: "32px",
              }}
            >
              {user?.name} 👋
            </h2>
          </div>

          <div
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              background: "#4f46e5",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* STATS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, minmax(180px, 1fr))",
            gap: "20px",
            marginBottom: "35px",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "14px",
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.05)",
            }}
          >
            <p style={{ color: "#6b7280" }}>
              Total Projects
            </p>

            <h2
              style={{
                marginTop: "10px",
                fontSize: "30px",
              }}
            >
              {projects.length}
            </h2>
          </div>

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "14px",
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.05)",
            }}
          >
            <p style={{ color: "#6b7280" }}>
              Active Projects
            </p>

            <h2
              style={{
                marginTop: "10px",
                fontSize: "30px",
              }}
            >
              {projects.length}
            </h2>
          </div>

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "14px",
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.05)",
            }}
          >
            <p style={{ color: "#6b7280" }}>
              Workspace
            </p>

            <h2
              style={{
                marginTop: "10px",
                fontSize: "20px",
              }}
            >
              Personal
            </h2>
          </div>
        </div>

        {/* CREATE PROJECT */}

        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "14px",
            marginBottom: "35px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.05)",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>
            Create New Project
          </h2>

          <form
            onSubmit={handleCreateProject}
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1.5fr auto",
              gap: "15px",
              alignItems: "end",
            }}
          >
            <div>
              <label>Project Name</label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="e.g. Website Redesign"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "7px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                }}
              />
            </div>

            <div>
              <label>Description</label>

              <input
                type="text"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="What is this project about?"
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "7px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: "13px 20px",
                background: "#4f46e5",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
              }}
            >
              + Create
            </button>
          </form>

          {message && (
            <p
              style={{
                marginTop: "15px",
                color: "#16a34a",
              }}
            >
              {message}
            </p>
          )}
        </div>

        {/* PROJECTS */}

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <h2>My Projects</h2>

            <span style={{ color: "#6b7280" }}>
              {projects.length} projects
            </span>
          </div>

          {projects.length === 0 ? (
            <div
              style={{
                background: "white",
                padding: "50px",
                textAlign: "center",
                borderRadius: "14px",
              }}
            >
              <h3>No projects yet</h3>

              <p
                style={{
                  color: "#6b7280",
                  marginTop: "8px",
                }}
              >
                Create your first project above.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "20px",
              }}
            >
              {projects.map((project) => (
                <div
                  key={project._id}
                  style={{
                    background: "white",
                    padding: "25px",
                    borderRadius: "14px",
                    boxShadow:
                      "0 4px 15px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    style={{
                      width: "45px",
                      height: "45px",
                      background: "#eef2ff",
                      color: "#4f46e5",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      marginBottom: "18px",
                    }}
                  >
                    📁
                  </div>

                  <h3>{project.name}</h3>

                  <p
                    style={{
                      color: "#6b7280",
                      marginTop: "10px",
                      minHeight: "45px",
                    }}
                  >
                    {project.description ||
                      "No description provided."}
                  </p>

                  <button
                    onClick={() =>
                      navigate(
                        `/project/${project._id}`
                      )
                    }
                    style={{
                      marginTop: "20px",
                      width: "100%",
                      padding: "11px",
                      background: "#f3f4f6",
                      border: "none",
                      borderRadius: "8px",
                      color: "#374151",
                      fontWeight: "600",
                    }}
                  >
                    Open Project →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;