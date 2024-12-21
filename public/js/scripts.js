document.addEventListener("DOMContentLoaded", () => {
    const addContentForm = document.getElementById("add-content-form");
    const contentList = document.getElementById("content-list");

    addContentForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const title = document.getElementById("title").value;
      const content = document.getElementById("content").value;

      // Upload content to IPFS first
      const ipfsHash = await uploadContentToIPFS(content);

      // Add content to blockchain
      if (ipfsHash) {
        await addContentToBlockchain(title, ipfsHash);
      }
    });

    // Upload content to IPFS
    async function uploadContentToIPFS(content) {
      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        });

        const data = await response.json();
        if (data.hash) {
          alert("Content uploaded to IPFS successfully!");
          return data.hash;
        }
      } catch (error) {
        console.error("Error uploading to IPFS:", error);
        alert("Error uploading to IPFS.");
      }
    }

    // Add content to blockchain
    async function addContentToBlockchain(title, ipfsHash) {
      try {
        const response = await fetch("/api/add-content", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, ipfsHash }),
        });

        const data = await response.json();
        if (data.message) {
          alert(data.message);
          fetchContent(); // Refresh the list after adding content
        }
      } catch (error) {
        console.error("Error adding content to blockchain:", error);
        alert("Error adding content to blockchain.");
      }
    }

    // Fetch and display content
    async function fetchContent() {
      try {
        const response = await fetch("/api/posts/count");
        const data = await response.json();

        if (data.count) {
          contentList.innerHTML = "";
          for (let i = 0; i < data.count; i++) {
            const contentResponse = await fetch(`/api/content/${i}`);
            const contentData = await contentResponse.json();
            const contentRow = document.createElement("tr");
            contentRow.innerHTML = `
              <td>${contentData.title}</td>
              <td>${contentData.ipfsHash}</td>
              <td>${contentData.author}</td>
              <td>
                <button class="update-btn btn btn-warning" data-index="${i}">Update</button>
                <button class="delete-btn btn btn-danger" data-index="${i}">Delete</button>
              </td>
            `;
            contentList.appendChild(contentRow);
          }

          // Attach update and delete event listeners
          const updateButtons = document.querySelectorAll('.update-btn');
          const deleteButtons = document.querySelectorAll('.delete-btn');

          updateButtons.forEach(button => {
            button.addEventListener('click', handleUpdateContent);
          });

          deleteButtons.forEach(button => {
            button.addEventListener('click', handleDeleteContent);
          });
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    }

    async function handleUpdateContent(e) {
      const index = e.target.getAttribute('data-index');
      const title = prompt("Enter new title:");
      const content = prompt("Enter new content:");

      if (title && content) {
        const ipfsHash = await uploadContentToIPFS(content);
        await updateContentOnBlockchain(index, title, ipfsHash);
      }
    }

    async function handleDeleteContent(e) {
      const index = e.target.getAttribute('data-index');
      const confirmDelete = confirm("Are you sure you want to delete this content?");

      if (confirmDelete) {
        await deleteContentFromBlockchain(index);
      }
    }

    // Update content on blockchain
    async function updateContentOnBlockchain(index, title, ipfsHash) {
      try {
        const response = await fetch(`/api/update-content/${index}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, ipfsHash }),
        });

        const data = await response.json();
        if (data.message) {
          alert(data.message);
          fetchContent(); // Refresh the list after updating content
        }
      } catch (error) {
        console.error("Error updating content on blockchain:", error);
        alert("Error updating content.");
      }
    }

    // Delete content from blockchain
    async function deleteContentFromBlockchain(index) {
      try {
        const response = await fetch(`/api/delete-content/${index}`, {
          method: "DELETE",
        });

        const data = await response.json();
        if (data.message) {
          alert(data.message);
          fetchContent(); // Refresh the list after deleting content
        }
      } catch (error) {
        console.error("Error deleting content from blockchain:", error);
        alert("Error deleting content.");
      }
    }

    fetchContent(); // Initial fetch on page load
});
