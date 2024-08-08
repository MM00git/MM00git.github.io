import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB0uhV83S2vm-GlDIfIOU-G3nwX7xsDiP0",
    authDomain: "noteorganizer-90c0e.firebaseapp.com",
    projectId: "noteorganizer-90c0e",
    storageBucket: "noteorganizer-90c0e.appspot.com",
    messagingSenderId: "333630837587",
    appId: "1:333630837587:web:0373fdccd41dff63a807a6",
    measurementId: "G-8R14FX42ZF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Get DOM elements
const addCardButton = document.getElementById('addCardButton');
const cardFormModal = document.getElementById('cardFormModal');
const closeModal = document.getElementById('closeModal');
const cardForm = document.getElementById('cardForm');

// Show the card form modal
addCardButton.addEventListener('click', () => {
    cardFormModal.style.display = 'block';
});

// Close the card form modal
closeModal.addEventListener('click', () => {
    cardFormModal.style.display = 'none';
});

// Handle form submission
cardForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const description = document.getElementById('description').value;
    const color = document.getElementById('color').value;
    const width = parseInt(document.getElementById('width').value);
    const height = parseInt(document.getElementById('height').value);
    
    const newCard = {
        id: generateId(),
        description,
        color,
        x: 100,
        y: 100,
        width,
        height
    };
    
    await addDoc(collection(db, "cards"), newCard);
    cardFormModal.style.display = 'none';
    displayCards();
});

// Generate a unique ID for the card
function generateId() {
    return Math.floor(100 + Math.random() * 900); // 3-digit ID
}

// Display all cards
async function displayCards() {
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = ''; // Clear existing cards
    
    const querySnapshot = await getDocs(collection(db, "cards"));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.id = data.id;
        cardElement.style.backgroundColor = data.color;
        cardElement.style.left = `${data.x}px`;
        cardElement.style.top = `${data.y}px`;
        cardElement.style.width = `${data.width}px`;
        cardElement.style.height = `${data.height}px`;
        cardElement.innerHTML = `
            <p>${data.description}</p>
            <button onclick="deleteCard('${data.id}')">Delete</button>
            <input type="color" value="${data.color}" onchange="updateColor('${data.id}', this.value)">
        `;
        cardContainer.appendChild(cardElement);
        
        // Add drag-and-drop functionality
        addDragAndDrop(cardElement);
    });
}

// Update card color
async function updateColor(id, color) {
    const cardRef = doc(db, "cards", id);
    await updateDoc(cardRef, { color });
}

// Delete a card
async function deleteCard(id) {
    const cardRef = doc(db, "cards", id);
    await deleteDoc(cardRef);
    displayCards(); // Refresh the card display
}

// Add drag-and-drop functionality to a card element
function addDragAndDrop(element) {
    let offsetX, offsetY, isDragging = false;

    element.onmousedown = (e) => {
        isDragging = true;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
        
        document.onmousemove = (e) => {
            if (isDragging) {
                element.style.left = `${e.clientX - offsetX}px`;
                element.style.top = `${e.clientY - offsetY}px`;
                updatePosition(element.dataset.id, e.clientX - offsetX, e.clientY - offsetY);
            }
        };

        document.onmouseup = () => {
            isDragging = false;
            document.onmousemove = document.onmouseup = null;
        };
    };
}

// Update card position
async function updatePosition(id, x, y) {
    const cardRef = doc(db, "cards", id);
    await updateDoc(cardRef, { x, y });
}

// Initialize the display of cards
displayCards();
