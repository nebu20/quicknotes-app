
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const searchInput = document.querySelector("#search-input");
const errorMessage = document.querySelector("#error-message");
const noteCount = document.querySelector("#note-count");

const STORAGE_KEY = "quicknotes";

// Load saved notes from localStorage.
function loadNotes() {
  try {
    const savedNotes = localStorage.getItem(STORAGE_KEY);
    const parsedNotes = savedNotes ? JSON.parse(savedNotes) : [];

    return Array.isArray(parsedNotes) ? parsedNotes : [];
  } catch (error) {
    console.error("Could not load saved notes:", error);
    return [];
  }
}

// Store the current notes in localStorage.
function saveNotes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error("Could not save notes:", error);
    errorMessage.textContent = "Unable to save notes in this browser.";
  }
}

// Keep notes in an array.
let notes = loadNotes();

// Display notes and update the total count.
function renderNotes(notesToDisplay = notes) {
  notesList.replaceChildren();

  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${notes.length} notes.`;
  }

  // Show a message when a search has no matches.
  if (notesToDisplay.length === 0 && searchInput.value.trim() !== "") {
    const message = document.createElement("li");
    message.textContent = "No notes match your search.";
    notesList.appendChild(message);
    return;
  }

  notesToDisplay.forEach(function (note) {
    const noteCard = document.createElement("li");

    noteCard.classList.add(
      `category-${note.category.toLowerCase()}`
    );

    const noteText = document.createElement("p");
    noteText.textContent = note.text;

    const categoryLabel = document.createElement("span");
    categoryLabel.classList.add("category-label");
    categoryLabel.textContent = note.category;

    const createdDate = document.createElement("small");
    createdDate.textContent = `Created: ${note.createdAt}`;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      notes = notes.filter(function (item) {
        return item.id !== note.id;
      });

      saveNotes();
      renderNotes(getFilteredNotes());
    });

    noteCard.append(
      noteText,
      categoryLabel,
      document.createElement("br"),
      createdDate,
      document.createElement("br"),
      deleteButton
    );

    notesList.appendChild(noteCard);
  });
}

// Return notes that match the search text.
function getFilteredNotes() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  return notes.filter(function (note) {
    return note.text.toLowerCase().includes(searchTerm);
  });
}

// Add a new note.
noteForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = noteInput.value.trim();

  if (text === "") {
    errorMessage.textContent = "Please enter a note before adding.";
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent =
      "Your note must be 200 characters or fewer.";
    return;
  }

  const newNote = {
    id: crypto.randomUUID(),
    text: text,
    category: noteCategory.value,
    createdAt: new Date().toLocaleString()
  };

  notes.push(newNote);

  saveNotes();

  noteInput.value = "";
  errorMessage.textContent = "";

  renderNotes(getFilteredNotes());
});

// Search as the user types.
searchInput.addEventListener("input", function () {
  renderNotes(getFilteredNotes());
});

// Display saved notes when the page loads.
renderNotes();
