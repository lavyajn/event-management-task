import React, { useState, useEffect, useCallback } from 'react';
import './index.css';

const API_BASE_URL = 'https://event-management-api-n4ka.onrender.com';

function App() {
    const [events, setEvents] = useState([]);
    const [modal, setModal] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [toastMessage, setToastMessage] = useState('');

    const fetchEvents = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/events`);
            const data = await response.json();
            if(Array.isArray(data)) {
                setEvents(data);
            } else {
                setEvents([]);
            }
        } catch (error) {
            showToast('Could not fetch events.');
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 3000);
    };

    const openDetailsModal = async (event) => {
        try {
            const detailsRes = await fetch(`${API_BASE_URL}/events/${event.id}`);
            const statsRes = await fetch(`${API_BASE_URL}/events/${event.id}/stats`);
            
            if (!detailsRes.ok || !statsRes.ok) {
                throw new Error('Failed to fetch details');
            }
            
            const detailsData = await detailsRes.json();
            const statsData = await statsRes.json();
            setSelectedEvent({ ...detailsData, stats: statsData });
            setModal('details');
        } catch (error) {
             showToast('Error loading event details.');
        }
    };
    
    return (
        <>
            <div className="app-container">
                <header className="app-header">
                    <h1>Event Management Portal</h1>
                    <p>A simple interface for your event API.</p>
                </header>

                <div className="actions-container">
                    <button onClick={() => setModal('createUser')} className="btn btn-primary">
                        Create User
                    </button>
                    <button onClick={() => setModal('createEvent')} className="btn btn-primary">Create Event</button>
                    <button onClick={() => setModal('cancel')} className="btn btn-danger">Cancel Registration</button>
                </div>

                <main className="events-list-container">
                    <h2>Upcoming Events</h2>
                    {events.length > 0 ? (
                        <div className="events-grid">
                            {events.map(event => (
                                <div key={event.id} onClick={() => openDetailsModal(event)} className="event-card">
                                    <h3>{event.title}</h3>
                                    <p>{new Date(event.date).toLocaleString()}</p>
                                    <p>{event.location}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#6b7280' }}>No upcoming events found.</p>
                    )}
                </main>
            </div>

            {modal === 'createUser' && (
                <CreateUserModal 
                    showToast={showToast} 
                    onClose={() => setModal(null)} 
                />
            )}
            {modal === 'createEvent' && <CreateEventModal showToast={showToast} onClose={() => setModal(null)} onEventCreated={fetchEvents} />}
            {modal === 'cancel' && <CancelModal showToast={showToast} onClose={() => setModal(null)} />}
            {modal === 'details' && selectedEvent && (
                <DetailsModal 
                    event={selectedEvent} 
                    onClose={() => setModal(null)} 
                    showToast={showToast} 
                    refreshEvent={() => openDetailsModal(selectedEvent)} 
                />
            )}

            {toastMessage && <div className="toast">{toastMessage}</div>}
        </>
    );
}

const ModalWrapper = ({ title, onClose, children }) => (
    <div className="modal-overlay">
        <div className="modal-content">
            <div className="modal-header">
                <h2>{title}</h2>
                <button onClick={onClose} className="modal-close-btn">&times;</button>
            </div>
            {children}
        </div>
    </div>
);

function CreateUserModal({ onClose, showToast }) {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = { 
            name: e.target.name.value, 
            email: e.target.email.value 
        };
        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if(response.ok) {
                console.log(`User created! Your User ID is: ${data.UserId}\n\nPlease save this for actions like canceling a registration.`);
                showToast(data.message || 'User created!');
                onClose();
            } else {
                showToast(data.message || 'Failed to create user.');
            }
        } catch (error) {
            showToast('Network error.');
        }
    };
    
    return (
        <ModalWrapper title="Create New User" onClose={onClose}>
            <form onSubmit={handleSubmit} className="form">
                <input name="name" placeholder="Name" required className="form-input"/>
                <input name="email" type="email" placeholder="Email" required className="form-input"/>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </ModalWrapper>
    );
}

function CreateEventModal({ onClose, showToast, onEventCreated }) {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            title: e.target.title.value,
            date: e.target.date.value,
            location: e.target.location.value,
            capacity: parseInt(e.target.capacity.value, 10),
        };
        
        try {
            const response = await fetch(`${API_BASE_URL}/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            
            if (response.ok) {
                console.log("New Event Created! Event ID:", data.eventId);
                showToast(data.message || 'Event created!');
                onEventCreated();
                onClose();
            } else {
                showToast(data.message || 'Failed to create event.');
            }
        } catch (error) {
            showToast('Network error.');
        }
    };
    
    return (
        <ModalWrapper title="Create New Event" onClose={onClose}>
            <form onSubmit={handleSubmit} className="form">
                <input name="title" placeholder="Event Title" required className="form-input"/>
                <input name="date" type="datetime-local" placeholder="Date" required className="form-input"/>
                <input name="location" placeholder="Location" required className="form-input"/>
                <input name="capacity" type="number" placeholder="Capacity" required className="form-input"/>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </ModalWrapper>
    );
}

function CancelModal({ onClose, showToast }) {
     const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = e.target.userId.value;
        const eventId = e.target.eventId.value;
        
        try {
            const response = await fetch(`${API_BASE_URL}/registrations`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, eventId }),
            });
            const data = await response.json();
            
            if (response.ok) {
                showToast(data.message || 'Cancellation successful!');
                onClose();
            } else {
                showToast(data.message || 'Cancellation failed.');
            }
        } catch (error) {
            showToast('Network error.');
        }
    };
    
    return (
        <ModalWrapper title="Cancel a Registration" onClose={onClose}>
             <form onSubmit={handleSubmit} className="form">
                <input name="userId" placeholder="User ID to cancel" required className="form-input"/>
                <input name="eventId" placeholder="Event ID to cancel from" required className="form-input"/>
                <button type="submit" className="btn btn-danger">Confirm Cancellation</button>
            </form>
        </ModalWrapper>
    );
}

function DetailsModal({ event, onClose, showToast, refreshEvent }) {
    const [registerUserId, setRegisterUserId] = useState('');
    
    const handleRegister = async () => {
        if (!registerUserId) {
            showToast('Please provide a User ID.');
            return;
        }
        
        try {
             const response = await fetch(`${API_BASE_URL}/registrations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: registerUserId, eventId: event.id }),
            });
            const data = await response.json();
            
            if(response.ok) {
                showToast(data.message || 'Registration successful!');
                refreshEvent();
                setRegisterUserId('');
            } else {
                showToast(data.message || 'Registration failed.');
            }
        } catch(error) {
            showToast('Network error.');
        }
    };

    return (
        <ModalWrapper title={event.title} onClose={onClose}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: '#d1d5db' }}>
                <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Capacity:</strong> {event.stats.totalRegistrations} / {event.capacity}</p>
            </div>
            
            <div className="details-section">
                <h3>Register User</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                        value={registerUserId} 
                        onChange={e => setRegisterUserId(e.target.value)} 
                        placeholder="Paste User ID to register" 
                        className="form-input"
                    />
                    <button onClick={handleRegister} className="btn btn-primary">Register</button>
                </div>
            </div>
            
            <div className="details-section">
                <h3>Registered Users ({event.registeredUsers.length})</h3>
                <div className="registered-user-list">
                {event.registeredUsers.length > 0 ? (
                    event.registeredUsers.map(u => (
                        <p key={u.id} className="user-item">
                            {u.name} ({u.email})
                        </p>
                    ))
                ) : (
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        No users registered yet.
                    </p>
                )}
                </div>
            </div>
        </ModalWrapper>
    );
}

export default App;