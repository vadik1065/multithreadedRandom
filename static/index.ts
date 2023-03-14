import "./main.css";
import { TerminalControl } from "./src/TerminalControl";

const prefixIDValue: string = "#value-";

const IDwebTerminal: string = "web-terminal";
const IDForm: string = "form-gen-number";

const ClassRange: string = ".range-input";
const ClassRanges: string = ".ranges";
const ClassBtnSubmit: string = ".btn-gen-numb";

const addressForConnectSocket: string = "ws://127.0.0.1:8080/ws";

// dgID - сокращение document.getElementById
function dgID(name: string): HTMLElement {
  return document.getElementById(name);
}

// dgID - сокращение document.getElementById
function dq(name: string): HTMLElement {
  return document.querySelector(name);
}

const webTerminal: HTMLDivElement = dgID(IDwebTerminal) as HTMLDivElement;
const webForm: HTMLFormElement = dgID(IDForm) as HTMLFormElement;
const WebRanges: HTMLInputElement = dq(ClassRanges) as HTMLInputElement;
const btnSubmit: HTMLButtonElement = dq(ClassBtnSubmit) as HTMLButtonElement;

const terminal: TerminalControl = new TerminalControl(webTerminal);

class App {
  // задержка перед каждой генерацией
  delayGeneration: number;

  constructor() {
    this.delayGeneration = 0;
  }

  // подключение по сокету
  connectSocket(): void {
    const socket: WebSocket = new WebSocket(addressForConnectSocket);
    let cleanId: ReturnType<typeof setTimeout>;

    socket.onopen = (): void => {
      socket.send("hellWord");
    };

    // clearDisable - убирает свойство недоступности
    function clearDisable(el: HTMLButtonElement): void {
      el.disabled = false;
    }

    // onmessage - пришло сообщение
    socket.onmessage = function (event: MessageEvent): void {
      clearTimeout(cleanId);
      cleanId = setTimeout(clearDisable, this.delayGeneration, btnSubmit);
      btnSubmit.disabled = true;

      terminal.writeInTerminal(event.data);
    }.bind(this);

    // onerror - пришла ошибка
    socket.onerror = (): void => terminal.writeInTerminal(`произошла ошибка`);

    // onclose - соединение закрылось
    socket.onclose = (): void =>
      terminal.writeInTerminal(`соединение закрылось`);
  }

  // changeTextByEvent - меняем текст нужного елемента по событию
  changeTextByEvent(e: Event): void {
    const inputRange: HTMLInputElement = e.target as HTMLInputElement;
    const name: string = inputRange.name;
    const value: string = inputRange.value;
    const valueName: string = prefixIDValue + name;

    WebRanges.querySelector(valueName).textContent = value;
  }

  // onGenNumbSubmit - отправка запроса на генерацию
  onGenNumbSubmit(e: Event): void {
    e.preventDefault();

    const fieldNameToValue: { [key: string]: number } = {
      countBlock: 5,
      countNumber: 10,
      countSleepTime: 0
    };

    const form: HTMLFormElement = e.target as HTMLFormElement;
    const ranges: NodeListOf<Element> = form.querySelectorAll(ClassRange);

    ranges.forEach((rangeEL: Element): void => {
      const range: HTMLInputElement = rangeEL as HTMLInputElement;
      fieldNameToValue[range.name] = +range.value;
    });

    this.delayGeneration = fieldNameToValue.countSleepTime + 50;

    const data: RequestInit = {
      body: JSON.stringify(fieldNameToValue),
      method: "POST"
    };

    terminal.clearTerminal();

    fetch("/api/start_number", data).catch((evtErr: Error): void =>
      terminal.writeInTerminal(`Произошла ошибка: ${evtErr}`)
    );
  }

  // run - запуск скрипта
  run(): void {
    this.connectSocket();
    webForm.addEventListener("submit", this.onGenNumbSubmit.bind(this));
    console.log(WebRanges);

    WebRanges.addEventListener("input", this.changeTextByEvent.bind(this));
  }
}

document.addEventListener("DOMContentLoaded", (): void => {
  const app: App = new App();
  app.run();
});
