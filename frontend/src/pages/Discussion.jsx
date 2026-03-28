import { useState, useEffect } from "react";
import { MessageSquare, ThumbsUp, ThumbsDown, Bookmark, Send, Loader2, Trash2, MessageCircle } from "lucide-react";
import { getPosts, createPost, votePost, bookmarkPost, deletePost, getComments, addComment, deleteComment } from "../api/discussApi";
import { fetchUserProfile } from "../api/authApi";

function Discussion() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [userVotes, setUserVotes] = useState({}); // Track user votes locally
  const [userBookmarks, setUserBookmarks] = useState({}); // Track user bookmarks locally
  const [currentUser, setCurrentUser] = useState(null);
  
  // Comments state
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);
  const [commentsData, setCommentsData] = useState({});
  const [newCommentContent, setNewCommentContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); // stores comment id


  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  const fetchUser = async () => {
    try {
      const user = await fetchUserProfile();
      setCurrentUser(user);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(data || []);
      
      // Initialize bookmark state from backend response
      if (data) {
        const bookmarksObj = {};
        data.forEach(p => {
          if (p.is_bookmarked) {
            bookmarksObj[p.id] = true;
          }
        });
        setUserBookmarks(bookmarksObj);
      }

    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    try {
      await createPost({ title: newTitle, content: newContent });
      setNewTitle("");
      setNewContent("");
      setShowCreate(false);
      fetchPosts();
    } catch (err) {
      console.error("Failed to create post", err);
    }
  };

  const handleVote = async (postId, voteType) => {
    try {
      // Allow un-voting if clicking the same button
      const newVoteType = userVotes[postId] === voteType ? 0 : voteType;

      await votePost(postId, null, newVoteType === 0 ? voteType : newVoteType); // We send what they clicked so backend deletes if it matches
      
      setUserVotes((prev) => ({ ...prev, [postId]: newVoteType }));
      fetchPosts();
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  const handleBookmark = async (postId) => {
    try {
      const response = await bookmarkPost(postId);
      setUserBookmarks((prev) => ({
        ...prev,
        [postId]: response.bookmarked
      }));
    } catch (err) {
      console.error("Bookmark failed", err);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm(`Are you sure you want to delete this post?`)) return;
    try {
      await deletePost(postId);
      fetchPosts(); // Refresh list
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete post. You may only delete your own posts.");
    }
  };

  const handleToggleComments = async (postId) => {
    if (activeCommentsPostId === postId) {
      setActiveCommentsPostId(null);
      return;
    }
    
    setActiveCommentsPostId(postId);
    setNewCommentContent("");
    setReplyingTo(null);
    
    // Fetch comments
    try {
      const data = await getComments(postId);
      setCommentsData(prev => ({ ...prev, [postId]: data }));
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  const handlePostComment = async (postId) => {
    if (!newCommentContent.trim()) return;
    try {
      await addComment(postId, {
        content: newCommentContent,
        parent_comment_id: replyingTo ? replyingTo.id : null
      });
      setNewCommentContent("");
      setReplyingTo(null);
      
      // Refresh comments
      const data = await getComments(postId);
      setCommentsData(prev => ({ ...prev, [postId]: data }));
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await deleteComment(commentId);
      // Refresh comments
      const data = await getComments(postId);
      setCommentsData(prev => ({ ...prev, [postId]: data }));
    } catch (err) {
      console.error("Failed to delete comment", err);
      alert("Failed to delete comment.");
    }
  };

  // Helper function to render nested comments
  const renderComments = (postId, comments, parentId = null, depth = 0) => {
    if (!comments) return null;
    
    // Filter and sort comments by newest first
    const filteredComments = comments
      .filter(c => c.parent_comment_id === parentId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    return filteredComments.map(comment => (
      <div key={comment.id} className={`mt-3 ${depth > 0 ? "ml-6 pl-4 border-l-2 border-gray-200 dark:border-gray-700" : ""}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">@{comment.username}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</span>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#1a1f2e] p-3 rounded-lg border border-gray-100 dark:border-gray-800">
          {comment.content}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <button 
            onClick={() => setReplyingTo(comment)}
            className="text-xs text-[#625df5] font-medium hover:underline"
          >
            Reply
          </button>
          {currentUser && currentUser.id === comment.user_id && (
            <button 
              onClick={() => handleDeleteComment(postId, comment.id)}
              className="text-xs text-red-500 font-medium hover:underline"
            >
              Delete
            </button>
          )}
        </div>

        {replyingTo && replyingTo.id === comment.id && (
          <div className="mt-3 bg-white dark:bg-[#0f121b] p-3 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm transition-all shadow-indigo-100/50 dark:shadow-none">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-xs font-medium text-[#625df5]">
                Replying to @{replyingTo.username}
              </span>
              <button 
                onClick={() => setReplyingTo(null)}
                className="text-xs text-gray-500 hover:text-red-500 transition-colors"
              >
                Cancel
              </button>
            </div>
            <textarea
              placeholder="Write a reply..."
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
              className="w-full text-sm bg-transparent text-gray-900 dark:text-white outline-none resize-none h-16 pt-1"
              autoFocus
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={() => handlePostComment(postId)}
                disabled={!newCommentContent.trim()}
                className="bg-[#625df5] hover:bg-[#524cdd] disabled:opacity-50 disabled:hover:bg-[#625df5] text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                Reply
              </button>
            </div>
          </div>
        )}
        
        {/* Render child comments recursively */}
        {renderComments(postId, comments, comment.id, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Discuss</h1>
          <p className="text-gray-500 dark:text-gray-400">Share knowledge and ask questions.</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-[#625df5] hover:bg-[#524cdd] text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
        >
          {showCreate ? "Cancel" : "New Post"}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreatePost} className="bg-white dark:bg-[#151822] border border-gray-200 dark:border-[#1e2332] rounded-xl p-5 mb-8 shadow-sm">
          <input
            type="text"
            placeholder="Post Title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-gray-50 dark:bg-[#0f121b] border border-gray-200 dark:border-[#1e2332] text-white rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-[#625df5] focus:border-transparent outline-none"
            required
          />
          <textarea
            placeholder="Write your post content here..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full h-32 bg-gray-50 dark:bg-[#0f121b] border border-gray-200 dark:border-[#1e2332] text-white rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-[#625df5] focus:border-transparent outline-none resize-none"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#625df5] hover:bg-[#524cdd] text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
            >
              <Send size={18} />
              Post
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#625df5]" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
          <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
          <p>No posts yet. Be the first to start a discussion!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-[#151822] border border-gray-200 dark:border-[#1e2332] rounded-xl p-5 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
              <div className="flex items-start gap-4">
                
                {/* Voting Column */}
                <div className="flex flex-col items-center gap-1 mt-1">
                  <button 
                    onClick={() => handleVote(post.id, 1)} 
                    className={`p-1.5 rounded-md transition-colors ${
                      userVotes[post.id] === 1 
                        ? "text-[#625df5] bg-indigo-50 dark:bg-[#1e2332]" 
                        : "text-gray-500 dark:text-gray-400 hover:text-[#625df5] hover:bg-gray-100 dark:hover:bg-gray-200 dark:bg-[#1e2332]"
                    }`}
                  >
                    <ThumbsUp size={18} />
                  </button>
                  <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                    {post.votes || 0}
                  </span>
                  <button 
                    onClick={() => handleVote(post.id, -1)} 
                    className={`p-1.5 rounded-md transition-colors ${
                      userVotes[post.id] === -1 
                        ? "text-red-500 bg-red-50 dark:bg-[#1e2332]" 
                        : "text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-200 dark:bg-[#1e2332]"
                    }`}
                  >
                    <ThumbsDown size={18} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-[#1e2332] text-gray-600 dark:text-gray-300 flex items-center gap-1">
                      <MessageSquare size={12} />
                      Discussion
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Posted by <span className="text-[#625df5] font-medium">@{post.name}</span>
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 text-sm">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleToggleComments(post.id)}
                      className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-[#625df5] transition-colors font-medium"
                    >
                      <MessageCircle size={16} />
                      Comments
                    </button>
                    <button 
                      onClick={() => handleBookmark(post.id)} 
                      className={`flex items-center gap-1.5 text-sm transition-colors font-medium ${
                        userBookmarks[post.id] 
                          ? "text-[#625df5]" 
                          : "text-gray-500 dark:text-gray-400 hover:text-[#625df5]"
                      }`}
                    >
                      <Bookmark size={16} fill={userBookmarks[post.id] ? "currentColor" : "none"} />
                      {userBookmarks[post.id] ? "Bookmarked" : "Bookmark"}
                    </button>
                    {currentUser && currentUser.id === post.user_id && (
                      <button onClick={() => handleDelete(post.id)} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors font-medium">
                        <Trash2 size={16} />
                        Delete
                      </button>
                    )}
                  </div>
                  
                  {/* Comments Section */}
                  {activeCommentsPostId === post.id && (
                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Comments</h4>
                      
                      {/* Top-level Comment Input */}
                      {!replyingTo && (
                        <div className="mb-6 bg-gray-50 dark:bg-[#0f121b] p-3 rounded-xl border border-gray-200 dark:border-gray-800">
                          <textarea
                            placeholder="Write a comment..."
                            value={newCommentContent}
                            onChange={(e) => setNewCommentContent(e.target.value)}
                            className="w-full text-sm bg-transparent text-gray-900 dark:text-white outline-none resize-none h-16"
                          />
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={() => handlePostComment(post.id)}
                              disabled={!newCommentContent.trim()}
                              className="bg-[#625df5] hover:bg-[#524cdd] disabled:opacity-50 disabled:hover:bg-[#625df5] text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                            >
                              Post Comment
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Comments List */}
                      <div className="mb-4">
                        {commentsData[post.id] && commentsData[post.id].length > 0 ? (
                          renderComments(post.id, commentsData[post.id])
                        ) : (
                          <p className="text-xs text-gray-500">No comments yet. Be the first!</p>
                        )}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Discussion;
