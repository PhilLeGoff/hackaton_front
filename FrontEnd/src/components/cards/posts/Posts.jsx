import React from 'react';

const Post = () => {
  return (
    <div className="post">
      <div className="post-header">
        <img src="https://i.pravatar.cc/50?img=1" alt="user" className="avatar" />
        <span className="username">John Doe</span>
        <span className="timestamp">2h ago</span>
      </div>
      <div className="post-content">
        <p>This is a sample tweet. #example #MERN</p>
      </div>
    </div>
  );
}

export default Post;
