import { signInComGoogle } from "./firebaseauth.js";

// Obtém os elementos de botão e formulários de login/cadastro
const signUpButton = document.getElementById('signUpButton');
const signInButton = document.getElementById('signInButton');
const signInForm = document.getElementById('signIn');
const signUpForm = document.getElementById('signup');
const botaoGoogle = document.getElementById('botaoGoogle');

// Quando o botão de cadastro é clicado, esconde o formulário de login e mostra o de cadastro
signUpButton.addEventListener('click', function() {
    signInForm.style.display = "none";
    signUpForm.style.display = "block";
});

// Quando o botão de login é clicado, esconde o formulário de cadastro e mostra o de login
signInButton.addEventListener('click', function() {
    signInForm.style.display = "block";
    signUpForm.style.display = "none";
});

// Quando apertar o botão vai fazer as parada de login com google lá chefe
botaoGoogle.addEventListener('click', () => {
    signInComGoogle()
        .then(user => {
            localStorage.setItem("loggedInUserId", user.uid);
            window.location.href = "homepage.html";
        })
            .catch(err => {
            console.error("Falha ao logar com Google:", err);
    });
});