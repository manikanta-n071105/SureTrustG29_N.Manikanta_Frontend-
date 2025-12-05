import React, { useState } from "react";
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
  const [friends,setFriends] = useState<Friend[]>([]);

  const [posts, setPosts] = useState([
    {
      profilePhoto: "https://randomuser.me/api/portraits/men/32.jpg",
      userName: "John Doe",
      caption: "Enjoying the sunny weather!",
      likes: 120,
      comments: 15,
      postImage:
        "https://img.freepik.com/free-vector/night-landscape-with-lake-mountains-trees-coast-vector-cartoon-illustration-nature-scene-with-coniferous-forest-river-shore-rocks-moon-stars-dark-sky_107791-8253.jpg?semt=ais_hybrid&w=740&q=80",
    },
    {
      profilePhoto: "https://randomuser.me/api/portraits/women/44.jpg",
      userName: "Jane Smith",
      caption: "Delicious homemade meal.",
      likes: 95,
      comments: 8,
      postImage:
        "https://images.unsplash.com/photo-1485470733090-0aae1788d5af?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2FsbHBhcGVyJTIwNGt8ZW58MHx8MHx8fDA%3D",
    },
  ]);

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
      const res = await axios.post(
        "http://localhost:5000/api/post/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Backend returns { post }
      const newPostFromDB = res.data.post;

      // Add new post to the top of feed
      setPosts([
        {
          profilePhoto: "https://i.pravatar.cc/150?img=11",
          userName: "You",
          caption: newPostFromDB.text,
          likes: 0,
          comments: 0,
          postImage: newPostFromDB.image || "",
        },
        ...posts,
      ]);

      // Reset fields
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
    <div className="w-full h-screen bg-gray-300 flex">
      {/* LEFT PANEL */}
      <div className="w-1/5 bg-gray-100 border-2 p-4">
        <ul className="space-y-4 text-lg">
          <li className="mb-2 p-2 bg-white rounded shadow">Home 🛖</li>
          <li className="mb-2 p-2 bg-white rounded shadow">Profile 👤</li>
          <li className="mb-2 p-2 bg-white rounded shadow">Notification 🔔</li>
          <li className="mb-2 p-2 bg-white rounded shadow">Friends 👥</li>
          <li className="mb-2 p-2 bg-white rounded shadow">Setting ⚙</li>
        </ul>
      </div>

      {/* MIDDLE PANEL */}
      <div className="w-3/5 p-6 bg-gray-200 overflow-y-auto">

        {/* CREATE POST UI */}
        <div className="bg-white rounded-3xl p-4 shadow mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full" />

            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start a post..."
              className="w-full border rounded-full px-4 py-2 text-gray-700"
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
              <button className="text-gray-600 hover:text-gray-800">📷</button>
              <button className="text-gray-600 hover:text-gray-800">🎥</button>
              <button className="text-gray-600 hover:text-gray-800">😊</button>
            </div>

            <button
              onClick={handleCreatePost}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Post
            </button>
          </div>
        </div>

        {/* POSTS FEED */}
        <div className="flex flex-col gap-4 items-center">
          {posts.map((post, index) => (
            <PostCard
              key={index}
              profilePhoto={post.profilePhoto}
              userName={post.userName}
              caption={post.caption}
              likes={post.likes}
              comments={post.comments}
              postImage={post.postImage}
            />
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-1/5 bg-gray-100 border-2 p-4">
        <h2 className="text-xl font-bold mb-4">Friends</h2>
        <ul className="space-y-4">

          {friends.map((friend) => (
            <> 
            <Link key={friend._id} to={`/friend/${friend._id}`}>
            <div className="bg-white flex flex-col items-center p-2 rounded shadow">
              
            <img src={friend.profilePic||""} alt="" 
            className="w-10 h-10 rounded-full mb-2"
            />
                    <li
              key={friend._id}
              className="mb-2 p-2  rounded shadow"
            >
              {friend.name}
            </li>
             </div>  
             </Link>
            </>

          ))}
          {/* <li className="mb-2 p-2 bg-white rounded shadow">Alice</li> */}
       
        </ul>
      </div>
    </div>
  );
};

export default Home;
