// app.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// Your web app's Firebase configuration
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
const cardsCollection = collection(db, "cards");

// Create a new card with a unique ID
async function addCard() {
    const id = generateID();
    const newCard = {
        id,
        title: 'New Card',
        description: 'Description here',
        color: '#ffffff',
        x: 100,
        y: 100,
        width: 200,
        height: 150
    };
    
    await addDoc(cardsCollection, newCard);
    displayCards(); // Refresh the card display
}

// Generate a unique 3-digit ID
function generateID() {
    return Math.floor(Math.random() * 900) + 100; // Generates a number between 100 and 999
}

// Display all cards
async function displayCards() {
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = '';
    
    const querySnapshot = await getDocs(cardsCollection);
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.style.backgroundColor = data.color;
        cardElement.style.left = `${data.x}px`;
        cardElement.style.top = `${data.y}px`;
        cardElement.style.width = `${data.width}px`;
        cardElement.style.height = `${data.height}px`;
        cardElement.dataset.id = data.id;
        cardElement.innerHTML = `
            <input type="color" value="${data.color}" onchange="updateColor('${data.id}', this.value)">
            <h3>${data.title}</h3>
            <p>${data.description}</p>
            <button onclick="deleteCard('${data.id}')">Delete</button>
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
