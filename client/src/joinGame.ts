import {cookiesEnabled, socket} from "./index";
import Cookies from 'js-cookie';

export const gameNames = ["Rock-Paper-Scissor", "Tik-Tak-Toe"]

const userNameInput = document.getElementById("userNameInput") as HTMLInputElement;

const chooseGameDiv = document.getElementById("chooseGames")!;

let enabledGames: boolean[] = [];

document.getElementById("joinButton")!.addEventListener("click", () => {
    let name = userNameInput.value.trim();

    if (name == "") {
        alert("User name can not be empty")
        return
    }

    if (cookiesEnabled) {
        Cookies.set("name", name, {expires: 30})
    }

    let oneGameIsEnabled = false;

    for (let i = 0; i < enabledGames.length; i++) {
        if (enabledGames[i]) {
            oneGameIsEnabled = true;
        }

        if (cookiesEnabled) {
            Cookies.set("gameEnabled" + i, String(enabledGames[i]), {expires: 30})
        }
    }

    if (!oneGameIsEnabled) {
        alert("You need to Enable at leased one Game")
        return
    }

    document.getElementById("userName")!.innerText = name;

    socket.emit("joinGameQue", {"name": name, "enabledGames": enabledGames})
})

export function init() {
    if (cookiesEnabled) {
        let name = Cookies.get("name");
        (document.getElementById("userNameInput") as HTMLInputElement).value = name ? name : ""
    }

    for (let i = 0; i < gameNames.length; i++) {
        let checkBox = document.createElement("input");

        checkBox.type = "checkbox"

        if (cookiesEnabled) {
            let enabled = Cookies.get("gameEnabled" + i) == "true";
            if (enabled) {
                checkBox.checked = true;
            }
        }

        enabledGames[i] = checkBox.checked;

        checkBox.onclick = () => {
            enabledGames[i] = checkBox.checked;
        }

        let textSpan = document.createElement("span");

        textSpan.innerHTML += gameNames[i]
        textSpan.innerHTML += " : "

        let div = document.createElement("div");

        div.appendChild(textSpan)
        div.appendChild(checkBox)

        chooseGameDiv.appendChild(div)
    }
}

