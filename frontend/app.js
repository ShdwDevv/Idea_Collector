document.getElementById("nameForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const nameElement = document.getElementById("name");
    const name = nameElement.value.trim(); // Trim whitespace
    nameElement.value = "";
    
    if (!name) {
        alert("Please enter a name."); // Simple check for empty input
        return;
    }

    try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/add-name`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name })
        });
        loadNames();
    } catch (error) {
        console.error("Failed to add name", error);
    }
});

async function loadNames() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/get-names`);
        if (response.ok) {
            const names = await response.json();
            const nameList = document.getElementById("nameList");
            nameList.innerHTML = "";

            names.forEach((name, index) => {
                const listItem = document.createElement("li");
                listItem.textContent = `${index + 1}. ${name} `;
                const removeButton = document.createElement("span");
                removeButton.textContent = "X";
                removeButton.style.cursor = "pointer";
                removeButton.style.marginLeft = "10px";
                removeButton.onclick = async () => {
                    await removeName(name);
                    loadNames();
                };
                removeButton.setAttribute('aria-label', 'Remove ' + name); // Accessibility
                listItem.appendChild(removeButton);
                nameList.appendChild(listItem);
            });
        } else {
            console.error("Failed to load names");
            alert("Error loading names. Please try again.");
        }
    } catch (error) {
        console.error("Error fetching names:", error);
        alert("An error occurred while fetching names. Please try again.");
    }
}

async function removeName(name) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/remove-name`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name })
        });
        if (!response.ok) {
            console.error("Failed to remove name");
            alert("Failed to remove name. Please try again.");
        } else {
            console.log("Name removed successfully");
        }
    } catch (error) {
        console.error("Error removing name:", error);
        alert("An error occurred while removing the name. Please try again.");
    }
}

loadNames();
