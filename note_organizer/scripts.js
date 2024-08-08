// Firebaseの設定
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

// Firebaseの初期化
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// カードの追加
async function addCard() {
    const title = document.getElementById('noteTitle').value;
    const color = document.getElementById('noteColor').value;

    if (!title) {
        alert('Please enter a title');
        return;
    }

    const newCard = {
        title,
        color,
        x: 50, // デフォルト位置
        y: 50  // デフォルト位置
    };

    const docRef = await addDoc(collection(db, "cards"), newCard);
    console.log("Document written with ID: ", docRef.id);
    loadCards();
}

// カードの読み込み
async function loadCards() {
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = ''; // カードをクリア

    const querySnapshot = await getDocs(collection(db, "cards"));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const card = document.createElement('div');
        card.classList.add('card');
        card.draggable = true;
        card.style.backgroundColor = data.color;
        card.style.left = `${data.x}px`;
        card.style.top = `${data.y}px`;

        card.innerHTML = `
            <div class="card-header">${data.title}</div>
            <div class="card-body">This is a note.</div>
        `;

        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', doc.id);
            card.classList.add('dragging');
        });

        card.addEventListener('dragend', async () => {
            card.classList.remove('dragging');
            await updateCardPosition(doc.id, card.style.left, card.style.top);
            drawRelationships();
        });

        cardContainer.appendChild(card);
    });
}

// カードの位置を更新
async function updateCardPosition(id, x, y) {
    const cardRef = doc(db, "cards", id);
    await updateDoc(cardRef, {
        x: parseInt(x),
        y: parseInt(y)
    });
}

// リレーションシップの描画
function drawRelationships() {
    const svg = document.getElementById('relationshipContainer');
    svg.innerHTML = ''; // 前のラインをクリア
    // ここにリレーションシップの描画ロジックを追加
}

// 初期データの読み込み
document.addEventListener('DOMContentLoaded', loadCards);
