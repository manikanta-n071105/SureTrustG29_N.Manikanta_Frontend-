import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PostCard from "../components/Post";

interface ProfileResponse {
  user: {
    name: string;
    email: string;
    profilePic?: string;
  };
  counts: {
    friends: number;
    pendingRequests: number;
  };
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------------------------- Fetch profile ---------------------------- */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token");

        const res = await axios.get(
          "http://localhost:5000/api/user/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProfile(res.data);
        localStorage.setItem("name", res.data.user.name || "");
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* ---------------------------- Fetch my posts --------------------------- */
  const fetchMyPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        "http://localhost:5000/api/post/myposts",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMyPosts(res.data.posts || []);
    } catch (err) {
      console.error("Failed to fetch posts");
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  /* ----------------------- Profile picture upload ------------------------ */
  const handleProfilePicUpload = async () => {
    if (!image) return alert("Select an image first");

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const formData = new FormData();
      formData.append("profilePic", image);

      const res = await axios.post(
        "http://localhost:5000/api/user/uploadProfilePic",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              user: {
                ...prev.user,
                profilePic: res.data.user.profilePic,
              },
            }
          : prev
      );

      setImage(null);
      alert("Profile picture updated");
    } catch (err) {
      alert("Upload failed");
    }
  };

  /* ------------------------------ Delete post ---------------------------- */
  const handleDeletePost = async (postId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.delete(
        `http://localhost:5000/api/post/delete/${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMyPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      alert("Failed to delete post");
    }
  };

  /* ------------------------------ UI states ------------------------------ */
  if (loading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  if (error || !profile) {
    return (
      <p className="text-center text-red-600 mt-10">
        {error || "Something went wrong"}
      </p>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-200 flex">
      {/* LEFT PANEL */}
      <div className="w-1/5 bg-white border-r p-4">
        <h2 className="text-xl font-bold mb-6">Profile</h2>
        <ul className="space-y-4">
          <li>
            <Link to="/profile" className="hover:text-blue-600">
              My Posts
            </Link>
          </li>
          <li>
            <Link to="/liked-posts" className="hover:text-blue-600">
              Liked Posts
            </Link>
          </li>
          <li>
            <Link to="/deleted-posts" className="hover:text-blue-600">
              Deleted Posts
            </Link>
          </li>
          <li>
            <Link to="/settings" className="hover:text-blue-600">
              Settings
            </Link>
          </li>
             <li 
             onClick={()=>{
              localStorage.removeItem("token")
              localStorage.removeItem("profilePic")
              localStorage.removeItem("name")

             }}
             >
            <Link to="/login" className="hover:text-blue-600">
              Logout
            </Link>
          </li>
        </ul>
      </div>

      {/* CENTER PANEL */}
      <div className="w-3/5 p-4 overflow-y-auto h-screen">
        {/* PROFILE HEADER */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex items-center gap-4">
            <img
              src={
                profile.user.profilePic ||
                "https://via.placeholder.com/150"
              }
              alt="profile"
              className="w-24 h-24 rounded-full object-cover border"
            />

            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) =>
                  setImage(e.target.files ? e.target.files[0] : null)
                }
              />
              <button
                onClick={handleProfilePicUpload}
                className="bg-blue-600 text-white px-4 py-1 rounded"
              >
                Change profile pic
              </button>
            </div>

            <div className="ml-6">
              <h1 className="text-2xl font-bold">
                {profile.user.name}
              </h1>
              <p className="text-gray-600">
                {profile.user.email}
              </p>
              <p className="text-gray-600">
                Friends: {profile.counts.friends}
              </p>
              <p className="text-gray-600">
                Pending: {profile.counts.pendingRequests}
              </p>
            </div>
          </div>
        </div>

        {/* POSTS */}
        <div className="flex flex-col items-center gap-4">
          {myPosts.map((post) => (
            <PostCard
              key={post._id}
              id={post._id}
              profilePhoto={
                post.user?.profilePic ||
                "https://via.placeholder.com/150"
              }
              userName={
                localStorage.getItem("name") || "User"
              }
              caption={post.text}
              likes={post.likes?.length || 0}
              comments_count={post.comments?.length || 0}
              postImage={post.image}
              isProfilePage
              onDelete={handleDeletePost}
              comments={post.comments}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
