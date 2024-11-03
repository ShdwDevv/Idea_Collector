document.getElementById("nameForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const nameElement = document.getElementById("name");
    const name = nameElement.value;
    nameElement.value = "";
    await fetch('http://localhost:3000/add-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name })
    });
    loadNames();
});
async function loadNames() {
    const response = await fetch('http://localhost:3000/get-names');
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
    const response = await fetch('http://localhost:3000/remove-name', {
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
