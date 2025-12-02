import React, { useState } from "react";

type DeletedPost = {
  id: number;
  author: string;
  content: string;
  image: string;
  deletedAt: string;
};

const deletedDummy: DeletedPost[] = [
  {
    id: 101,
    author: "Ravi",
    content: "Unsplash nature image deleted ❌",
    image: "https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630",
    deletedAt: "2025-12-01T11:00:00Z",
  },
  {
    id: 102,
    author: "Ravi",
    content: "Shutterstock landscape removed ⛰️",
    image:
      "https://image.shutterstock.com/image-photo/mountain-sunset-260nw-1069531122.jpg",
    deletedAt: "2025-12-01T10:45:00Z",
  },
  {
    id: 103,
    author: "Ravi",
    content: "Pixabay photo removed 🕊️",
    image: "https://cdn.pixabay.com/photo/2024/08/14/10/52/bird-8788491_1280.jpg",
    deletedAt: "2025-11-30T22:10:00Z",
  },
  {
    id: 104,
    author: "Ravi",
    content: "Cloudinary sample image deleted ☁️",
    image: "https://res.cloudinary.com/demo/image/upload/w_800/sample.jpg",
    deletedAt: "2025-11-30T20:30:00Z",
  },
  {
    id: 105,
    author: "Ravi",
    content: "Black & white art removed 🎞️",
    image:
      "https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/_jcr_content/main-pars/image_12/img.jpg",
    deletedAt: "2025-11-29T19:00:00Z",
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

const DeletedPosts: React.FC = () => {
  const [deletedPosts, setDeletedPosts] = useState<DeletedPost[]>(deletedDummy);
  const [selectedPost, setSelectedPost] = useState<DeletedPost | null>(
    deletedDummy[0] ?? null
  );

  const handleRestore = (id: number): void => {
    setDeletedPosts((prev) => prev.filter((post) => post.id !== id));
    setSelectedPost((prev) => {
      if (!prev || prev.id !== id) return prev;
      const remaining = deletedDummy.filter((p) => p.id !== id);
      return remaining[0] ?? null;
    });
    alert(`Post ${id} restored (dummy action)`);
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex">
      {/* LEFT PANEL – timing + restore option */}
      <div className="w-2/5 bg-white border-r p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Deleted Posts</h2>

        {deletedPosts.length === 0 && (
          <p className="text-gray-500 text-sm">No deleted posts (all restored).</p>
        )}

        {deletedPosts.map((post) => (
          <div
            key={post.id}
            className={`w-full p-3 rounded-lg mb-2 border text-left transition ${
              selectedPost?.id === post.id
                ? "border-red-500 bg-red-50"
                : "border-red-100 hover:bg-red-50"
            }`}
            onClick={() => setSelectedPost(post)}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-sm">Post #{post.id}</span>
              <span className="text-xs text-red-500">
                Deleted: {timeAgo(post.deletedAt)}
              </span>
            </div>
            <p className="text-xs text-gray-700 mb-2 line-clamp-2">
              {post.content}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRestore(post.id);
              }}
              className="px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700"
            >
              Restore
            </button>
          </div>
        ))}
      </div>

      {/* RIGHT PANEL – selected deleted post */}
      <div className="w-3/5 p-6 flex justify-center items-start">
        {selectedPost ? (
          <div className="bg-white rounded-xl shadow max-w-xl w-full p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="font-semibold text-sm">
                  Deleted Post #{selectedPost.id}
                </div>
                <div className="text-xs text-red-500">
                  Deleted: {timeAgo(selectedPost.deletedAt)}
                </div>
              </div>
            </div>

            <p className="mb-3 text-gray-800">{selectedPost.content}</p>

            <img
              src={selectedPost.image}
              alt="deleted"
              className="w-full rounded-lg object-cover"
            />
          </div>
        ) : (
          <div className="text-gray-500 text-sm">No deleted post selected.</div>
        )}
      </div>
    </div>
  );
};

export default DeletedPosts;
