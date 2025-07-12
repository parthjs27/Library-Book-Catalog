const API = "http://localhost:8080/books";

// Validate form input
function validateBookForm({ title, author, isbn }) {
  if (!title.trim() || !author.trim() || !isbn.trim()) {
    return {
      isValid: false,
      message: "Please fill in all fields: Title, Author, and ISBN.",
    };
  }
  return { isValid: true };
}

// Load all books
async function loadBooks() {
  const res = await fetch(API);
  const books = await res.json();
  const list = document.getElementById("book-list");
  list.innerHTML = "";

  books.forEach((book) => {
    const div = document.createElement("div");
    div.className = "border p-4 rounded shadow bg-white";
    div.innerHTML = `
      <p>Title: ${book.title}</p>
      <p>Author: ${book.author}</p>
      <p class="text-sm text-gray-700">ISBN: ${book.isbn}</p>
      <p class="text-sm">Available: ${book.available}</p>
      <div class="flex gap-2 mt-2">
        <button onclick="deleteBook(${book.id})"
          class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
          🗑️ Delete
        </button>
        <button onclick="toggleAvailability(${book.id}, ${!book.available})"
          class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
          Set Available: ${!book.available}
        </button>
      </div>
    `;
    list.appendChild(div);
  });
}

// Add a new book
async function addBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;
  const available = document.getElementById("available").checked;

  const { isValid, message } = validateBookForm({ title, author, isbn });

  if (!isValid) {
    showAlert(message, "error");
    return;
  }

  const book = { title, author, isbn, available };

  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });

  if (res.ok) {
    showAlert("Book added successfully!", "success");
    clearForm();
  } else {
    showAlert("Error adding book", "error");
  }
}

// Confirm before deletion a book
async function deleteBook(id) {
  const confirmed = confirm("Are you sure you want to delete this book?");
  if (!confirmed) return;

  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
  if (res.ok) {
    showAlert("Book deleted successfully!", "error");
    loadBooks();
  } else {
    showAlert("Failed to delete", "error");
  }
}

// Toggle book availability
async function toggleAvailability(id, available) {
  const res = await fetch(`${API}/${id}/availability?available=${available}`, {
    method: "PUT",
  });
  if (res.ok) {
    showAlert("Availability updated!", "success");
    loadBooks();
  } else {
    showAlert("Failed to update", "error");
  }
}

// Display alert message
function showAlert(message, type = "success") {
  const alertBox = document.getElementById("alert-box");
  alertBox.textContent = message;

  alertBox.className = `mb-4 p-4 rounded text-white font-semibold text-center ${
    type === "success" ? "bg-green-500" : "bg-red-500"
  }`;

  alertBox.classList.remove("hidden");

  setTimeout(() => {
    alertBox.classList.add("hidden");
  }, 3000);
}

// Clear input fields
function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("isbn").value = "";
  document.getElementById("available").checked = true;
}
