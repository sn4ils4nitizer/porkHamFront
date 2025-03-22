        const apiBase = "http://192.168.1.30:8080/api/wiki/";

        function loadPageList() {
            fetch('http://192.168.1.30/api/wiki2/list')  // Adjust if necessary (use your server IP/hostname)
                .then(response => response.json())
                .then(data => {
                    const pageList = document.getElementById('page-list');
                    pageList.innerHTML = '';  // Clear existing list

                    data.forEach(page => {
                        const listItem = document.createElement('li');
                        const link = document.createElement('a');
                        link.href = '#';
                        link.textContent = page.replace('.html', ''); // Remove .html extension from the name
                        link.onclick = function () {
                            loadPage(page);
                        };
                        listItem.appendChild(link);
                        pageList.appendChild(listItem);
                    });
                })
                .catch(error => console.error('Error fetching page list:', error));
        }

        async function loadPage(page) {
            try {
                let response = await fetch(apiBase + page);
                if (!response.ok) throw new Error("Page not found");

                let html = await response.text();
                document.getElementById("content-display").srcdoc = html;
            } catch (error) {
                document.getElementById("content-display").srcdoc = `<p style="color:red;">Error loading page: ${error.message}</p>`;
            }
        }

        async function createPage() {
            let pageName = prompt("Enter new page name:");
            if (!pageName) return;

            let content = prompt("Enter page content (HTML allowed):", "<h1>New Page</h1>");
            if (content === null) return;

            try {
                let response = await fetch(apiBase + pageName, {
                    method: "POST",
                    headers: {"Content-Type": "text/html"},
                    body: content
                });

                if (!response.ok) throw new Error("Failed to create page");
                alert("Page created!");
                loadPages();
            } catch (error) {
                alert("Error: " + error.message);
            }
        }

        async function editPage() {
            let pageName = prompt("Enter page name to edit:");
            if (!pageName) return;

            try {
                let response = await fetch(apiBase + pageName);
                if (!response.ok) throw new Error("Page not found");

                let oldContent = await response.text();
                let newContent = prompt("Edit page content:", oldContent);
                if (newContent === null) return;

                let updateResponse = await fetch(apiBase + pageName, {
                    method: "POST",
                    headers: {"Content-Type": "text/html"},
                    body: newContent
                });

                if (!updateResponse.ok) throw new Error("Failed to update page");
                alert("Page updated!");
                loadPage(pageName);
            } catch (error) {
                alert("Error: " + error.message);
            }
        }

        async function deletePage() {
            let pageName = prompt("Enter page name to delete:");
            if (!pageName) return;

            let confirmDelete = confirm(`Are you sure you want to delete "${pageName}"?`);
            if (!confirmDelete) return;

            try {
                let response = await fetch(apiBase + pageName, {method: "DELETE"});
                if (!response.ok) throw new Error("Failed to delete page");

                alert("Page deleted!");
                document.getElementById("content-display").innerHTML = "Select a page to view its content.";
                loadPages();
            } catch (error) {
                alert("Error: " + error.message);
            }
        }

        loadPageList();

