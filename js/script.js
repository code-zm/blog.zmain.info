document.addEventListener("DOMContentLoaded", async function() {
    const postList = document.getElementById("post-list");
    const postContent = document.getElementById("post-content");
    const converter = new showdown.Converter();

    let openPost = null; // Track the currently open post filename

    // List of blog post filenames in the /posts directory
    const posts = [
        { filename: "2024-11-11-Metasploitable2-Port-139-Exploit.md" },
        { filename: "2024-11-10-Metasploitable2-Port-21-Exploit.md" }
        // Add additional filenames here as you create new posts
    ];

    // Render the list of posts in the sidebar
    renderPostList(posts);

    // Load and display a post when clicked
    async function loadPost(filename) {
        if (openPost === filename) {
            // If the same post is clicked again, close it
            postContent.style.display = "none";
            postContent.innerHTML = ""; // Clear the content
            openPost = null; // Reset the open post
        } else {
            try {
                const response = await fetch(`posts/${filename}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch the post.");
                }
                const markdown = await response.text();
                
                // Convert the Markdown to HTML using Showdown
                const htmlContent = converter.makeHtml(markdown);
                
                // Display the converted HTML content in the post content area
                postContent.innerHTML = htmlContent;
                postContent.style.display = "block";
                openPost = filename; // Set the currently open post
            } catch (error) {
                console.error("Error loading post:", error);
                postContent.innerHTML = "<p class='text-danger'>Error loading post. Please try again later.</p>";
            }
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

            // Click event to toggle the post content
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

