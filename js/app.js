console.log("Firebase object:", firebase);
const firebaseConfig = {
  apiKey: "AIzaSyA6g1LeFdKivGZzhcbT7CGuk9Dx6ZTHcsE",
  authDomain: "diary-82f92.firebaseapp.com",
  projectId: "diary-82f92",
  storageBucket: "diary-82f92.firebasestorage.app",
  messagingSenderId: "315642653157",
  appId: "1:315642653157:web:700c76a0c03f3f5901a70c",
  measurementId: "G-H3S4VPNQPC"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    location.href = "login.html";
  } else {
    loadNotes();
  }
});


function addNote() {
  const title = document.getElementById("noteTitle").value;
  const date = document.getElementById("noteDate").value;
  const content = document.getElementById("noteInput").value;
  const user = firebase.auth().currentUser;
  if (!user) return;

  const noteData = {
    title,
    date,
    content,
    createdAt: new Date(),
    userId: user.uid
  };

  db.collection("diary").add(noteData)
    .then(() => {
      alert("Catatan berhasil disimpan!");
      document.getElementById("noteTitle").value = "";
      document.getElementById("noteDate").value = "";
      document.getElementById("noteInput").value = "";
      const modal = bootstrap.Modal.getInstance(document.getElementById("noteModal"));
      modal.hide();
      loadNotes();
    })
    .catch((error) => {
      console.error("Error menambahkan catatan: ", error);
    });
}

function loadNotes() {
  const user = firebase.auth().currentUser;
  if (!user) return;

  db.collection("diary")
    .where("userId", "==", user.uid)
    .orderBy("createdAt", "desc")
    .get()
    .then((querySnapshot) => {
      const grid = document.getElementById("noteGrid");
      grid.innerHTML = "";

      querySnapshot.forEach((doc) => {
        const note = doc.data();

        const card = document.createElement("div");
        card.className = "col-md-4 mb-4";
        card.dataset.noteText = `${note.title.toLowerCase()} ${note.content.toLowerCase()}`;

        card.innerHTML = `
          <a href="detail.html?id=${doc.id}" class="text-decoration-none text-dark">
            <div class="card card-note h-100">
              <div class="card-body">
                <h5 class="card-title">${note.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${note.date}</h6>
              </div>
            </div>
          </a>
        `;

        grid.appendChild(card);
      });
    });
}

document.getElementById("search").addEventListener("input", function () {
  const filter = this.value.toLowerCase();
  const cards = document.querySelectorAll("#noteGrid > div");

  cards.forEach(card => {
    const text = card.dataset.noteText || "";
    card.style.display = text.includes(filter) ? "block" : "none";
  });
});

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => location.href = "index.html")
    .catch(err => alert("Login gagal: " + err.message));
}

function register() {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  if (password.length < 6) {
    alert("Password minimal 6 karakter.");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("Berhasil daftar! Silakan login.");
      toggleForm(); 
    })
    .catch(err => alert("Gagal daftar: " + err.message));
}

//logout
function logout() {
  firebase.auth().signOut()
    .then(() => {
      location.href = "login.html";
    })
    .catch((error) => {
      console.error("Gagal logout:", error);
      alert("Terjadi kesalahan saat logout.");
    });
}