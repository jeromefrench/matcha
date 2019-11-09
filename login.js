var pseudo = document.getElementById("pseudo");

pseudo.addEventListener("focus", function(){
    document.getElementById("aideidentifiant").textContent = "Entrez votre identifiant";
});

pseudo.addEventListener("blur", function(){
    document.getElementById("aideidentifiant").textContent = "";
});