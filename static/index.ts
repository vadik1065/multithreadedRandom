import "./main.css";
import TerminalControl from "./src/TerminalControl";

const prefixIDValue = "#value-";

const IDwebTerminal = "web-terminal";
const IDForm = "form-gen-number";

const ClassRange = ".range-input";
const ClassRanges = ".ranges";
const ClassBtnSubmit = ".btn-gen-numb";

const addressForConnectSocket = "ws://127.0.0.1:8080/ws";

const webTerminal = document.getElementById(IDwebTerminal) as HTMLDivElement;
const webForm = document.getElementById(IDForm) as HTMLFormElement;
const WebRanges = document.querySelector(ClassRanges) as HTMLInputElement;
const btnSubmit = document.querySelector(ClassBtnSubmit) as HTMLButtonElement;

const terminal = new TerminalControl(webTerminal);

class App {
  // задержка перед каждой генерацией
  delayGeneration;

  constructor() {
    this.delayGeneration = 0;
  }

  // подключение по сокету
  connectSocket() {
    const socket = new WebSocket(addressForConnectSocket);
    let cleanId: ReturnType<typeof setTimeout>;

    socket.onopen = (e) => {
      socket.send("hellWord");
    };

    const clearDisable = (el: HTMLButtonElement) => (el.disabled = false);

    socket.onmessage = function (event: MessageEvent<any>) {
      // clearDisable - убирает свойство недоступности
      clearTimeout(cleanId);
      cleanId = setTimeout(clearDisable, this.delayGeneration, btnSubmit);
      btnSubmit.disabled = true;

      terminal.writeInTerminal(event.data);
    }.bind(this);

    socket.onerror = () => {
      terminal.writeInTerminal(`произошла ошибка`);
    };

    socket.onclose = (e) => {
      terminal.writeInTerminal(`соединение закрылось`);
    };
  }

  // changeTextByEvent - меняем текст нужного елемента по событию
  changeTextByEvent(e: Event) {
    const inputRange = e.target as HTMLInputElement;
    const name = inputRange.name;
    const value = inputRange.value;
    const valueName = prefixIDValue + name;

    WebRanges.querySelector(valueName).textContent = value;
  }

  // onGenNumbSubmit - отправка запроса на генерацию
  onGenNumbSubmit(e: Event) {
    e.preventDefault();

    const fieldNameToValue: { [key: string]: number } = {
      countBlock: 5,
      countNumber: 10,
      countSleepTime: 0
    };

    const form = e.target as HTMLFormElement;
    const ranges = form.querySelectorAll(ClassRange);

    ranges.forEach((rangeEL) => {
      const range = rangeEL as HTMLInputElement;
      fieldNameToValue[range.name] = +range.value;
    });

    this.delayGeneration = fieldNameToValue.countSleepTime + 50;

    const data: RequestInit = {
      body: JSON.stringify(fieldNameToValue),
      method: "POST"
    };

    terminal.clearTerminal();

    fetch("/api/start_number", data).catch((evtErr) =>
      terminal.writeInTerminal(`Произошла ошибка: ${evtErr}`)
    );
  }

  // run - запуск скрипта
  run() {
    this.connectSocket();
    webForm.addEventListener("submit", this.onGenNumbSubmit.bind(this));
    WebRanges.addEventListener("input", this.changeTextByEvent.bind(this));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.run();
});
