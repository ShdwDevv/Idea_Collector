document.getElementById("nameForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const nameElement = document.getElementById("name");
    const name = nameElement.value.trim();
    if (!name) {
        alert("Please enter a name.");
        return;
    }

    try {
        const response = await fetch('https://idea-collector-api.vercel.app/add-name', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name })
        });

        if (!response.ok) {
            throw new Error("Failed to add name");
        }

        nameElement.value = "";
        await loadNames();
    } catch (error) {
        console.error("Error:", error);
        alert("Error adding name. Please try again.");
    }
});

async function loadNames() {
    try {
        const response = await fetch('https://idea-collector-api.vercel.app/get-names');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const names = await response.json();
        const nameList = document.getElementById("nameList");
        nameList.innerHTML = "";
        names.forEach((name, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${index + 1}. ${name} `;
            const removeButton = document.createElement("span");
            removeButton.textContent = "X";
            removeButton.onclick = async () => {
                await removeName(name); 
                listItem.remove(); 
                loadNames();
            };
            listItem.appendChild(removeButton);
            nameList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error loading names:", error);
    }
}

async function removeName(name) {
    try {
        const response = await fetch('https://idea-collector-api.vercel.app/remove-name', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name })
        });

        if (!response.ok) {
            throw new Error("Failed to remove name");
        }
        console.log("Name removed successfully");
    } catch (error) {
        console.error("Error removing name:", error);
        alert("Error removing name. Please try again.");
    }
}

loadNames();
