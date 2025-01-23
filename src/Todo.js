import { useEffect, useState } from "react";

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);

    // Edit Inputs
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const apiUrl = "http://localhost:8000/api";

    const handleSubmit = () => {
        setError("");
        if (title.trim() === "" || description.trim() === "") {
            setError("Both title and description are required.");
            return;
        }

        fetch(`${apiUrl}/todos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description }),
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error("Unable to create Todo item.");
                }
            })
            .then((newTodo) => {
                setTodos([...todos, newTodo]);
                setTitle("");
                setDescription("");
                setMessage("Item added successfully!");
                setTimeout(() => setMessage(""), 3000);
            })
            .catch((err) => setError(err.message));
    };

    useEffect(() => {
        getItems();
    }, []);

    const getItems = () => {
        fetch(`${apiUrl}/todos`)
            .then((res) => res.json())
            .then((res) => setTodos(res))
            .catch(() => setError("Unable to fetch items."));
    };

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    };

    const handleUpdate = () => {
        if (editTitle.trim() === "" || editDescription.trim() === "") {
            setError("Both title and description are required for updating.");
            return;
        }

        fetch(`${apiUrl}/todos/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: editTitle, description: editDescription }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Unable to update Todo item.");

                const updatedTodos = todos.map((item) => {
                    if (item._id === editId) {
                        item.title = editTitle;
                        item.description = editDescription;
                    }
                    return item;
                });

                setTodos(updatedTodos);
                setEditId(-1);
                setEditTitle("");
                setEditDescription("");
                setMessage("Item updated successfully!");
                setTimeout(() => setMessage(""), 3000);
            })
            .catch((err) => setError(err.message));
    };

    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        fetch(`${apiUrl}/todos/${id}`, { method: "DELETE" })
            .then(() => {
                setTodos(todos.filter((item) => item._id !== id));
                setMessage("Item deleted successfully!");
                setTimeout(() => setMessage(""), 3000);
            })
            .catch(() => setError("Unable to delete item."));
    };

    const toggleCompleted = (id, completed) => {
        fetch(`${apiUrl}/todos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: !completed }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Unable to update task status.");

                const updatedTodos = todos.map((item) => {
                    if (item._id === id) {
                        item.completed = !completed;
                    }
                    return item;
                });

                setTodos(updatedTodos);
            })
            .catch(() => setError("Unable to update task status."));
    };

    return (
        <div className="container mt-4">
            <div className="row p-3 bg-success text-light text-center">
                <h1>Todo App with MERN Stack</h1>
            </div>
            <div className="row mt-4">
                <h3>Add New Todo</h3>
                {message && <p className="text-success">{message}</p>}
                {error && <p className="text-danger">{error}</p>}
                <div className="form-group d-flex gap-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <button className="btn btn-dark" onClick={handleSubmit}>
                        Add
                    </button>
                </div>
            </div>
            <div className="row mt-4">
                <h3>Active Todos</h3>
                <ul className="list-group">
                    {todos
                        .filter((todo) => !todo.completed)
                        .map((todo) => (
                            <li
                                key={todo._id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    {editId === todo._id ? (
                                        <>
                                            <input
                                                type="text"
                                                className="form-control my-1"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                className="form-control my-1"
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <strong>{todo.title}</strong>
                                            <p>{todo.description}</p>
                                        </>
                                    )}
                                </div>
                                <div>
                                    {editId === todo._id ? (
                                        <>
                                            <button
                                                className="btn btn-warning me-2"
                                                onClick={handleUpdate}
                                            >
                                                Update
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => setEditId(-1)}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="btn btn-warning me-2"
                                                onClick={() => handleEdit(todo)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-success me-2"
                                                onClick={() => toggleCompleted(todo._id, todo.completed)}
                                            >
                                                Complete
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDelete(todo._id)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                </ul>
            </div>
            <div className="row mt-4">
                <h3>Completed Todos</h3>
                <ul className="list-group">
                    {todos
                        .filter((todo) => todo.completed)
                        .map((todo) => (
                            <li
                                key={todo._id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <strong>{todo.title}</strong>
                                    <p>{todo.description}</p>
                                </div>
                                <div>
                                    <button
                                        className="btn btn-secondary me-2"
                                        onClick={() => toggleCompleted(todo._id, todo.completed)}
                                    >
                                        Mark Active
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(todo._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
}
