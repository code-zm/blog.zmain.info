document.addEventListener("DOMContentLoaded", async function() {
    const postList = document.getElementById("post-list");
    const postContent = document.getElementById("post-content");
    const converter = new showdown.Converter();

    // List of blog post filenames in the /posts directory
    const posts = [
        "2024-11-11-Metasploitable2Port139.md"
        // Add additional filenames here as you create new posts
    ];

    // Render the list of posts in the sidebar
    renderPostList(posts);

    // Load and display a post when clicked
    async function loadPost(filename) {
        try {
            const response = await fetch(`posts/${filename}`);
            if (!response.ok) {
                throw new Error("Failed to fetch the post.");
            }
            const markdown = await response.text();
            const htmlContent = converter.makeHtml(markdown);
            
            // Display the converted HTML content in the post content area
            postContent.innerHTML = htmlContent;
            postContent.style.display = "block";
        } catch (error) {
            console.error("Error loading post:", error);
            postContent.innerHTML = "<p class='text-danger'>Error loading post. Please try again later.</p>";
        }
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

    function formatPostTitle(filename) {
        // Formats the filename (e.g., "2024-01-15-my-first-post.md") to a more readable title
        const title = filename
            .replace(/-/g, ' ')    // Replace hyphens with spaces
            .replace(/\d{4}-\d{2}-\d{2}\s*/, '')  // Remove the date prefix
            .replace('.md', '');   // Remove the file extension
        return title.charAt(0).toUpperCase() + title.slice(1);
    }
});

