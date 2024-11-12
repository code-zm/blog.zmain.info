document.addEventListener("DOMContentLoaded", async function() {
    const postList = document.getElementById("post-list");
    const postContent = document.getElementById("post-content");
    const converter = new showdown.Converter();

    // List of blog post filenames in the /posts directory
    const posts = [
        { filename: "2024-11-11-Metasploitable2-Port-139-Exploit.md" }
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
            const postItem = document.createElement("div");
            postItem.classList.add("list-group-item", "bg-dark-secondary", "text-light", "rounded-4", "shadow-sm", "mb-3");

            // Set up the HTML structure with title and date
            postItem.innerHTML = `
                <h5 class="post-title">${formatPostTitle(post.filename)}</h5>
                <small class="post-date">${formatPostDate(post.filename)}</small>
            `;

            // Click event to load the post content
            postItem.onclick = () => loadPost(post.filename);
            postList.appendChild(postItem);
        });
    }

    function formatPostTitle(filename) {
        // Extracts title by removing the date prefix and file extension
        const title = filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace('.md', '').replace(/-/g, ' ');
        return title.charAt(0).toUpperCase() + title.slice(1);
    }

    function formatPostDate(filename) {
        // Extracts and formats the date from the filename
        const dateMatch = filename.match(/^\d{4}-\d{2}-\d{2}/);
        return dateMatch ? dateMatch[0].replace(/-/g, '/') : '';
    }
});

