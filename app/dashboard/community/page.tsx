"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
// Removed useTheme import as it's handled by ThemeToggle internally or not needed if only for toggle
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
    IconHeart, IconMessageCircle, IconUsers, IconMessage, IconSend,
    IconPhoto, IconX, IconEdit, IconTrash, IconDots, IconMoodSmile, IconArrowBackUp, IconSearch,
    IconThumbUp, IconMoodHappy, IconMoodSad, IconMoodAngry, IconCheck, IconMoon, IconSun
} from "@tabler/icons-react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

// --- Types ---
interface Comment { id: string; userEmail: string; userName: string; text: string; date: string; }
interface Post {
    id: string;
    userEmail: string;
    userName: string;
    userRole: string;
    content: string;
    image?: string;
    likes: string[];
    comments: Comment[];
    date: string;
}
interface Message {
    id: string;
    sender: string;
    receiver: string;
    content: string;
    timestamp: string;
    read?: boolean;
    reaction?: string;
    replyToId?: string;
    edited?: boolean;
}
interface SocialUser { name: string; email: string; role: string; followers: string[]; following: string[]; }

export default function CommunityPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<"feed" | "network" | "messages">("feed");
    const [isClient, setIsClient] = useState(false);

    // Feed State
    const [posts, setPosts] = useState<Post[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [editingPostId, setEditingPostId] = useState<string | null>(null);

    // Network State
    const [users, setUsers] = useState<SocialUser[]>([]);
    const [networkFilter, setNetworkFilter] = useState<"all" | "following" | "followers">("all");

    // Messages State
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedChatUser, setSelectedChatUser] = useState<string | null>(null);
    const [msgInput, setMsgInput] = useState("");
    const [replyTo, setReplyTo] = useState<Message | null>(null);
    const [editingMsgId, setEditingMsgId] = useState<string | null>(null); // New: Edit Message State

    const pollingRef = useRef<NodeJS.Timeout | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => { setIsClient(true); }, []);

    useEffect(() => {
        if (!isClient) return;
        fetchPosts();
        fetchUsers();
        pollingRef.current = setInterval(() => {
            if (user && activeTab === "messages") fetchMessages();
        }, 3000);
        return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
    }, [user, activeTab, isClient]);

    useEffect(() => {
        if (activeTab === 'messages' && isClient) scrollToBottom();
    }, [messages.length, selectedChatUser, activeTab, isClient]);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // --- API Calls ---
    const fetchPosts = async () => {
        setLoadingPosts(true);
        try { const res = await fetch("/api/community/posts"); setPosts(await res.json()); }
        catch (e) { } finally { setLoadingPosts(false); }
    };

    const fetchUsers = async () => {
        try { const res = await fetch("/api/users"); setUsers(await res.json()); } catch (e) { }
    };

    const fetchMessages = async () => {
        if (!user) return;
        try { const res = await fetch(`/api/messages?email=${user.email}`); setMessages(await res.json()); } catch (e) { }
    };

    // --- Actions ---
    const handleFollow = async (targetEmail: string) => {
        if (!user) return;
        setUsers(prev => prev.map(u => {
            if (u.email === targetEmail) {
                const isFollowing = u.followers.includes(user.email);
                return { ...u, followers: isFollowing ? u.followers.filter(e => e !== user.email) : [...u.followers, user.email] };
            }
            if (u.email === user.email) {
                const followingTarget = u.following.includes(targetEmail);
                return { ...u, following: followingTarget ? u.following.filter(e => e !== targetEmail) : [...u.following, targetEmail] };
            }
            return u;
        }));
        await fetch("/api/users/follow", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userEmail: user.email, targetEmail })
        });
    };

    const handleCreatePost = async (content: string, image?: string) => {
        if (!user) return;
        await fetch("/api/community/posts", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userEmail: user.email, userName: user.name || "Farmer", userRole: "farmer", content, image })
        });
        fetchPosts();
    };

    const handleLike = async (postId: string) => {
        if (!user) return;

        // Optimistic Update
        const previousPosts = [...posts];
        setPosts(prev => prev.map(p => p.id === postId ? {
            ...p, likes: p.likes.includes(user.email) ? p.likes.filter(e => e !== user.email) : [...p.likes, user.email]
        } : p));

        try {
            const res = await fetch("/api/community/posts/like", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId, userEmail: user.email })
            });

            if (!res.ok) {
                throw new Error("Failed to like post");
            }
        } catch (error) {
            console.error("Like failed, reverting:", error);
            setPosts(previousPosts); // Revert on error
            alert("Failed to save like. Please try again.");
        }
    };

    const handleDeletePost = async (postId: string) => {
        if (!user || !confirm("Delete this post?")) return;
        setPosts(prev => prev.filter(p => p.id !== postId));
        await fetch(`/api/community/posts?id=${postId}&userEmail=${user.email}`, { method: "DELETE" });
    };

    const handleComment = async (postId: string, text: string) => {
        if (!user) return;
        const newComment: Comment = { id: Date.now().toString(), userEmail: user.email, userName: user.name || "User", text, date: new Date().toISOString() };
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
        await fetch("/api/community/posts/comment", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId, userEmail: user.email, userName: user.name, text })
        });
    };

    const handleDeleteComment = async (postId: string, commentId: string) => {
        if (!user || !confirm("Delete this comment?")) return;
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments.filter(c => c.id !== commentId) } : p));
        await fetch(`/api/community/posts/comment?postId=${postId}&commentId=${commentId}&userEmail=${user.email}`, { method: "DELETE" });
    };

    const handleEditPost = async (postId: string, content: string) => {
        if (!user) return;
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, content } : p));
        setEditingPostId(null);
        await fetch(`/api/community/posts`, {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId, content, userEmail: user.email })
        });
    };

    const handleEditComment = async (postId: string, commentId: string, text: string) => {
        if (!user) return;
        setPosts(prev => prev.map(p => p.id === postId ? {
            ...p, comments: p.comments.map(c => c.id === commentId ? { ...c, text } : c)
        } : p));
        await fetch("/api/community/posts/comment", {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId, commentId, userEmail: user.email, text })
        });
    };

    const handleJoinChat = (targetUserEmail: string) => {
        setSelectedChatUser(targetUserEmail);
        setActiveTab("messages");
        fetchMessages();
    };

    const handleSendMessage = async () => {
        if (!user || !selectedChatUser || !msgInput.trim()) return;
        const optimisticMsg: Message = {
            id: Date.now().toString(), sender: user.email, receiver: selectedChatUser, content: msgInput, timestamp: new Date().toISOString(), replyToId: replyTo?.id
        };
        setMessages(prev => [...prev, optimisticMsg]);
        setMsgInput("");
        setReplyTo(null);
        scrollToBottom();
        await fetch("/api/messages", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sender: user.email, receiver: selectedChatUser, content: optimisticMsg.content, replyToId: optimisticMsg.replyToId })
        });
        fetchMessages(); // Sync
    };

    const handleMessageReaction = async (msgId: string, reaction: string) => {
        if (!user) return;
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, reaction: m.reaction === reaction ? undefined : reaction } : m));
        await fetch(`/api/messages/${msgId}`, {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userEmail: user.email, reaction })
        });
    };

    const handleDeleteMessage = async (msgId: string) => {
        if (!user || !confirm("Delete this message?")) return;
        setMessages(prev => prev.filter(m => m.id !== msgId));
        await fetch(`/api/messages/${msgId}?userEmail=${user.email}`, { method: "DELETE" });
    };

    const handleEditMessage = async (msgId: string, content: string) => {
        if (!user) return;
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, content, edited: true } : m));
        setEditingMsgId(null);
        await fetch(`/api/messages/${msgId}`, {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userEmail: user.email, content })
        });
    };

    const handleDeleteChat = async () => {
        if (!confirm("Are you sure you want to delete this entire conversation?")) return;
        setMessages(prev => prev.filter(m => !((m.sender === user?.email && m.receiver === selectedChatUser) || (m.sender === selectedChatUser && m.receiver === user?.email))));
    };

    // --- Network Filter Logic ---
    const filteredUsers = users.filter(u => {
        if (u.email === user?.email) return false;
        if (networkFilter === "following") return u.followers.includes(user?.email || "");
        if (networkFilter === "followers") return u.following.includes(user?.email || "");
        return true;
    });

    if (!isClient) return <div className="min-h-screen bg-gray-50 dark:bg-neutral-900" />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 text-neutral-900 dark:text-gray-100 font-sans transition-colors duration-300">
            <header className="sticky top-0 z-40 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 shadow-sm transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
                            <IconUsers className="text-white w-5 h-5" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-neutral-900 dark:text-white">AgroNova Community</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <nav className="hidden md:flex space-x-1 bg-gray-100 dark:bg-neutral-800 p-1 rounded-lg">
                            {(["feed", "network", "messages"] as const).map(tab => (
                                <button key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab ? "bg-white dark:bg-neutral-700 text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"}`}
                                >
                                    <span className="capitalize">{tab}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
                {/* Mobile Nav */}
                <div className="md:hidden flex justify-center pb-2 px-2">
                    <nav className="flex space-x-1 bg-gray-100 dark:bg-neutral-800 p-1 rounded-lg w-full justify-between">
                        {(["feed", "network", "messages"] as const).map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === tab ? "bg-white dark:bg-neutral-700 text-green-600 shadow-sm" : "text-gray-500"}`}>
                                <span className="capitalize">{tab}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === "feed" && (
                            <div className="max-w-2xl mx-auto space-y-6">
                                <CreatePostWidget user={user} refresh={fetchPosts} onPost={handleCreatePost} />
                                <div className="space-y-4">
                                    {loadingPosts ? (
                                        <div className="space-y-4">
                                            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-200 dark:bg-neutral-800 rounded-xl animate-pulse" />)}
                                        </div>
                                    ) : posts.length === 0 ? (
                                        <div className="text-center py-20 text-gray-500">No posts yet. Be the first to share!</div>
                                    ) : (
                                        posts.map(post => (
                                            <PostCard
                                                key={post.id} post={post} user={user}
                                                onLike={() => handleLike(post.id)}
                                                onDelete={() => handleDeletePost(post.id)}
                                                onComment={handleComment}
                                                onDeleteComment={handleDeleteComment}
                                                onEdit={handleEditPost}
                                                onEditComment={handleEditComment}
                                                isEditing={editingPostId === post.id}
                                                setEditingPostId={setEditingPostId}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "network" && (
                            <div className="space-y-6">
                                <div className="flex justify-center gap-2 mb-6">
                                    {(["all", "following", "followers"] as const).map(f => (
                                        <button
                                            key={f} onClick={() => setNetworkFilter(f)}
                                            className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-colors ${networkFilter === f ? "bg-green-600 text-white" : "bg-white dark:bg-neutral-800 text-gray-500 border border-gray-200 dark:border-neutral-700"}`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredUsers.map(u => (
                                        <UserCard key={u.email} user={u} currentUser={user} onFollow={() => handleFollow(u.email)} onChat={() => handleJoinChat(u.email)} />
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <div className="col-span-full text-center py-20 text-gray-500">No users found in this list.</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "messages" && (
                            <div className="h-[calc(100vh-140px)] bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl overflow-hidden flex shadow-sm">
                                <div className={`w-full md:w-80 border-r border-gray-200 dark:border-neutral-800 flex flex-col bg-gray-50 dark:bg-neutral-900 ${selectedChatUser ? "hidden md:flex" : "flex"}`}>
                                    <div className="p-4 border-b border-gray-200 dark:border-neutral-800">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Messages</h2>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                        {users.filter(u => u.email !== user?.email).map(u => (
                                            <button key={u.email} onClick={() => setSelectedChatUser(u.email)}
                                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${selectedChatUser === u.email ? "bg-green-100 dark:bg-neutral-800 text-green-900 dark:text-white" : "hover:bg-gray-100 dark:hover:bg-neutral-800"}`}
                                            >
                                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300">
                                                    {u.name[0]}
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <div className="font-medium text-gray-900 dark:text-white">{u.name}</div>
                                                    <div className="text-xs text-gray-500 capitalize">{u.role}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className={`flex-1 flex flex-col bg-white dark:bg-neutral-900 ${!selectedChatUser ? "hidden md:flex" : "flex"}`}>
                                    {selectedChatUser ? (
                                        <>
                                            <div className="h-16 px-6 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-neutral-900">
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => setSelectedChatUser(null)} className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full"><IconArrowBackUp size={20} /></button>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-gray-900 dark:text-white">{users.find(u => u.email === selectedChatUser)?.name || selectedChatUser}</span>
                                                        <span className="text-xs text-green-600 flex items-center gap-1">Online</span>
                                                    </div>
                                                </div>
                                                <button onClick={handleDeleteChat} className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800" title="Delete Chat">
                                                    <IconTrash size={20} />
                                                </button>
                                            </div>
                                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                                {messages.filter(m => (m.sender === user?.email && m.receiver === selectedChatUser) || (m.sender === selectedChatUser && m.receiver === user?.email))
                                                    .map(msg => (
                                                        <MessageBubble
                                                            key={msg.id} message={msg} isMe={msg.sender === user?.email}
                                                            replyContent={msg.replyToId ? messages.find(m => m.id === msg.replyToId)?.content : undefined}
                                                            onReply={() => setReplyTo(msg)}
                                                            onReact={(r: string) => handleMessageReaction(msg.id, r)}
                                                            onDelete={() => handleDeleteMessage(msg.id)}
                                                            onEdit={(content: string) => handleEditMessage(msg.id, content)}
                                                            isEditing={editingMsgId === msg.id}
                                                            setEditingMsgId={setEditingMsgId}
                                                        />
                                                    ))}
                                                <div ref={messagesEndRef} />
                                            </div>
                                            <div className="p-4 border-t border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900">
                                                {replyTo && (
                                                    <div className="mb-2 p-2 bg-gray-200 dark:bg-neutral-800 border-l-2 border-green-500 rounded text-sm flex justify-between items-center text-gray-600 dark:text-gray-300">
                                                        <span className="truncate">Replying to: {replyTo.content.substring(0, 50)}...</span>
                                                        <button onClick={() => setReplyTo(null)}><IconX size={14} /></button>
                                                    </div>
                                                )}
                                                <div className="flex gap-2">
                                                    <input
                                                        value={msgInput} onChange={e => setMsgInput(e.target.value)}
                                                        onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                                                        placeholder="Type your message..."
                                                        className="flex-1 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
                                                    />
                                                    <button onClick={handleSendMessage} className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-transform active:scale-95 disabled:opacity-50" disabled={!msgInput.trim()}>
                                                        <IconSend size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
                                            <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center"><IconMessageCircle size={32} /></div>
                                            <p>Select a user to chat</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}

// --- Components ---

const CreatePostWidget = ({ user, refresh, onPost }: any) => {
    const [content, setContent] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm">
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-neutral-800 flex items-center justify-center text-green-700 dark:text-green-400 font-bold">
                    {user?.name?.[0] || "U"}
                </div>
                <div className="flex-1">
                    <textarea
                        value={content} onChange={e => setContent(e.target.value)}
                        placeholder="What's happening?"
                        className="w-full bg-transparent border-none focus:ring-0 resize-none outline-none text-base placeholder-gray-400 dark:placeholder-neutral-600 min-h-[80px] text-gray-900 dark:text-white"
                    />
                    {image && (
                        <div className="relative mb-2 w-full h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700">
                            <Image src={image} alt="Preview" fill className="object-cover" />
                            <button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"><IconX size={16} /></button>
                        </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-neutral-800 mt-2">
                        <div className="flex gap-2">
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                            <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full text-green-600"><IconPhoto size={18} /></button>
                        </div>
                        <button onClick={() => { onPost(content, image); setContent(""); setImage(null); }} disabled={!content.trim() && !image} className="px-4 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-full hover:bg-green-700 disabled:opacity-50">Post</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

function PostCard({ post, user, onLike, onDelete, onComment, onDeleteComment, onEdit, onEditComment, isEditing, setEditingPostId }: any) {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [editContent, setEditContentState] = useState(post.content);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editCommentText, setEditCommentText] = useState("");
    const [isLiking, setIsLiking] = useState(false); // Local loading state

    const handleLikeClick = async () => {
        if (isLiking) return;
        setIsLiking(true);
        try {
            await onLike();
        } finally {
            setIsLiking(false);
        }
    };

    return (
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4 md:p-6">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                            {post.userName?.[0]}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900 dark:text-white">{post.userName}</span>
                                {post.userRole === "expert" && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-[10px] rounded uppercase font-bold">Expert</span>}
                            </div>
                            <div className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString()}</div>
                        </div>
                    </div>
                    {user?.email === post.userEmail && (
                        <div className="flex items-center gap-1">
                            <button onClick={() => { setEditingPostId(post.id); setEditContentState(post.content); }} className="p-1.5 text-gray-400 hover:text-green-600 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"><IconEdit size={16} /></button>
                            <button onClick={onDelete} className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"><IconTrash size={16} /></button>
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <div className="space-y-3 mb-4">
                        <textarea value={editContent} onChange={e => setEditContentState(e.target.value)} className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-3 text-gray-900 dark:text-white" rows={3} />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setEditingPostId(null)} className="px-3 py-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white">Cancel</button>
                            <button onClick={() => onEdit(post.id, editContent)} className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg">Save</button>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-wrap leading-relaxed text-base">{post.content}</p>
                )}

                {post.image && <div className="mb-4 rounded-lg overflow-hidden border border-gray-100 dark:border-neutral-800 relative h-64 w-full"><Image src={post.image} alt="Post" fill className="object-cover" /></div>}

                <div className="flex items-center gap-6 pt-3 border-t border-gray-100 dark:border-neutral-800">
                    <button onClick={handleLikeClick} disabled={isLiking} className={`flex items-center gap-2 text-sm font-medium transition-colors ${post.likes.includes(user?.email || "") ? "text-pink-500" : "text-gray-500 hover:text-pink-500"} ${isLiking ? "opacity-50 cursor-not-allowed" : ""}`}>
                        <IconHeart size={18} className={post.likes.includes(user?.email || "") ? "fill-current" : ""} /> <span>{post.likes.length}</span>
                    </button>
                    <button onClick={() => setShowComments(!showComments)} className={`flex items-center gap-2 text-sm font-medium transition-colors ${showComments ? "text-green-600" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}>
                        <IconMessage size={18} /> <span>{post.comments?.length || 0}</span>
                    </button>
                </div>

                <AnimatePresence>
                    {showComments && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="mt-4 space-y-3 pt-3 bg-white dark:bg-neutral-900 -mx-6 px-6 pb-4 border-t border-gray-100 dark:border-neutral-800">
                                {post.comments?.map((comment: any) => (
                                    <div key={comment.id} className="flex gap-2.5">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300 shrink-0">{comment.userName[0]}</div>
                                        <div className="flex-1">
                                            {editingCommentId === comment.id ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        value={editCommentText}
                                                        onChange={e => setEditCommentText(e.target.value)}
                                                        className="flex-1 bg-gray-100 dark:bg-neutral-800 border-none rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                                                        autoFocus
                                                        onKeyDown={e => { if (e.key === "Enter") { onEditComment(post.id, comment.id, editCommentText); setEditingCommentId(null); } }}
                                                    />
                                                    <button onClick={() => { onEditComment(post.id, comment.id, editCommentText); setEditingCommentId(null); }} className="text-green-600 hover:text-green-700"><IconCheck size={14} /></button>
                                                    <button onClick={() => setEditingCommentId(null)} className="text-red-500 hover:text-red-700"><IconX size={14} /></button>
                                                </div>
                                            ) : (
                                                <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl rounded-tl-none px-3 py-2 shadow-sm border border-gray-100 dark:border-neutral-700 relative group">
                                                    <div className="flex justify-between items-baseline">
                                                        <span className="text-xs font-bold text-gray-900 dark:text-white">{comment.userName}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] text-gray-400">{new Date(comment.date).toLocaleDateString()}</span>
                                                            {user?.email === comment.userEmail && (
                                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button onClick={() => { setEditingCommentId(comment.id); setEditCommentText(comment.text); }} className="text-[10px] text-gray-400 hover:text-blue-500"><IconEdit size={12} /></button>
                                                                    <button onClick={() => onDeleteComment(post.id, comment.id)} className="text-[10px] text-red-500 hover:text-red-700"><IconTrash size={12} /></button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{comment.text}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div className="flex gap-2 mt-3 items-center">
                                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-green-700 dark:text-green-400 shrink-0">{user?.name?.[0] || "U"}</div>
                                    <div className="flex-1 flex gap-2 relative">
                                        <input value={commentText} onChange={e => setCommentText(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && commentText.trim()) { onComment(post.id, commentText); setCommentText(""); } }} placeholder="Write a comment..." className="w-full bg-gray-100 dark:bg-neutral-800 border-none rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-900 dark:text-white" />
                                        <button onClick={() => { if (commentText.trim()) { onComment(post.id, commentText); setCommentText(""); } }} disabled={!commentText.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-700 disabled:opacity-50 p-1"><IconSend size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function UserCard({ user, onFollow, currentUser, onChat }: any) {
    const isFollowing = user.followers.includes(currentUser?.email || "");
    return (
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-6 flex flex-col items-center gap-4 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-300">{user.name[0]}</div>
            <div className="text-center">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{user.name}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{user.role}</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
                <span><strong className="text-gray-900 dark:text-white">{user.followers.length}</strong> Followers</span>
                <span><strong className="text-gray-900 dark:text-white">{user.following.length}</strong> Following</span>
            </div>
            <div className="flex gap-2 w-full mt-2">
                <button onClick={onFollow} className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all ${isFollowing ? "bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white hover:bg-gray-200" : "bg-green-600 text-white hover:bg-green-700"}`}>{isFollowing ? "Following" : "Follow"}</button>
                <button onClick={onChat} className="p-2 rounded-lg bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 hover:text-green-600 transition-colors"><IconMessage size={18} /></button>
            </div>
        </div>
    );
}

function MessageBubble({ message, isMe, onReply, replyContent, onReact, onDelete, onEdit, isEditing, setEditingMsgId }: any) {
    const [editContent, setEditContent] = useState(message.content);

    return (
        <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} relative group`}>
            {replyContent && <div className={`text-xs text-gray-400 mb-1 px-2 border-l-2 ${isMe ? "border-green-500/50 text-right pr-2" : "border-gray-300 pl-2"}`}>Replying to: {replyContent.substring(0, 30)}...</div>}
            <div className={`max-w-[80%] relative group/bubble w-full md:w-auto`}>
                {!isEditing && (
                    <div className={`absolute -top-8 ${isMe ? "right-0" : "left-0"} hidden group-hover/bubble:flex items-center gap-1 bg-white dark:bg-neutral-800 shadow-md border border-gray-200 dark:border-neutral-700 rounded-full px-2 py-1 z-10`}>
                        <button onClick={onReply} className="p-1 text-gray-500 hover:text-green-600" title="Reply"><IconArrowBackUp size={14} /></button>
                        <div className="flex items-center border-l border-r border-gray-200 dark:border-neutral-700 mx-1 px-1 gap-1">
                            {["👍", "❤️", "😂"].map(r => <button key={r} onClick={() => onReact(r)} className="hover:scale-125 transition-transform">{r}</button>)}
                        </div>
                        {isMe && (
                            <>
                                <button onClick={() => { setEditingMsgId(message.id); setEditContent(message.content); }} className="p-1 text-gray-500 hover:text-blue-500" title="Edit"><IconEdit size={14} /></button>
                                <button onClick={onDelete} className="p-1 text-gray-500 hover:text-red-500" title="Delete"><IconTrash size={14} /></button>
                            </>
                        )}
                    </div>
                )}

                {isEditing ? (
                    <div className="flex gap-2 items-center bg-white dark:bg-neutral-800 p-2 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm">
                        <input value={editContent} onChange={e => setEditContent(e.target.value)} className="bg-transparent border-none focus:outline-none text-sm w-full min-w-[200px]" autoFocus onKeyDown={e => { if (e.key === "Enter") onEdit(editContent); }} />
                        <button onClick={() => setEditingMsgId(null)} className="text-gray-400 hover:text-red-500"><IconX size={14} /></button>
                        <button onClick={() => onEdit(editContent)} className="text-green-600 hover:text-green-700"><IconCheck size={14} /></button>
                    </div>
                ) : (
                    <div className={`px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm border relative ${isMe ? "bg-green-600 text-white border-green-600 rounded-br-none" : "bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-neutral-700 rounded-bl-none"}`}>
                        {message.content}
                        <div className={`text-[10px] mt-1 text-right flex items-center justify-end gap-1 ${isMe ? "text-green-100" : "text-gray-400"}`}>
                            {message.edited && <span>(edited)</span>}
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        {message.reaction && <div className={`absolute -bottom-2 ${isMe ? "left-0" : "right-0"} bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-sm`}>{message.reaction}</div>}
                    </div>
                )}
            </div>
        </div>
    );
}
