import React, { useState, useEffect } from "react";
import TweetService from "../../services/TweetService";
import { formatDistanceToNow } from "date-fns"; // Import date formatting function
import "./CommentSection.css";

const CommentSection = ({ tweetId, loggedInUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const fetchedComments = await TweetService.getComments(tweetId);
      console.log("Fetched comments:", fetchedComments);
      // Sort comments by latest first
      setComments(fetchedComments.data.reverse());
    } catch (error) {
      console.error("❌ Error fetching comments:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return; // Prevent empty comments
    try {
      await TweetService.addComment(tweetId, newComment);
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("❌ Error adding comment:", error);
    }
  };

  return (
    <div className="comment-section">
      {/* Input box is now on top */}
      <div className="comment-input">
        <textarea
        style={{width: "95%", alignSelf: "center"}}
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button  style={{width: "100%", alignSelf: "center"}} onClick={handleAddComment}>Post Comment</button>
      </div>

      <ul className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <li
              key={comment._id}
              className={`comment ${comment.userId._id === loggedInUser._id ? "own-comment" : "other-comment"}`}
            >
              <div className="comment-header">
                <strong>@{comment.userId.username}</strong>
                <span className="comment-time">
                  {formatDistanceToNow(new Date(comment.sentAt), { addSuffix: true })}
                </span>
              </div>
              <p>{comment.text}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default CommentSection;
