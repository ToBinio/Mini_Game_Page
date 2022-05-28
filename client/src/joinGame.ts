import {socket} from "./index";

export const gameTypes = ["rockPaperScissor"]

const userNameInput = document.getElementById("userNameInput") as HTMLInputElement;

const chooseGameDiv = document.getElementById("chooseGames")!;

document.getElementById("joinButton")!.addEventListener("click", () => {
    let name = userNameInput.value.trim();

    if (name == "") {
        alert("User name can not be empty")
        return
    }

    document.getElementById("userName")!.innerText = name;

    socket.emit("joinGameQue", (name))
})

for (let i = 0; i < gameTypes.length; i++) {
    let checkBox = document.createElement("input");
    checkBox.type = "checkbox"

    checkBox.addEventListener("click", () => {
        if (checkBox.checked) {
            socket.emit("addGameToPlay", i)
        } else {
            socket.emit("removeGameToPlay", i)
        }
    })

    chooseGameDiv.innerHTML += gameTypes[i]
    chooseGameDiv.innerHTML += " : "
    chooseGameDiv.appendChild(checkBox)
}

