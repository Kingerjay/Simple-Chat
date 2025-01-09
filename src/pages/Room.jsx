import React, { useState, useEffect } from 'react';
import client, { databases, DATABASE_ID, COLLECTION_ID_MESSAGES } from '../appwriteConfig';
import { ID, Query, Role, Permission } from 'appwrite';
import { Trash2 } from 'react-feather';
import Header from '../components/Header';
import { useAuth } from '../utils/AuthContext';

const Room = () => {
    const { user } = useAuth();

    const [messages, setMessages] = useState([]);
    const [messageBody, setMessageBody] = useState('');
    const [welcomeMessage, setWelcomeMessage] = useState(`Welcome ${user.name}`);
    const [messageOpacity, setMessageOpacity] = useState(1);

    useEffect(() => {
        // Gradually reduce the opacity and clear the message after 3 seconds
        const fadeOutDuration = 5000; // 3 seconds
        const interval = fadeOutDuration / 10; // Update every 300ms

        let opacityStep = 1 / (fadeOutDuration / interval);
        let currentOpacity = 1;

        const fadeOut = setInterval(() => {
            currentOpacity -= opacityStep;
            if (currentOpacity <= 0) {
                clearInterval(fadeOut);
                setWelcomeMessage('');
            } else {
                setMessageOpacity(currentOpacity);
            }
        }, interval);

        return () => {
            clearInterval(fadeOut); // Cleanup on component unmount
        };
    }, []);

    useEffect(() => {
        getMessages();

        const unsubscribe = client.subscribe(
            `databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
            (response) => {
                if (response.events.includes('databases.*.collections.*.documents.*.create')) {
                    setMessages((prevState) =>
                        [...prevState, response.payload].sort(
                            (a, b) => new Date(a.$createdAt) - new Date(b.$createdAt)
                        )
                    );
                }

                if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
                    setMessages((prevState) =>
                        prevState.filter((message) => message.$id !== response.payload.$id)
                    );
                }
            }
        );

        return () => {
            unsubscribe();
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let payload = {
            user_id: user.$id,
            username: user.name,
            body: messageBody,
        };

        let permissions = [Permission.write(Role.user(user.$id))];

        let response = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID_MESSAGES,
            ID.unique(),
            payload,
            permissions
        );

        setMessageBody('');
    };

    const getMessages = async () => {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_MESSAGES, [
            Query.orderAsc('$createdAt'),
            Query.limit(20),
        ]);
        setMessages(response.documents);
    };

    const deleteMessages = async (message_id) => {
        databases.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, message_id);
    };

    return (
        <main className="container">
            <Header />

            {welcomeMessage && (
                <div
                    className="welcome-message"
                    style={{ opacity: messageOpacity, transition: 'opacity 0.3s ease' }}
                >
                    {welcomeMessage}
                </div>
            )}

            <div className="room--container">
                <div>
                    {messages.map((message) => (
                        <div key={message.$id} className="message--wrapper">
                            <div className="message--header">
                                <p>
                                    {message?.username ? (
                                        <span>{message.username}</span>
                                    ) : (
                                        <span>Anonymous user</span>
                                    )}

                                    <small className="message-timestamp">
                                        {new Date(message.$createdAt).toLocaleString()}
                                    </small>
                                </p>

                                {message.$permissions.includes(`delete("user:${user.$id}")`) && (
                                    <Trash2
                                        className="delete--btn"
                                        onClick={() => {
                                            deleteMessages(message.$id);
                                        }}
                                    />
                                )}
                            </div>

                            <div className="message--body">
                                <span>{message.body}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} id="message--form">
                    <div>
                        <textarea
                            required
                            maxLength="1000"
                            placeholder="Your text here..."
                            onChange={(e) => {
                                setMessageBody(e.target.value);
                            }}
                            value={messageBody}
                        ></textarea>
                    </div>

                    <div className="send-btn--wrapper">
                        <input className="btn btn--secondary" type="submit" value="Send" />
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Room;
