import React, { useState } from "react";

type LikedPost = {
  id: number;
  author: string;
  avatar: string;
  content: string;
  image: string;
  likedAt: string; // ISO date string
};

const likedPostsDummy: LikedPost[] = [
  {
    id: 1,
    author: "Ravi",
    avatar: "https://randomuser.me/api/portraits/men/31.jpg",
    content: "Beautiful nature from Unsplash 🌿",
    image: "https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630",
    likedAt: "2025-12-01T10:30:00Z",
  },
  {
    id: 2,
    author: "Vijay",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "Free nature wallpaper from Shutterstock 🌄",
    image:
      "https://image.shutterstock.com/image-photo/mountain-landscape-260nw-1069531122.jpg",
    likedAt: "2025-12-01T09:15:00Z",
  },
  {
    id: 3,
    author: "Sundar",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    content: "Bird photo from Pixabay 🕊️",
    image: "https://cdn.pixabay.com/photo/2024/08/14/10/52/bird-8788491_1280.jpg",
    likedAt: "2025-11-30T18:45:00Z",
  },
  {
    id: 4,
    author: "Anu",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    content: "Sample Cloudinary image ☁️",
    image: "https://res.cloudinary.com/demo/image/upload/w_800/sample.jpg",
    likedAt: "2025-11-29T20:00:00Z",
  },
  {
    id: 5,
    author: "Kishore",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    content: "Black & white filter sample 🎞️",
    image:
      "https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/_jcr_content/main-pars/image_12/img.jpg",
    likedAt: "2025-11-29T16:20:00Z",
  },
];

const timeAgo = (dateString: string): string => {
  const diffMs: number = Date.now() - new Date(dateString).getTime();
  const hours: number = Math.floor(diffMs / (1000 * 60 * 60));

  if (hours < 1) return "Less than 1 hour ago";
  if (hours < 24) return `${hours} hour(s) ago`;
  const days: number = Math.floor(hours / 24);
  return `${days} day(s) ago`;
};

const LikedPosts: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<LikedPost | null>(
    likedPostsDummy[0] ?? null
  );

  return (
    <div className="w-full h-screen bg-gray-100 flex">
      {/* LEFT PANEL – liked user's dp + name + time */}
      <div className="w-2/5 bg-white border-r p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Liked Posts</h2>

        {likedPostsDummy.map((post) => (
          <button
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 text-left border transition ${
              selectedPost?.id === post.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <img
              src={post.avatar}
              alt={post.author}
              className="w-10 h-10 rounded-full object-cover border"
            />
            <div className="flex-1">
              <div className="font-semibold text-sm">{post.author}</div>
              <div className="text-xs text-gray-500">
                Liked: {timeAgo(post.likedAt)}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* RIGHT PANEL – selected post */}
      <div className="w-3/5 p-6 flex justify-center items-start">
        {selectedPost ? (
          <div className="bg-white rounded-xl shadow max-w-xl w-full p-4">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={selectedPost.avatar}
                alt={selectedPost.author}
                className="w-10 h-10 rounded-full object-cover border"
              />
              <div>
                <div className="font-semibold">@{selectedPost.author}</div>
                <div className="text-xs text-gray-500">
                  Liked: {timeAgo(selectedPost.likedAt)}
                </div>
              </div>
            </div>

            <p className="mb-3 text-gray-800">{selectedPost.content}</p>

            <img
              src={selectedPost.image}
              alt="liked"
              className="w-full rounded-lg object-cover"
            />
          </div>
        ) : (
          <div className="text-gray-500 text-sm">
            No liked post selected.
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedPosts;
