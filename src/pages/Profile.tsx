import react from 'react';
import PostCard from '../components/Post';
import axios from 'axios';

const Profile = () => {
const [image, setImage] = react.useState<File | null>(null);
  const [myPosts, setMyPosts] = react.useState([]);

react.useEffect(() => {
  const fetchMyPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        "http://localhost:5000/api/post/myposts",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMyPosts(res.data.posts);
    } catch (error: any) {
      console.log(error);
    }
  };

  fetchMyPosts();
}, []);


    const handleProfilePic = async () => {
   
  
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in");
        return;
      }
  
      const formData = new FormData();
     
      if (image) {
        formData.append("profilePic", image);
      }
  
      try {
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
  
        // Backend returns { post }
alert(`Profile picture updated successfully,${res.data.post}`);

        // Add new post to the top of feed
    
  
        // Reset fields
        
        setImage(null);
      } catch (error: any) {
        console.log(error);
        alert(error.response?.data?.message || "Failed to create post");
      }
    };

  return (
    <>
    <div className="w-full h-screen bg-gray-200 flex">
      {/* left pannel */}
    <div className="w-1/5 bg-white border-r p-4">
    <h2 className="text-xl font-bold mb-6">
      Profile
    </h2>
    <ul className="space-y-4 te">
      <li className="cursor-pointer hover:text-blue-600">
        My Posts
      </li>
    
           <li className="cursor-pointer hover:text-blue-600">
        Liked Posts
          </li>
           <li className="cursor-pointer hover:text-blue-600">
        Deleted Posts
          </li>
          
            <li className="cursor-pointer hover:text-blue-600">
        Settings
          </li>
    </ul>
    </div>
    {/* middle panel */}
    <div className="w-3/5 p-4 space-y-4 overflow-y-auto h-screen">
    {/* profile header */}
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <div className="flex items-center space-x-4">
              
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-blue-600 hover:scale-105 transition-transform object-cover"
        />
         <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) =>
                  setImage(e.target.files ? e.target.files[0] : null)
                }
              />
              <button
              onClick={handleProfilePic}
              >change profile pic</button>
        <div>
          <h1 className="text-2xl font-bold">John Doe</h1>
          <p className="text-gray-600">Web Developer & Designer</p>
          <p className="text-gray-600">San Francisco, CA</p>
        </div>
      </div>
    </div>
<div className="items-center flex flex-col gap-y-3">
    {/* posts */}
    {myPosts.map((post: any) => (
  <PostCard
    key={post._id}
    profilePhoto={post.user?.profilePic || "https://via.placeholder.com/150"}
    userName={post.user?.username || "Unknown User"}
    caption={post.text}
    likes={post.likes?.length || 0}
    comments={0}
    postImage={post.image}
  />
))}
    </div>
    </div>
    </div>
    </>
  )
};

export default Profile;