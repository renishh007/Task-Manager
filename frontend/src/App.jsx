import { useEffect, useState } from "react";
import {
  getTasks,
  updateTask,
  deleteTask,
} from "./services/api";

import TaskForm from "./components/TaskForm";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getTasks();
      setTasks(response.data.data);
    } catch (error) {
      console.log(error);
      setError("Unable to load tasks. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks when page loads
  useEffect(() => {
    fetchTasks();
  }, []);

  // Add new task to UI
  const handleTaskAdded = (newTask) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  // Mark task as completed
  const handleComplete = async (task) => {
    try {
      setError("");

      const response = await updateTask(task._id, {
        status: "completed",
      });

      setTasks((prevTasks) =>
        prevTasks.map((item) =>
          item._id === task._id
            ? response.data.data
            : item
        )
      );
    } catch (error) {
      console.log(error);
      setError("Unable to update task.");
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    try {
      setError("");

      await deleteTask(id);

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== id)
      );
    } catch (error) {
      console.log(error);
      setError("Unable to delete task.");
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) {
      return "No due date";
    }

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <h1 className="text-3xl font-bold">
            Task Manager
          </h1>

          <p className="mt-1 text-sm text-blue-100">
            Manage your tasks easily and efficiently
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-8">

        {/* Add Task */}
        <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-gray-800">
            Add New Task
          </h2>

          <TaskForm
            onTaskAdded={handleTaskAdded}
          />
        </section>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {/* Task Header */}
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-800">
            My Tasks
          </h2>

          <p className="text-sm text-gray-500">
            {tasks.length}{" "}
            {tasks.length === 1 ? "task" : "tasks"}
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">
              Loading tasks...
            </p>
          </div>
        ) : tasks.length === 0 ? (

          /* Empty State */
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-medium text-gray-500">
              No tasks available
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Add your first task using the form above.
            </p>
          </div>

        ) : (

          /* Task Cards */
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {tasks.map((task) => (
              <div
                key={task._id}
                className={`rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                  task.status === "completed"
                    ? "border-l-4 border-green-500"
                    : "border-l-4 border-blue-500"
                }`}
              >

                {/* Title + Status */}
                <div className="mb-3 flex items-start justify-between gap-3">

                  <h3
                    className={`text-lg font-bold ${
                      task.status === "completed"
                        ? "text-gray-400 line-through"
                        : "text-gray-800"
                    }`}
                  >
                    {task.title}
                  </h3>

                  <span
                    className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {task.status}
                  </span>

                </div>

                {/* Description */}
                <p className="mb-4 min-h-[48px] text-sm leading-6 text-gray-600">
                  {task.description || "No description"}
                </p>

                {/* Due Date */}
                <div className="mb-5 rounded-lg bg-gray-50 px-3 py-2">
                  <p className="text-xs text-gray-400">
                    Due Date
                  </p>

                  <p className="text-sm font-medium text-gray-700">
                    {formatDate(task.dueDate)}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">

                  {/* Complete */}
                  {task.status !== "completed" && (
                    <button
                      onClick={() => handleComplete(task)}
                      className="flex-1 rounded-lg bg-green-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-600 active:scale-95"
                    >
                      ✓ Complete
                    </button>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(task._id)}
                    className={`rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600 active:scale-95 ${
                      task.status === "completed"
                        ? "w-full"
                        : "flex-1"
                    }`}
                  >
                    🗑 Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-10 border-t bg-white py-5 text-center">
        <p className="text-sm text-gray-500">
          Task Manager © 2026
        </p>
      </footer>

    </div>
  );
}

export default App;