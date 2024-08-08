// Firebaseの設定
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0uhV83S2vm-GlDIfIOU-G3nwX7xsDiP0",
  authDomain: "noteorganizer-90c0e.firebaseapp.com",
  projectId: "noteorganizer-90c0e",
  storageBucket: "noteorganizer-90c0e.appspot.com",
  messagingSenderId: "333630837587",
  appId: "1:333630837587:web:0373fdccd41dff63a807a6",
  measurementId: "G-8R14FX42ZF"
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

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
