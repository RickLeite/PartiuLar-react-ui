import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function ProfilePage() {
    const data = useLoaderData();
    const { updateUser, currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await apiRequest.post("/auth/logout");
            updateUser(null);
            localStorage.removeItem("user"); // Ensure localStorage is cleared
            navigate("/");
        } catch (err) {
            console.error("Error during logout:", err);
        }
    };

    // Early return if currentUser is not available
    if (!currentUser) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="profilePage">
            <div className="details">
                <div className="wrapper">
                    {/* User Information Section */}
                    <div className="title">
                        <h1>User Information</h1>
                        <Link to="/profile/update">
                            <button>Update Profile</button>
                        </Link>
                    </div>
                    <div className="info">
                        <span>
                            Avatar:
                            <img
                                src={currentUser.avatar || "/noavatar.jpg"}
                                alt={`${currentUser.username}'s avatar`}
                            />
                        </span>
                        <span>
                            Username: <b>{currentUser.username}</b>
                        </span>
                        <span>
                            Email: <b>{currentUser.email}</b>
                        </span>
                        {currentUser.phone && (
                            <span>
                                Phone: <b>{currentUser.phone}</b>
                            </span>
                        )}
                        {currentUser.gender && (
                            <span>
                                Gender: <b>{currentUser.gender}</b>
                            </span>
                        )}
                        <button onClick={handleLogout}>Logout</button>
                    </div>

                    {/* My Posts Section */}
                    <div className="title">
                        <h1>My Posts</h1>
                        <Link to="/add">
                            <button>Create New Post</button>
                        </Link>
                    </div>
                    <Suspense fallback={<div className="loading">Loading posts...</div>}>
                        <Await
                            resolve={data.postResponse}
                            errorElement={
                                <div className="error">
                                    Error loading posts. Please try again later.
                                </div>
                            }
                        >
                            {(postResponse) => {
                                const posts = postResponse?.data?.userPosts || [];
                                const stats = postResponse?.data?.stats || {};

                                return (
                                    <>
                                        {stats && (
                                            <div className="stats">
                                                <div className="stat-item">
                                                    <span>Total Posts:</span>
                                                    <b>{stats.totalPosts || 0}</b>
                                                </div>
                                                <div className="stat-item">
                                                    <span>Total Value:</span>
                                                    <b>${stats.totalValue?.toLocaleString() || 0}</b>
                                                </div>
                                                <div className="stat-item">
                                                    <span>Active Posts:</span>
                                                    <b>{stats.activePosts || 0}</b>
                                                </div>
                                            </div>
                                        )}
                                        {posts.length > 0 ? (
                                            <List posts={posts} />
                                        ) : (
                                            <div className="no-posts">
                                                <p>You don't have any posts yet.</p>
                                                <Link to="/add">
                                                    <button>Create First Post</button>
                                                </Link>
                                            </div>
                                        )}
                                    </>
                                );
                            }}
                        </Await>
                    </Suspense>

                    {/* Saved Posts Section */}
                    <div className="title">
                        <h1>Saved Posts</h1>
                    </div>
                    <Suspense fallback={<div className="loading">Loading saved posts...</div>}>
                        <Await
                            resolve={data.postResponse}
                            errorElement={
                                <div className="error">
                                    Error loading saved posts. Please try again later.
                                </div>
                            }
                        >
                            {(postResponse) => {
                                const savedPosts = postResponse?.data?.savedPosts || [];
                                return savedPosts.length > 0 ? (
                                    <List posts={savedPosts} />
                                ) : (
                                    <div className="no-posts">
                                        <p>You haven't saved any posts yet.</p>
                                        <Link to="/list">
                                            <button>Explore Posts</button>
                                        </Link>
                                    </div>
                                );
                            }}
                        </Await>
                    </Suspense>
                </div>
            </div>

            {/* Chat Section */}
            <div className="chatContainer">
                <div className="wrapper">
                    <Suspense fallback={<div className="loading">Loading chats...</div>}>
                        <Await
                            resolve={data.chatResponse}
                            errorElement={
                                <div className="error">
                                    Error loading chats. Please try again later.
                                </div>
                            }
                        >
                            {(chatResponse) => {
                                const chats = chatResponse?.data || [];
                                return chats.length > 0 ? (
                                    <Chat chats={chats} />
                                ) : (
                                    <div className="no-chats">
                                        <p>You don't have any conversations yet.</p>
                                    </div>
                                );
                            }}
                        </Await>
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;