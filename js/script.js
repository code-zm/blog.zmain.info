document.addEventListener("DOMContentLoaded", async function() {
    const postList = document.getElementById("post-list");
    const postContent = document.getElementById("post-content");
    const converter = new showdown.Converter();

    // Load post list
    const posts = await fetchPosts();
    renderPostList(posts);

    // Load and display a post when clicked
    async function loadPost(filename) {
        const response = await fetch(`posts/${filename}`);
        const markdown = await response.text();
        const htmlContent = converter.makeHtml(markdown);
        
        postContent.innerHTML = htmlContent;
        postContent.style.display = "block";
    }

    function renderPostList(posts) {
        posts.forEach(post => {
            const postItem = document.createElement("a");
            postItem.classList.add("list-group-item", "list-group-item-action", "bg-dark-secondary", "text-light", "rounded-4", "shadow-sm", "mb-3");
            postItem.innerHTML = `<h5>${formatPostTitle(post)}</h5>`;
            postItem.href = "#";
            postItem.onclick = (e) => {
                e.preventDefault();
                loadPost(post);
            };
            postList.appendChild(postItem);
        });
    }

    async function fetchPosts() {
        // Mock file list - GitHub Pages cannot list files in a directory
        // Add post filenames here manually, or load them dynamically from an API if possible
        return [
            "2024-01-15-my-first-post.md",
            "2024-01-20-another-cool-post.md"
        ];
    }

    function formatPostTitle(filename) {
        const title = filename.replace(/-/g, ' ').replace('.md', '');
        return title.charAt(0).toUpperCase() + title.slice(1);
    }
});

