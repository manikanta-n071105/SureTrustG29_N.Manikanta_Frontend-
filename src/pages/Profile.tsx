import React, { useState, useEffect } from 'react';
import PostCard from '../components/Post';
import axios from 'axios';

const Profile = () => {
  const [image, setImage] = useState<File | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch Profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please login again.');
          setLoading(false);
          return;
        }
        const res = await axios.get('http://localhost:5000/api/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Fetch MyPosts on mount or when needed
  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get('http://localhost:5000/api/post/myposts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyPosts(res.data.posts);
      } catch (error) {
        // Handle/log error if needed
      }
    };
    fetchMyPosts();
  }, []);

  // Handle profile picture upload
  const handleProfilePic = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Not logged in');
      return;
    }
    if (!image) {
      alert('No image selected');
      return;
    }
    const formData = new FormData();
    formData.append('profilePic', image);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/user/uploadProfilePic',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert('Profile picture updated successfully!');
      setProfile((prev: any) => ({
        ...prev,
        user: {
          ...prev.user,
          profilePic: res.data.user.profilePic,
        },
      }));
      setImage(null);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to upload');
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  if (error || !profile) {
    return (
      <p className="text-center text-red-600 mt-10">
        {error || 'Failed to load profile.'}
      </p>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-200 flex">
      <div className="w-1/5 bg-white border-r p-4">
        <h2 className="text-xl font-bold mb-6">Profile</h2>
        <ul className="space-y-4">
          <li className="cursor-pointer hover:text-blue-600">My Posts</li>
          <li className="cursor-pointer hover:text-blue-600">Liked Posts</li>
          <li className="cursor-pointer hover:text-blue-600">Deleted Posts</li>
          <li className="cursor-pointer hover:text-blue-600">Settings</li>
        </ul>
      </div>

      <div className="w-3/5 p-4 space-y-4 overflow-y-auto h-screen">
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={
                profile.user.profilePic ||
                'https://cdn-icons-png.flaticon.com/512/847/847969.png'
              }
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
              className="bg-blue-600 text-white px-4 py-1 rounded-lg"
            >
              Change profile pic
            </button>

            <div>
              <h1 className="text-2xl font-bold">{profile.user.name}</h1>
              <p className="text-gray-600">{profile.user.email}</p>
              <p className="text-gray-600">Friends: {profile.counts.friends}</p>
              <p className="text-gray-600">
                Pending: {profile.counts.pendingRequests}
              </p>
            </div>
          </div>
        </div>

        <div className="items-center flex flex-col gap-y-3">
          {myPosts.map((post: any) => (
            <PostCard
              key={post._id}
              profilePhoto={
                post.user?.profilePic || 'https://via.placeholder.com/150'
              }
              userName={post.user?.username || 'Unknown User'}
              caption={post.text}
              likes={post.likes?.length || 0}
              comments={post.comments?.length || 0}
              postImage={post.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
