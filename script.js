// Load documents from localStorage when the page loads
document.addEventListener("DOMContentLoaded", loadDocuments);

// Get form elements
const form = document.getElementById("document-form");
const docNameInput = document.getElementById("doc-name");
const docDescInput = document.getElementById("doc-description");
const docFileInput = document.getElementById("doc-file");
const docList = document.getElementById("document-list");

// Event listener for form submission
form.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent page refresh

    // Retrieve form values
    const name = docNameInput.value.trim();
    const description = docDescInput.value.trim();
    const file = docFileInput.files[0];

    // Validate input fields
    if (!name || !description || !file) {
        alert("All fields are required!");
        return;
    }

    // Read the uploaded file as Base64 (for previewing)
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        const fileData = reader.result;

        // Create document object
        const documentData = {
            id: Date.now(), // Unique ID based on timestamp
            name,
            description,
            fileData,
            fileType: file.type
        };

        // Retrieve existing documents from localStorage or initialize an empty array
        let documents = JSON.parse(localStorage.getItem("documents")) || [];
        documents.push(documentData);

        // Save updated document list back to localStorage
        localStorage.setItem("documents", JSON.stringify(documents));

        // Clear form fields
        docNameInput.value = "";
        docDescInput.value = "";
        docFileInput.value = "";

        // Reload the document list
        loadDocuments();
    };
});

/**
 * Loads and displays documents from localStorage.
 */
function loadDocuments() {
    // Clear the existing list before repopulating
    docList.innerHTML = "";

    // Retrieve stored documents
    let documents = JSON.parse(localStorage.getItem("documents")) || [];

    // Iterate through documents and display them
    documents.forEach(doc => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <p><strong>${doc.name}</strong></p>
            <p>${doc.description}</p>
            <a href="${doc.fileData}" target="_blank">View File</a>
            <button class="edit" onclick="editDocument(${doc.id})">Edit</button>
            <button class="delete" onclick="deleteDocument(${doc.id})">Delete</button>
        `;
        docList.appendChild(listItem);
    });
}

/**
 * Edits an existing document in localStorage.
 * @param {number} id - ID of the document to edit.
 */
function editDocument(id) {
    let documents = JSON.parse(localStorage.getItem("documents")) || [];
    let docToEdit = documents.find(doc => doc.id === id);

    if (docToEdit) {
        // Prompt user for new values
        let newName = prompt("Enter new document name:", docToEdit.name);
        let newDesc = prompt("Enter new document description:", docToEdit.description);

        // Update only if the user provided new values
        if (newName && newDesc) {
            docToEdit.name = newName;
            docToEdit.description = newDesc;

            // Save updated documents back to localStorage
            localStorage.setItem("documents", JSON.stringify(documents));

            // Reload document list
            loadDocuments();
        }
    }
}

/**
 * Deletes a document from localStorage.
 * @param {number} id - ID of the document to delete.
 */
function deleteDocument(id) {
    let documents = JSON.parse(localStorage.getItem("documents")) || [];

    // Filter out the document to be deleted
    documents = documents.filter(doc => doc.id !== id);

    // Save updated document list back to localStorage
    localStorage.setItem("documents", JSON.stringify(documents));

    // Reload the document list
    loadDocuments();
}
