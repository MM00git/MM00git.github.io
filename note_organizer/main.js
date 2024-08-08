// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";

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

// Initialize Firestore
const db = getFirestore(app);

// Reference to the 'cards' collection
const cardsCollection = collection(db, "cards");

// Function to display cards
async function displayCards() {
  const cardContainer = document.getElementById('card-container');
  cardContainer.innerHTML = ''; // 既存のカードをクリア
  try {
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
      cardElement.innerHTML = `
        <h3>${data.title}</h3>
        <p>${data.description}</p>
      `;
      cardContainer.appendChild(cardElement);
    });
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
}

async function addCard() {
  try {
    const newCard = {
      title: 'New Card',
      description: 'Description here',
      color: '#f0f0f0',
      x: 100,
      y: 100,
      width: 200,
      height: 150
    };
    await addDoc(cardsCollection, newCard);
    displayCards(); // カードを再表示
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}

