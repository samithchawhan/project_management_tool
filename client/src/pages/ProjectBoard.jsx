import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function ProjectBoard() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("todo");
  const [taskAssignedTo, setTaskAssignedTo] = useState("");

  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("todo");
  const [editAssignedTo, setEditAssignedTo] = useState("");

  const [commentTask, setCommentTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchProject = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/projects/${projectId}`
      );

      setProject(response.data.project);
    } catch (error) {
      setMessage("Failed to load project");
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/tasks/project/${projectId}`
      );

      setTasks(response.data.tasks);
    } catch (error) {
      setMessage("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/users"
      );

      setUsers(response.data.users);
    } catch (error) {
      setMessage("Failed to load users");
    }
  };

  useEffect(() => {
    fetchProject();
    fetchTasks();
    fetchUsers();
  }, [projectId]);

  const createTask = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/tasks", {
        title: taskTitle,
        description: taskDescription,
        status: taskStatus,
        project: projectId,
        assignedTo: taskAssignedTo || null,
      });

      setTaskTitle("");
      setTaskDescription("");
      setTaskStatus("todo");
      setTaskAssignedTo("");

      setMessage("Task created successfully!");

      fetchTasks();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to create task"
      );
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          status: newStatus,
        }
      );

      setMessage("Task status updated!");

      fetchTasks();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to update task"
      );
    }
  };

  const openEditTask = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditStatus(task.status);
    setEditAssignedTo(
      task.assignedTo?._id || ""
    );
    setMessage("");
  };

  const updateTask = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${editingTask._id}`,
        {
          title: editTitle,
          description: editDescription,
          status: editStatus,
          assignedTo: editAssignedTo || null,
        }
      );

      setMessage("Task updated successfully!");

      setEditingTask(null);
      setEditTitle("");
      setEditDescription("");
      setEditStatus("todo");
      setEditAssignedTo("");

      fetchTasks();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to update task"
      );
    }
  };

  const deleteTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/tasks/${taskId}`
      );

      setMessage("Task deleted successfully!");

      fetchTasks();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to delete task"
      );
    }
  };

  const openComments = async (task) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/comments/task/${task._id}`
      );

      setComments(response.data.comments);
      setCommentTask(task);
      setCommentText("");
    } catch (error) {
      setMessage("Failed to load comments");
    }
  };

  const addComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      return;
    }

    if (!user) {
      setMessage("Please login again to add a comment");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/comments",
        {
          text: commentText,
          task: commentTask._id,
          user: user.id,
        }
      );

      setCommentText("");

      const response = await axios.get(
        `http://localhost:5000/api/comments/task/${commentTask._id}`
      );

      setComments(response.data.comments);

      setMessage("Comment added successfully!");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to add comment"
      );
    }
  };

  const getStatusColor = (status) => {
    if (status === "todo") {
      return {
        background: "#eef2ff",
        color: "#4f46e5",
      };
    }

    if (status === "in-progress") {
      return {
        background: "#fff7ed",
        color: "#ea580c",
      };
    }

    return {
      background: "#ecfdf5",
      color: "#059669",
    };
  };

  const getStatusLabel = (status) => {
    if (status === "todo") {
      return "To Do";
    }

    if (status === "in-progress") {
      return "In Progress";
    }

    return "Done";
  };

  const todoTasks = tasks.filter(
    (task) => task.status === "todo"
  );

  const progressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  );

  const doneTasks = tasks.filter(
    (task) => task.status === "done"
  );

  const TaskCard = ({ task }) => {
    const statusStyle = getStatusColor(task.status);

    return (
      <div
        style={{
          background: "white",
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          padding: "18px",
          marginBottom: "14px",
          boxShadow:
            "0 6px 20px rgba(15,23,42,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <h3
            style={{
              margin: 0,
              color: "#111827",
              fontSize: "16px",
              lineHeight: "1.4",
            }}
          >
            {task.title}
          </h3>

          <span
            style={{
              ...statusStyle,
              padding: "5px 9px",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: "700",
              whiteSpace: "nowrap",
            }}
          >
            {getStatusLabel(task.status)}
          </span>
        </div>

        <p
          style={{
            color: "#64748b",
            fontSize: "13px",
            lineHeight: "1.6",
            margin: "10px 0 15px",
          }}
        >
          {task.description ||
            "No description provided."}
        </p>

        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "8px 10px",
            marginBottom: "14px",
            fontSize: "12px",
            color: "#475569",
          }}
        >
          👤 Assigned to:{" "}
          <strong>
            {task.assignedTo?.name ||
              "Unassigned"}
          </strong>
        </div>

        <div
          style={{
            display: "flex",
            gap: "7px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => openEditTask(task)}
            style={{
              flex: 1,
              minWidth: "75px",
              padding: "8px",
              border: "1px solid #ddd6fe",
              background: "#f5f3ff",
              color: "#6d28d9",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "700",
            }}
          >
            ✏️ Edit
          </button>

          <button
            onClick={() => openComments(task)}
            style={{
              flex: 1,
              minWidth: "75px",
              padding: "8px",
              border: "1px solid #dbeafe",
              background: "#eff6ff",
              color: "#2563eb",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "700",
            }}
          >
            💬 Comments
          </button>

          <button
            onClick={() => deleteTask(task._id)}
            style={{
              flex: 1,
              minWidth: "75px",
              padding: "8px",
              border: "1px solid #fecdd3",
              background: "#fff1f2",
              color: "#e11d48",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "700",
            }}
          >
            🗑️ Delete
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "7px",
            marginTop: "8px",
          }}
        >
          {task.status !== "todo" && (
            <button
              onClick={() =>
                updateTaskStatus(
                  task._id,
                  "todo"
                )
              }
              style={{
                flex: 1,
                padding: "7px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                color: "#475569",
                borderRadius: "7px",
                fontSize: "11px",
                fontWeight: "600",
              }}
            >
              ← To Do
            </button>
          )}

          {task.status === "todo" && (
            <button
              onClick={() =>
                updateTaskStatus(
                  task._id,
                  "in-progress"
                )
              }
              style={{
                flex: 1,
                padding: "7px",
                background: "#fff7ed",
                border: "1px solid #fed7aa",
                color: "#ea580c",
                borderRadius: "7px",
                fontSize: "11px",
                fontWeight: "600",
              }}
            >
              Start →
            </button>
          )}

          {task.status === "in-progress" && (
            <button
              onClick={() =>
                updateTaskStatus(
                  task._id,
                  "done"
                )
              }
              style={{
                flex: 1,
                padding: "7px",
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                color: "#059669",
                borderRadius: "7px",
                fontSize: "11px",
                fontWeight: "600",
              }}
            >
              Complete →
            </button>
          )}

          {task.status === "done" && (
            <button
              onClick={() =>
                updateTaskStatus(
                  task._id,
                  "in-progress"
                )
              }
              style={{
                flex: 1,
                padding: "7px",
                background: "#fff7ed",
                border: "1px solid #fed7aa",
                color: "#ea580c",
                borderRadius: "7px",
                fontSize: "11px",
                fontWeight: "600",
              }}
            >
              ← Reopen
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          color: "#4f46e5",
          fontSize: "18px",
          fontWeight: "700",
        }}
      >
        Loading project...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
      }}
    >
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
            "0 4px 20px rgba(15,23,42,0.15)",
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
              fontWeight: "800",
            }}
          >
            ✓
          </div>

          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "21px",
              }}
            >
              Task
              <span style={{ color: "#818cf8" }}>
                Flow
              </span>
            </h2>

            {project && (
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "12px",
                  color: "#cbd5e1",
                }}
              >
                {project.name}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate("/projects")}
          style={{
            background:
              "rgba(255,255,255,0.08)",
            color: "white",
            border:
              "1px solid rgba(255,255,255,0.15)",
            padding: "10px 18px",
            borderRadius: "9px",
            fontWeight: "600",
          }}
        >
          ← Projects
        </button>
      </header>

      <main
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "40px",
        }}
      >
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

        <section
          style={{
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              background: "#eef2ff",
              color: "#4f46e5",
              padding: "7px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "700",
              marginBottom: "12px",
            }}
          >
            PROJECT BOARD
          </div>

          <h1
            style={{
              margin: "0 0 8px",
              fontSize: "36px",
              color: "#111827",
              letterSpacing: "-1px",
            }}
          >
            {project?.name || "Project Board"}
          </h1>

          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "15px",
            }}
          >
            {project?.description ||
              "Manage your project tasks and track progress."}
          </p>
        </section>

        <section
          style={{
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "18px",
            padding: "25px",
            marginBottom: "30px",
            boxShadow:
              "0 8px 30px rgba(15,23,42,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "#eef2ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ➕
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "19px",
                  color: "#111827",
                }}
              >
                Create New Task
              </h2>

              <p
                style={{
                  margin: "3px 0 0",
                  color: "#64748b",
                  fontSize: "12px",
                }}
              >
                Add and assign a task to a team member
              </p>
            </div>
          </div>

          <form onSubmit={createTask}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1.3fr 1.8fr 160px 180px auto",
                gap: "12px",
                alignItems: "end",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#475569",
                    marginBottom: "7px",
                  }}
                >
                  Task Title
                </label>

                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) =>
                    setTaskTitle(e.target.value)
                  }
                  placeholder="Enter task title"
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "9px",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#475569",
                    marginBottom: "7px",
                  }}
                >
                  Description
                </label>

                <input
                  type="text"
                  value={taskDescription}
                  onChange={(e) =>
                    setTaskDescription(
                      e.target.value
                    )
                  }
                  placeholder="Describe the task"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "9px",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#475569",
                    marginBottom: "7px",
                  }}
                >
                  Status
                </label>

                <select
                  value={taskStatus}
                  onChange={(e) =>
                    setTaskStatus(e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "9px",
                    background: "white",
                  }}
                >
                  <option value="todo">
                    To Do
                  </option>

                  <option value="in-progress">
                    In Progress
                  </option>

                  <option value="done">
                    Done
                  </option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#475569",
                    marginBottom: "7px",
                  }}
                >
                  Assign To
                </label>

                <select
                  value={taskAssignedTo}
                  onChange={(e) =>
                    setTaskAssignedTo(
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "9px",
                    background: "white",
                  }}
                >
                  <option value="">
                    Unassigned
                  </option>

                  {users.map((member) => (
                    <option
                      key={member._id}
                      value={member._id}
                    >
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                style={{
                  padding: "12px 20px",
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
                + Add Task
              </button>
            </div>
          </form>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, minmax(0, 1fr))",
            gap: "22px",
          }}
        >
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "18px",
              padding: "18px",
              minHeight: "300px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#6366f1",
                  }}
                />

                <h2
                  style={{
                    margin: 0,
                    fontSize: "17px",
                    color: "#1e293b",
                  }}
                >
                  To Do
                </h2>
              </div>

              <span
                style={{
                  background: "#eef2ff",
                  color: "#4f46e5",
                  padding: "5px 9px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                {todoTasks.length}
              </span>
            </div>

            {todoTasks.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  color: "#94a3b8",
                  fontSize: "13px",
                  padding: "35px 10px",
                }}
              >
                No tasks here
              </p>
            ) : (
              todoTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                />
              ))
            )}
          </div>

          <div
            style={{
              background: "#fffaf5",
              border: "1px solid #fed7aa",
              borderRadius: "18px",
              padding: "18px",
              minHeight: "300px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#f97316",
                  }}
                />

                <h2
                  style={{
                    margin: 0,
                    fontSize: "17px",
                    color: "#1e293b",
                  }}
                >
                  In Progress
                </h2>
              </div>

              <span
                style={{
                  background: "#ffedd5",
                  color: "#ea580c",
                  padding: "5px 9px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                {progressTasks.length}
              </span>
            </div>

            {progressTasks.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  color: "#94a3b8",
                  fontSize: "13px",
                  padding: "35px 10px",
                }}
              >
                No tasks here
              </p>
            ) : (
              progressTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                />
              ))
            )}
          </div>

          <div
            style={{
              background: "#f5fffa",
              border: "1px solid #a7f3d0",
              borderRadius: "18px",
              padding: "18px",
              minHeight: "300px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#10b981",
                  }}
                />

                <h2
                  style={{
                    margin: 0,
                    fontSize: "17px",
                    color: "#1e293b",
                  }}
                >
                  Done
                </h2>
              </div>

              <span
                style={{
                  background: "#d1fae5",
                  color: "#059669",
                  padding: "5px 9px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                {doneTasks.length}
              </span>
            </div>

            {doneTasks.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  color: "#94a3b8",
                  fontSize: "13px",
                  padding: "35px 10px",
                }}
              >
                No completed tasks
              </p>
            ) : (
              doneTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                />
              ))
            )}
          </div>
        </section>
      </main>

      {editingTask && (
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
              maxWidth: "550px",
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
                  width: "50px",
                  height: "50px",
                  borderRadius: "14px",
                  background:
                    "linear-gradient(135deg, #ede9fe, #ddd6fe)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "23px",
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
                  Edit Task
                </h2>

                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  Update task details and assignment
                </p>
              </div>
            </div>

            <form onSubmit={updateTask}>
              <label
                style={{
                  display: "block",
                  fontWeight: "700",
                  color: "#374151",
                  marginBottom: "7px",
                  fontSize: "13px",
                }}
              >
                Task Title
              </label>

              <input
                type="text"
                value={editTitle}
                onChange={(e) =>
                  setEditTitle(e.target.value)
                }
                required
                style={{
                  width: "100%",
                  padding: "13px",
                  marginBottom: "18px",
                  border: "1px solid #d1d5db",
                  borderRadius: "9px",
                  outline: "none",
                  fontSize: "14px",
                }}
              />

              <label
                style={{
                  display: "block",
                  fontWeight: "700",
                  color: "#374151",
                  marginBottom: "7px",
                  fontSize: "13px",
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
                  marginBottom: "18px",
                  border: "1px solid #d1d5db",
                  borderRadius: "9px",
                  resize: "vertical",
                  fontSize: "14px",
                  outline: "none",
                }}
              />

              <label
                style={{
                  display: "block",
                  fontWeight: "700",
                  color: "#374151",
                  marginBottom: "7px",
                  fontSize: "13px",
                }}
              >
                Status
              </label>

              <select
                value={editStatus}
                onChange={(e) =>
                  setEditStatus(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "13px",
                  marginBottom: "18px",
                  border: "1px solid #d1d5db",
                  borderRadius: "9px",
                  background: "white",
                  fontSize: "14px",
                }}
              >
                <option value="todo">
                  To Do
                </option>

                <option value="in-progress">
                  In Progress
                </option>

                <option value="done">
                  Done
                </option>
              </select>

              <label
                style={{
                  display: "block",
                  fontWeight: "700",
                  color: "#374151",
                  marginBottom: "7px",
                  fontSize: "13px",
                }}
              >
                Assign To
              </label>

              <select
                value={editAssignedTo}
                onChange={(e) =>
                  setEditAssignedTo(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "13px",
                  marginBottom: "25px",
                  border: "1px solid #d1d5db",
                  borderRadius: "9px",
                  background: "white",
                  fontSize: "14px",
                }}
              >
                <option value="">
                  Unassigned
                </option>

                {users.map((member) => (
                  <option
                    key={member._id}
                    value={member._id}
                  >
                    {member.name}
                  </option>
                ))}
              </select>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setEditingTask(null)
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
                  }}
                >
                  ✓ Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {commentTask && (
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
              maxWidth: "600px",
              maxHeight: "85vh",
              background: "white",
              borderRadius: "20px",
              boxShadow:
                "0 25px 70px rgba(0,0,0,0.25)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "25px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    color: "#111827",
                    fontSize: "20px",
                  }}
                >
                  💬 Task Comments
                </h2>

                <p
                  style={{
                    margin: "5px 0 0",
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  {commentTask.title}
                </p>
              </div>

              <button
                onClick={() =>
                  setCommentTask(null)
                }
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "9px",
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  color: "#475569",
                  fontSize: "18px",
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                padding: "20px 25px",
                overflowY: "auto",
                flex: 1,
              }}
            >
              {comments.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "35px 10px",
                    color: "#94a3b8",
                  }}
                >
                  <div
                    style={{
                      fontSize: "35px",
                      marginBottom: "10px",
                    }}
                  >
                    💬
                  </div>

                  <p style={{ margin: 0 }}>
                    No comments yet.
                  </p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "13px",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        marginBottom: "5px",
                      }}
                    >
                      <strong
                        style={{
                          color: "#334155",
                          fontSize: "13px",
                        }}
                      >
                        {comment.user?.name ||
                          "User"}
                      </strong>

                      <span
                        style={{
                          color: "#94a3b8",
                          fontSize: "11px",
                        }}
                      >
                        {new Date(
                          comment.createdAt
                        ).toLocaleString()}
                      </span>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        color: "#475569",
                        fontSize: "13px",
                        lineHeight: "1.5",
                      }}
                    >
                      {comment.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            <form
              onSubmit={addComment}
              style={{
                padding: "18px 25px",
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                gap: "10px",
              }}
            >
              <input
                type="text"
                value={commentText}
                onChange={(e) =>
                  setCommentText(e.target.value)
                }
                placeholder="Write a comment..."
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "9px",
                  outline: "none",
                }}
              />

              <button
                type="submit"
                style={{
                  padding: "12px 18px",
                  background:
                    "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  color: "white",
                  border: "none",
                  borderRadius: "9px",
                  fontWeight: "700",
                }}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectBoard;