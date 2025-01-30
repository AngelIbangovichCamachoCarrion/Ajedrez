window.onload = function() {
    document.getElementById("update-modal").style.display = "block";

    document.querySelector(".close").onclick = function() {
        document.getElementById("update-modal").style.display = "none";
    };
};
