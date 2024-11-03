document.getElementById("nameForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const nameElement = document.getElementById("name");
    const name = nameElement.value;
    nameElement.value = "";
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/add-name`, { // <-- Use environment variable here
        mode: 'no-cors',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name })
    });
    loadNames();
});

async function loadNames() {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/get-names`,{
        mode: 'no-cors',
        method: 'GET',
    }); // <-- Use environment variable here
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
            listItem.appendChild(removeButton);
            nameList.appendChild(listItem);
        });
    } else {
        console.error("Failed to load names");
    }
}

async function removeName(name) {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/remove-name`, { // <-- Use environment variable here
        mode: 'no-cors',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name })
    });
    if (response.ok) {
        console.log("Name removed successfully");
    } else {
        console.error("Failed to remove name");
    }
}

loadNames();
