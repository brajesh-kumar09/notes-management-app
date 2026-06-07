import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNotes, createNote, updateNote, deleteNote } from "../services/api";

function Dashboard() {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [dashboardText, setDashboardText] = useState("");
    const [dashboardType, setDashboardType] = useState("green");
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const token = localStorage.getItem("token");
            //Api call to fetch notes
            const response = await getNotes(token);

            setNotes(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            setDashboardType("orange");
            setDashboardText("Title and content are required");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            if (editingNoteId) {
                //Api call to update note
                await updateNote(editingNoteId, { title, content }, token);
                setDashboardType("green");
                setDashboardText("Note updated successfully!");
                setTimeout(() => setDashboardText(""), 3000);
            } else {
                //Api call to create note
                await createNote({ title, content }, token);
                setDashboardType("green");
                setDashboardText("Note created successfully!");
                setTimeout(() => setDashboardText(""), 3000);
            }

            setTitle("");
            setContent("");
            setEditingNoteId(null);

            fetchNotes();
        } catch (error) {
            console.error(error);
            setDashboardType("red");
            setDashboardText("Error occurred while saving the note");
        }
    };

    const deleteNote = async (id) => {
        const confirmed = window.confirm(
            "Delete this note?"
        );
        if (!confirmed) return;

        try {
            const token = localStorage.getItem("token");
            //Api call to delete note
            await deleteNote(id, token);
            setDashboardType("gray");
            setDashboardText("Note deleted successfully!");
            setTimeout(() => setDashboardText(""), 3000);

            fetchNotes();
        } catch (error) {
            console.error(error);
        }
    };

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) || note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleLogout = () => {
        if (isLoggingOut) {
            localStorage.removeItem("token");
            navigate("/login");
        } else {
            setIsLoggingOut(true);
        }
    }

    return (
        <div>
            <button onClick={handleLogout}>{isLoggingOut ? "Confirm Logout" : "Logout"}</button>
            {isLoggingOut && <button onClick={() => setIsLoggingOut(false)}>Cancel</button>}
            <div>
                <button onClick={() => navigate("/delete-account")}>Delete Account</button>
            </div>
            <h1>My Notes</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <h5>Title</h5>
                    <input type="text" placeholder="Title" value={title} onChange={(e) => { setTitle(e.target.value); setDashboardText(""); }} />
                </div>
                <div>
                    <h5>Note</h5>
                    <textarea placeholder="Content" value={content} onChange={(e) => { setContent(e.target.value); setDashboardText(""); }} />
                </div>
                <button type="submit">
                    {editingNoteId ? "Update Note" : "Create Note"}
                </button>
                {editingNoteId && <button type="button" onClick={() => {
                    setEditingNoteId(null);
                    setTitle("");
                    setContent("");
                }}>Cancel</button>}
            </form>
            {dashboardText && <p style={{ color: dashboardType }}>{dashboardText}</p>}

            <hr />

            <input type="text" placeholder="Search notes" disabled={!notes.length} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

            {filteredNotes.length > 0 ? filteredNotes.map(note => (
                <div key={note.id}>
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                    <button onClick={() => {
                        setEditingNoteId(note.id);
                        setTitle(note.title);
                        setContent(note.content);
                    }}>Edit</button>
                    <button disabled={editingNoteId === note.id} onClick={() => deleteNote(note.id)}>Delete</button>
                </div>
            )) : <><h3>No notes found</h3> <p>Create your first note!</p></>}
        </div>
    );
}

export default Dashboard;