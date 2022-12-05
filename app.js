const formInput = document.getElementById("grocery");
const container = document.querySelector(".grocery-container");
const clrBtn = document.querySelector(".clear-btn");
const alert = document.querySelector(".alert");

const item = document.querySelector(".title");
const form = document.querySelector(".grocery-form");
const list = document.querySelector(".grocery-list");
const submitBtn = document.querySelector(".submit-btn");

window.addEventListener("DOMContentLoaded", () => {
  const allItems = getFromLS();

  if (allItems.length > 0) {
    container.classList.add("show-container");
    allItems.forEach((item) => {
      createElement(item.id, item.value);
    });
  } else {
    container.classList.remove("show-container");
  }

  setBackToDefault();
});

//  ! Form Submit

let isEdit = false;
let editElement;
let EditID;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = formInput.value;

  if (value && !isEdit) {
    const id = new Date().getTime().toString();
    createElement(id, value);

    addToLocalStorage(id, value);

    container.classList.add("show-container");

    displayAlert("Item added !", "success");
    setBackToDefault();
  } else if (value && isEdit) {
    editElement.innerHTML = value;
    displayAlert("Item Changed", "success");
    editInLocalStorage(EditID, value);
    setBackToDefault();
  } else {
    displayAlert("Empty Field", "danger");
  }
});

// ! Edit Button

const editItem = (e) => {
  isEdit = true;
  const parentEl = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;

  EditID = parentEl.dataset.id;

  formInput.value = editElement.innerHTML;

  submitBtn.textContent = "Edit";
};

//  ! Delete Button

const deleteItem = (e) => {
  const el = e.currentTarget.parentElement.parentElement;

  const id = el.dataset.id;
  removeFromLocalStorage(id);

  list.removeChild(el);

  if (list.children.length === 0) {
    container.classList.remove("show-container");
    setBackToDefault();
  }

  displayAlert("Item Removed", "danger");
};

//  ! Clear Item Button

clrBtn.addEventListener("click", () => {
  const listItems = document.querySelectorAll(".grocery-item");

  listItems.forEach((li) => {
    list.removeChild(li);
  });
  container.classList.remove("show-container");
  localStorage.removeItem("list");
});

// ! Display Alert

const displayAlert = (text, action) => {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
};

// ! Set Back To Default
const setBackToDefault = () => {
  formInput.value = "";
  isEdit = false;
  EditID = "";
  submitBtn.textContent = "Submit";
};

//  ! Local Storage

const addToLocalStorage = (id, value) => {
  const items = getFromLS();

  const newItems = { id: id, value: value };

  items.push(newItems);

  setInLS(items);
};

const removeFromLocalStorage = (id) => {
  let items = getFromLS();

  const updatedValues = items.filter((item) => {
    return item.id !== id;
  });

  setInLS(updatedValues);
};

const editInLocalStorage = (id, value) => {
  let items = getFromLS();

  items.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });

  setInLS(items);
};

// ! Get & Set Items in Local Storage

const getFromLS = () => {
  const i = JSON.parse(localStorage.getItem("list"));
  return i ? i : [];
};

const setInLS = (item) => {
  localStorage.setItem("list", JSON.stringify(item));
};

//  ! Create Element CODE :

const createElement = (id, value) => {
  const element = document.createElement("article");

  element.classList.add("grocery-item");

  const attr = document.createAttribute("data-id");

  attr.value = id;

  element.setAttributeNode(attr);

  element.innerHTML = `<p class="title">${value}</p>
  <div class="btn-container">
    <button type="button" class="edit-btn">
      <i class="fas fa-edit"></i>
    </button>
    <button type="button" class="delete-btn">
      <i class="fas fa-trash"></i>
    </button>`;

  const deleteBtn = element.querySelector(".delete-btn");
  const editBtn = element.querySelector(".edit-btn");

  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);

  list.appendChild(element);
};
