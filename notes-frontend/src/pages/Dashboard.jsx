import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNotes, createNote, updateNote, deleteNote as deleteNoteApi } from "../services/api";
import "./dashboard.css"

function Dashboard() {
    const [notes, setNotes] = useState([]);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
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
            await deleteNoteApi(id, token);
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
            localStorage.removeItem("user");
            navigate("/login");
        } else {
            setIsLoggingOut(true);
        }
    }

    return (
        <div className="dashboard">
            <div className="d1">
                <button className="buttons logoutButton" onClick={handleLogout}>{isLoggingOut ? "Confirm Logout" : "Logout"}</button>
                {isLoggingOut && <button className="buttons cancel" onClick={() => setIsLoggingOut(false)}>Cancel</button>}
                <button className="accDelButton buttons" onClick={() => navigate("/delete-account")}>Delete Account</button>
            </div>
            <div className="d2">
                <p id="greet">Hi {user.name || "there"},</p>
                <h1>Create Notes</h1>
                <form className="notesInputContainer" onSubmit={handleSubmit}>
                    <div className="subNotesInputContainer">
                        <h3>Title</h3>
                        <input type="text" placeholder="Title" value={title} onChange={(e) => { setTitle(e.target.value); setDashboardText(""); }} />
                    </div>
                    <div className="subNotesInputContainer">
                        <h3>Note</h3>
                        <textarea placeholder="Content" value={content} onChange={(e) => { setContent(e.target.value); setDashboardText(""); }} />
                    </div>
                    <div>
                        <button className="buttons submitButton" type="submit">
                            {editingNoteId ? "Update Note" : "Create Note"}
                        </button>
                        {editingNoteId && <button className="buttons cancel" type="button" onClick={() => {
                            setEditingNoteId(null);
                            setTitle("");
                            setContent("");
                        }}>Cancel</button>}
                    </div>
                </form>
                {dashboardText && <p className="Umy" style={{ color: dashboardType }}>{dashboardText}</p>}
            </div>
            <div className="d3">
                <h1>My Notes</h1>
                <input id="searchBar" type="text" placeholder="🔍 Search notes..." disabled={!notes.length} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <div className="notesList">
                    {filteredNotes.length > 0 ? filteredNotes.map(note => (
                        <div key={note.id}>
                            <h3>#{note.id}. {note.title}</h3>
                            <p className="notesContent">{note.content}</p>
                            <button className="buttons edit" onClick={() => {
                                setEditingNoteId(note.id);
                                setTitle(note.title);
                                setContent(note.content);
                            }}>Edit</button>
                            <button className="buttons delButton" disabled={editingNoteId === note.id} onClick={() => deleteNote(note.id)}>Delete</button>
                        </div>
                    )) : <>
                        <h3>No notes found</h3>
                        <p>Create your first note!</p>
                    </>}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;