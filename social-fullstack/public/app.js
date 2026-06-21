const API_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('authToken');

// Initialize app
if (!authToken) {
    showLoginForm();
} else {
    loadFeed();
}

// Post button
document.getElementById('postBtn')?.addEventListener('click', createPost);

async function createPost() {
    const content = document.getElementById('postContent').value;
    if (!content.trim()) {
        alert('Post cannot be empty');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ content })
        });

        if (response.ok) {
            document.getElementById('postContent').value = '';
            loadFeed();
        }
    } catch (error) {
        console.error('Error creating post:', error);
    }
}

async function loadFeed() {
    try {
        const response = await fetch(`${API_URL}/posts/feed`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const posts = await response.json();
        displayPosts(posts);
    } catch (error) {
        console.error('Error loading feed:', error);
    }
}

function displayPosts(posts) {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = posts.map(post => `
        <div class="post">
            <div class="post-header">
                <div class="post-avatar"></div>
                <div class="post-user">
                    <div class="post-user-name">${post.author.username}</div>
                    <div class="post-timestamp">${new Date(post.createdAt).toLocaleDateString()}</div>
                </div>
            </div>
            <div class="post-content">${post.content}</div>
            <div class="post-actions">
                <button onclick="likePost('${post._id}')">❤️ Like (${post.likes.length})</button>
                <button>💬 Comment (${post.comments.length})</button>
                <button>↗️ Share</button>
            </div>
        </div>
    `).join('');
}

async function likePost(postId) {
    try {
        const response = await fetch(`${API_URL}/posts/${postId}/like`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (response.ok) {
            loadFeed();
        }
    } catch (error) {
        console.error('Error liking post:', error);
    }
}

function showLoginForm() {
    // Login form implementation
    console.log('Show login form');
}

document.getElementById('logout')?.addEventListener('click', () => {
    localStorage.removeItem('authToken');
    location.reload();
});
