import React, { useState } from "react";
import PostCard from "../components/Post";
import axios from "axios";

interface Post {
  id: string;
  profilePhoto: string;
  userName: string;
  caption: string;
  likes: number;
  comments: number;
  postImage: string;
}

const Profile: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);

  const [myPosts, setMyPosts] = useState<Post[]>([
    {
      id: "1",
      profilePhoto: "https://randomuser.me/api/portraits/men/32.jpg",
      userName: "John Doe",
      caption: "Enjoying the sunny weather!",
      likes: 120,
      comments: 15,
      postImage:
        "https://img.freepik.com/free-vector/night-landscape-with-lake-mountains-trees-coast-vector-cartoon-illustration-nature-scene-with-coniferous-forest-river-shore-rocks-moon-stars-dark-sky_107791-8253.jpg",
    },
    {
      id: "2",
      profilePhoto: "https://randomuser.me/api/portraits/women/44.jpg",
      userName: "Jane Smith",
      caption: "Delicious homemade meal.",
      likes: 95,
      comments: 8,
      postImage:
        "https://images.unsplash.com/photo-1485470733090-0aae1788d5af",
    },
  ]);

  // delete post
  const handleDeletePost = (postId: string) => {
    if (!window.confirm("Delete this post?")) return;

    setMyPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  // profile picture upload
  const handleProfilePic = async () => {
    const token = localStorage.getItem("token");
    if (!token || !image) return alert("Missing token or image");

    const formData = new FormData();
    formData.append("profilePic", image);

    try {
      await axios.post(
        "http://localhost:5000/api/user/uploadProfilePic",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Profile picture updated");
      setImage(null);
    } catch (err) {
      alert("Upload failed");
    }
  };

  return (
    <div className="w-full h-screen bg-gray-200 flex">
      {/* LEFT PANEL */}
      <div className="w-1/5 bg-white border-r p-4">
        <h2 className="text-xl font-bold mb-6">Profile</h2>
        <ul className="space-y-4">
          <li>My Posts</li>
          <li>Liked Posts</li>
          <li>Deleted Posts</li>
          <li>Settings</li>
        </ul>
      </div>

      {/* CENTER PANEL */}
      <div className="w-3/5 p-4 overflow-y-auto h-screen">
        {/* PROFILE HEADER */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex items-center gap-4">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              className="w-24 h-24 rounded-full"
              alt="profile"
            />
            <input
              type="file"
              onChange={(e) =>
                setImage(e.target.files ? e.target.files[0] : null)
              }
            />
            <button
              onClick={handleProfilePic}
              className="px-4 py-1 bg-blue-600 text-white rounded"
            >
              Change pic
            </button>
          </div>
        </div>

        {/* POSTS */}
        <div className="flex flex-col items-center gap-4">
          {myPosts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              profilePhoto={post.profilePhoto}
              userName={post.userName}
              caption={post.caption}
              likes={post.likes}
              comments={post.comments}
              postImage={post.postImage}
              isProfilePage={true}
              onDelete={handleDeletePost}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;