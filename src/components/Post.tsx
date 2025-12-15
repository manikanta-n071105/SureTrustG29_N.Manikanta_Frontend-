import React, { useState, useRef, useEffect } from "react";

interface PostCardProps {
  id: string;
  profilePhoto: string;
  userName: string;
  caption: string;
  likes: number;
  comments: number;
  postImage: string;
  isProfilePage?: boolean;
  onDelete?: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  profilePhoto,
  userName,
  caption,
  likes,
  comments,
  postImage,
  isProfilePage = false,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleDelete = () => {
    if (!onDelete) return;
    setShowMenu(false);
    onDelete(id);
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-4 relative">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={profilePhoto}
            alt="profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <span className="font-semibold text-lg">{userName}</span>
        </div>

        {/* Hamburger menu (Profile only) */}
        {isProfilePage && (
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="flex flex-col gap-1 cursor-pointer"
            >
              <span className="w-5 h-[3px] bg-gray-700 rounded"></span>
              <span className="w-5 h-[3px] bg-gray-700 rounded"></span>
              <span className="w-5 h-[3px] bg-gray-700 rounded"></span>
            </button>

            {showMenu && (
              <div className="absolute right-0 top-6 bg-white border rounded shadow-md w-32 z-20">
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Caption */}
      <p className="mt-3 text-gray-700">{caption}</p>

      {/* Post Image */}
      <div className="mt-3">
        <img
          src={postImage}
          alt="post"
          className="w-full h-72 object-cover rounded-lg"
        />
      </div>

      {/* Likes & Comments */}
      <div className="flex justify-between mt-3 text-gray-600 text-sm">
        <span>{likes} Likes</span>
        <span>{comments} Comments</span>
      </div>

      {/* Actions */}
      <div className="flex justify-around mt-4">
        <button className="text-xl hover:scale-110 transition">👍</button>
        <button className="text-xl hover:scale-110 transition">💬</button>
        <button className="text-xl hover:scale-110 transition">↗️</button>
      </div>
    </div>
  );
};

export default PostCard;