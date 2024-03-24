const unfinishedList = document.getElementById("unfinished-list");
const finishedList = document.getElementById("finished-list");
const addBookForm = document.getElementById("add-book-form");
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("search-button");

function renderBook(book) {
  const listItem = document.createElement("li");
  listItem.innerHTML = `
    <span>${book.title} - ${book.author} (${book.year})</span>
    <button class="move-btn">
      ${
        book.isComplete
          ? '<i class="fas fa-book-open"></i>'
          : '<i class="fas fa-book"></i>'
      }
    </button>
    <button class="edit-btn"><i class="fas fa-edit"></i></button>
    <button class="delete-btn"><i class="fas fa-trash"></i></button>
  `;

  const moveButton = listItem.querySelector(".move-btn");
  const editButton = listItem.querySelector(".edit-btn");
  const deleteButton = listItem.querySelector(".delete-btn");
  editButton.setAttribute("title", "edit");
  moveButton.setAttribute("title", "move");
  deleteButton.setAttribute("title", "delete");

  moveButton.addEventListener("click", function () {
    book.isComplete = !book.isComplete;
    renderBooks();
  });

  editButton.addEventListener("click", function () {
    editBook(book);
  });

  deleteButton.addEventListener("click", function () {
    const index = books.findIndex((b) => b.id === book.id);
    books.splice(index, 1);
    renderBooks();
  });

  if (book.isComplete) {
    finishedList.appendChild(listItem);
  } else {
    unfinishedList.appendChild(listItem);
  }
}

function renderBooks() {
  unfinishedList.innerHTML = "";
  finishedList.innerHTML = "";
  books.forEach((book) => renderBook(book));
  localStorage.setItem("books", JSON.stringify(books));
}

function addBook(event) {
  event.preventDefault();

  const titleInput = document.getElementById("title");
  const authorInput = document.getElementById("author");
  const yearInput = document.getElementById("year");
  const isCompleteCheckbox = document.getElementById("is-complete");

  const newBook = {
    id: +new Date(),
    title: titleInput.value,
    author: authorInput.value,
    year: parseInt(yearInput.value),
    isComplete: isCompleteCheckbox.checked,
  };

  books.push(newBook);
  renderBooks();

  titleInput.value = "";
  authorInput.value = "";
  yearInput.value = "";
  isCompleteCheckbox.checked = false;
}

function searchBooks() {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm)
  );

  unfinishedList.innerHTML = "";
  finishedList.innerHTML = "";
  filteredBooks.forEach((book) => renderBook(book));
}

function editBook(book) {
  const editForm = document.getElementById("edit-book-form");
  const editTitleInput = document.getElementById("edit-title");
  const editAuthorInput = document.getElementById("edit-author");
  const editYearInput = document.getElementById("edit-year");

  editTitleInput.value = book.title;
  editAuthorInput.value = book.author;
  editYearInput.value = book.year;

  editForm.style.display = "block";

  const editSubmitButton = document.getElementById("edit-submit");
  editSubmitButton.addEventListener("click", function () {
    book.title = editTitleInput.value.trim();
    book.author = editAuthorInput.value.trim();
    book.year = parseInt(editYearInput.value.trim());

    renderBooks();
    editForm.style.display = "none";
    editSubmitButton.removeEventListener("click", arguments.callee);
  });
}

addBookForm.addEventListener("submit", addBook);
searchButton.addEventListener("click", searchBooks);

let books = JSON.parse(localStorage.getItem("books")) || [];

renderBooks();
