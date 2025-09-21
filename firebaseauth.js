// Importa as funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, 
    signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, setDoc, getDoc, doc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Configurações do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCqJKZyTIkhyCOE3Fae-hhEe5JwFXskqxs",
    authDomain: "jacques-openid.firebaseapp.com",
    projectId: "jacques-openid",
    storageBucket: "jacques-openid.firebasestorage.app",
    messagingSenderId: "550683176115",
    appId: "1:550683176115:web:b121ac1db55b985a4d94c6"
};
// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

export async function signInComGoogle() {
    const auth = getAuth();
    const db = getFirestore();
    const provider = new GoogleAuthProvider();

    try {
        const resultado = await signInWithPopup(auth, provider);
        const usuario = resultado.user;


        const docRef = doc(db, "users", usuario.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            await setDoc(docRef, {
                email: usuario.email,
                firstName: usuario.displayName?.split(" ")[0] || "",
                lastName: usuario.displayName?.split(" ")[1] || "",
                photoURL: usuario.photoURL || "",
                createdAt: new Date().toISOString()
            });
            console.log("Adicionou um caba novo no Firestore");
        } else {
            console.log("Esse mano já existe no Firestore");
        }

        return usuario;
    } catch (erro) {
        console.error("Erro ao logar com Google: ", erro);
        throw erro;
    }
}

// Função para exibir mensagens temporárias na interface
function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function() {
        messageDiv.style.opacity = 0;
    }, 5000); // A mensagem desaparece após 5 segundos
}

// Lógica de cadastro de novos usuários
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
    event.preventDefault(); // Previne o comportamento padrão do botão

    // Captura os dados do formulário de cadastro
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    const auth = getAuth(); // Configura o serviço de autenticação
    const db = getFirestore(); // Conecta ao Firestore

    // Cria uma conta com e-mail e senha
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user; // Usuário autenticado
        const userData = { email, firstName, lastName }; // Dados do usuário para salvar

        showMessage('Conta criada com sucesso', 'signUpMessage'); // Exibe mensagem de sucesso

        // Salva os dados do usuário no Firestore
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
        .then(() => {
            window.location.href = 'index.html'; // Redireciona para a página de login após cadastro
        })
        .catch((error) => {
            console.error("Error writing document", error);
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        if (errorCode == 'auth/email-already-in-use') {
            showMessage('Endereço de email já existe', 'signUpMessage');
        } else {
            showMessage('não é possível criar usuário', 'signUpMessage');
        }
    });
});

// Lógica de login de usuários existentes
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault(); // Previne o comportamento padrão do botão

    // Captura os dados do formulário de login
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const auth = getAuth(); // Configura o serviço de autenticação

    // Realiza o login com e-mail e senha
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        showMessage('usuário logado com sucesso', 'signInMessage'); // Exibe mensagem de sucesso
        const user = userCredential.user;

        // Salva o ID do usuário no localStorage
        localStorage.setItem('loggedInUserId', user.uid);

        window.location.href = 'homepage.html'; // Redireciona para a página inicial
    })
    .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/invalid-credential') {
            showMessage('Email ou Senha incorreta', 'signInMessage');
        } else {
            showMessage('Essa conta não existe', 'signInMessage');
        }
    });
});