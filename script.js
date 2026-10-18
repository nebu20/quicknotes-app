
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const searchInput = document.querySelector("#search-input");
const errorMessage = document.querySelector("#error-message");
const noteCount = document.querySelector("#note-count");

// Store notes as objects in an array.
let notes = [];

// Display notes on the page.
function renderNotes(notesToDisplay = notes) {
  notesList.replaceChildren();

  notesToDisplay.forEach(function (note) {
      if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${notes.length} notes.`;
  }
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

  renderNotes();
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

// Add a new note.
noteForm.addEventListener("submit", function (event) {
  event.preventDefault();

const text = noteInput.value.trim();

if (text === "") {
  errorMessage.textContent = "Please enter a note before adding.";
  return;
}

if (text.length > 200) {
  errorMessage.textContent = "Your note must be 200 characters or fewer.";
  return;
}

const newNote = {
    id: Date.now().toString(),
    text: text,
    category: noteCategory.value,
    createdAt: new Date().toLocaleString()
  };

  notes.push(newNote);

  renderNotes();

  noteInput.value = "";
  errorMessage.textContent = "";
});
