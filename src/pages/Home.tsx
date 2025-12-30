import React, { useState, useEffect, useRef, useCallback } from "react";
import PostCard from "../components/Post";
import axios from "axios";
import { baseUrl } from "../baseUrl";
import { Link } from "react-router-dom";

// {
//     "friends": [
//         {
//             "_id": "691f315c3fc2a314dec44345",
//             "email": "pk2@gmail.com"
//         }
//     ]
// }
interface Friend {
  _id: string;
  name: string;
  email: string;
  profilePic?: string;
}

const Home = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);

  // --- NEW: STATE FOR CURRENT USER PROFILE PIC ---
  const [myProfilePic, setMyProfilePic] = useState(localStorage.getItem("profilePic") || "");

  // --- INFINITE SCROLL & PAGINATION STATE ---
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // --- INTERSECTION OBSERVER LOGIC ---
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // --- NEW: SYNC PROFILE PIC FROM DATABASE ON LOAD ---
  useEffect(() => {
    const syncUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${baseUrl}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const freshPic = res.data.user.profilePic;
        if (freshPic) {
          setMyProfilePic(freshPic);
          localStorage.setItem("profilePic", freshPic);
        }
      } catch (err) {
        console.error("Sync failed", err);
      }
    };
    syncUser();
  }, []);

  // --- GLOBAL POST UPDATE FUNCTION ---
  const handleUpdatePost = (updatedPostFromDB: any) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        const realIdInFeed = post._id.split("_page")[0];

        if (realIdInFeed === updatedPostFromDB._id) {
          return {
            ...post,
            likes: updatedPostFromDB.likes,
            comments: updatedPostFromDB.comments,
          };
        }
        return post;
      })
    );
  };

  // --- DELETE POST FUNCTION ---
  const handleDeletePostFromHome = async (postId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.delete(`${baseUrl}/post/delete/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete post.");
    }
  };

  // --- FETCH FEED FUNCTION ---
  const fetchFeed = async (pageNum: number) => {
    if (loading) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

const res = await axios.get(`${baseUrl}/post/feed?page=${pageNum}&limit=5`, {
  headers: { Authorization: `Bearer ${token}` },
});

if (pageNum === 1) {
  setPosts(res.data.posts); 
} else {
  setPosts((prevPosts) => [...prevPosts, ...res.data.posts]); 
}

setHasMore(res.data.pagination.hasMore);
    } catch (err) {
      console.error("Error fetching feed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed(page);
  }, [page]);

  // -------------------------------
  // CREATE POST FUNCTION
  // -------------------------------
  const handleCreatePost = async () => {
    if (!text.trim()) {
      alert("Post text is required");
      return;
    }

     const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in");
      return;
    }
     const formData = new FormData();
    formData.append("text", text);
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await axios.post(`${baseUrl}/post/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const newPostFromDB = res.data.post;

      setPosts([
        {
          ...newPostFromDB,
          user: {
            name: localStorage.getItem("username") || "User",
            // Uses the synced myProfilePic state
            profilePic: myProfilePic || "https://i.pravatar.cc/150"
          }
        },
        ...posts,
      ]);

      setText("");
      setImage(null);
    } catch (error: any) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to create post");
    }
  };

   const fetchFriends = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(`${baseUrl}/friendrequest/getFriends`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriends(res.data.friends);

      console.log(res.data.friends);
    } catch (error) {
      // Handle/log error if needed
      console.error("Failed to fetch friends", error);
    }
  };

  React.useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <div className="w-full h-screen bg-to-br from-gray-50 to-gray-100 flex">

       {/* LEFT PANEL */}
      <div className="w-64  bg-white border-r border-gray-200 p-4 shadow-sm">
        <div className="space-y-2">
          <Link to="/profile">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-linear-to-r hover:from-red-50 hover:to-rose-50 transition-all duration-300 group cursor-pointer">
              <div className="w-10 h-10 bg-linear-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-red-600 transition-colors">
                Profile
              </span>
            </div>
          </Link>
          <Link to="/friends">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-linear-to-r hover:from-red-50 hover:to-rose-50 transition-all duration-300 group cursor-pointer">
              <div className="w-10 h-10 bg-linear-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-users-icon lucide-users"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-red-600 transition-colors">
                Friends
              </span>
            </div>
          </Link>

          <Link to="/notification">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-linear-to-r hover:from-red-50 hover:to-rose-50 transition-all duration-300 group cursor-pointer">
              <div className="w-10 h-10 bg-linear-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-bell-icon lucide-bell"
                >
                  <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                  <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
                </svg>
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-red-600 transition-colors">
                Notifications
              </span>
            </div>
          </Link>
          <Link to="/settings">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-linear-to-r hover:from-red-50 hover:to-rose-50 transition-all duration-300 group cursor-pointer">
              <div className="w-10 h-10 bg-linear-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-settings-icon lucide-settings"
                >
                  <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-red-600 transition-colors">
                Settings
              </span>
            </div>
          </Link>
        </div>
      </div>


      {/* MIDDLE PANEL */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* CREATE POST UI */}
        <div className="bg-white rounded-2xl p-5 shadow-lg mb-6 border border-gray-100">
          <div className="flex items-center gap-4">
            {/* // User Avatar Placeholder */}

            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
              <img
                src={localStorage.getItem("profilePic") || "https://i.pravatar.cc/150?img=11"}
                alt="User Avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
            
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start a post..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) =>
                  setImage(e.target.files ? e.target.files[0] : null)
                }
              />
              <button className="text-gray-600 hover:text-gray-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-camera-icon lucide-camera"
                >
                  <path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </button>
              <button className="text-gray-600 hover:text-gray-800">🎥</button>
              <button className="text-gray-600 hover:text-gray-800">😊</button>
            </div>

            <button
              onClick={handleCreatePost}
              className="bg-red-500 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Post
            </button>
          </div>
        </div>

         {/* POSTS FEED */}
        <div className="flex flex-col gap-4 items-center">
          {posts.map((post, index) => {
            const isLast = posts.length === index + 1;
            const likesCount = Array.isArray(post.likes) ? post.likes.length : post.likes;

            return (
              <div 
                key={post._id || index} 
                ref={isLast ? lastPostElementRef : null} 
                className="w-full flex justify-center"
              >
                <PostCard
                  id={post._id}
                  profilePhoto={post.user?.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                  userName={post.user?.name || "Unknown User"}
                  caption={post.text}
                  likes={likesCount}
                  comments={post.comments}
                  comments_count={post.comments?.length || 0}
                  postImage={post.image}
                  onUpdate={handleUpdatePost}
                  onDelete={handleDeletePostFromHome}
                  isProfilePage={true}
                />
              </div>
            );
          })}
          {loading && <p className="text-red-500 font-bold p-4 text-center">Loading more posts...</p>}
        </div>
      </div>

      
      {/* RIGHT PANEL */}
      <div className="w-80 bg-white border-l border-gray-200 p-5 shadow-sm overflow-y-auto">
        <div className="flex items-center justify-between mb-5"></div>
        <h2 className="text-xl font-bold text-gray-800">Friends</h2>
        <span className="text-xs bg-linear-to-r from-red-600 to-rose-500 text-white px-3 py-1 rounded-full font-semibold">
          {friends ? friends.length : 0} Friends
        </span>
        <div className="mt-4 space-y-4 gap-3">
          {friends && friends.length > 0 ? (
        friends.map((friend) => (
          <Link key={friend._id} to={`/friend/${friend._id}`}>
            <div className="bg-gradient-to-r mt-3 from-white to-gray-50 hover:from-red-50 hover:to-rose-50 p-3 rounded-xl border border-gray-100 hover:border-red-200 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={friend.profilePic || "https://via.placeholder.com/40"}
                    alt={friend.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-red-200 transition-all"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
                    {friend.name}
                  </p>
                  <p className="text-xs text-gray-500">Active now</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No friends yet</p>
          <p className="text-gray-400 text-xs mt-1">Start connecting with people!</p>
        </div>
      )}
    </div>
  </div>
    </div>
  );
};

export default Home;