import "./main.css";

const IDwebTerminal = "web-terminal";
const IDForm = "form-gen-number";

const ClassRanges = ".ranges";
const ClassBtnSubmit = ".btn-gen-numb";

const addresForConnectSocket = "ws://127.0.0.1:8080/ws";

const webTerminal = document.getElementById(IDwebTerminal);
const webForm = document.getElementById(IDForm);
const WebRanges = document.querySelector(ClassRanges);
const WebBtnSubmit = document.querySelector(ClassBtnSubmit);
const btnSumbit = document.querySelector(".btn-gen-numb") as HTMLButtonElement;

var sleepDelay: number;

// TerminalControl - управление терминалом
class TerminalControl {
  // елемент терминал
  terminal: HTMLElement;

  constructor(terminal: HTMLElement) {
    this.terminal = terminal;
  }

  // writeInTerminal - пишет в терминал
  writeInTerminal(value: string) {
    this.terminal.textContent += value + " ";
    this.terminal.scrollTo(0, this.terminal.scrollHeight);
  }

  // clearTerminal - очищает терминал
  clearTerminal() {
    this.terminal.textContent = "";
  }
}

const terminal = new TerminalControl(webTerminal);

// RangeControl - управление ползунками
class RangesControl {
  // блок с ползунками
  ranges: Element;

  // префикс для ИД элемента выводящего значения ползунка
  static prefixIDValue = "#value-";

  // RangesControl constructor - получаем селектор по которуму искать блок
  constructor(ranges: Element) {
    this.ranges = ranges;
  }

  // changeTextByEvent - меняем текст нужного елемента по событию
  changeTextByEvent(e: Event) {
    let inputRange = e.target as HTMLInputElement;
    let name = inputRange.name;
    let value = inputRange.value;
    let valueName = RangesControl.prefixIDValue + name;

    this.ranges.querySelector(valueName).textContent = value;
  }
}

// BtnSubmitControl - управление кнопкой отправки
class BtnSubmitControl {
  btnSubmit: Element;

  // RangesControl constructor - получаем селектор по которуму искать кнопку
  constructor(btnSubmit: Element) {
    this.btnSubmit = btnSubmit;
  }

  //onGenNumbSumbit - отправка запроса на генерацию
  onGenNumbSumbit(e: Event) {
    e.preventDefault();

    let fieldNameToValue: { [key: string]: number } = {
      countBlock: 5,
      countNumber: 10,
      countSleepTime: 0,
    };

    let form = e.target as HTMLFormElement;
    let ranges = form.querySelectorAll('input[type="range"]');

    ranges.forEach((rangeEL) => {
      let range = rangeEL as HTMLInputElement;
      fieldNameToValue[range.name] = +range.value;
    });

    sleepDelay = fieldNameToValue.countSleepTime + 50;

    let data: RequestInit = {
      body: JSON.stringify(fieldNameToValue),
      method: "POST",
    };

    terminal.clearTerminal();

    fetch("/api/start_number", data)
      .then((e) => console.log(e))
      .catch((e) => {
        terminal.writeInTerminal("Произошла ошибка");
      });
  }
}

class App {
  // подключение по сокуту
  connectSocket() {
    let socket = new WebSocket(addresForConnectSocket);
    let cleanId: ReturnType<typeof setTimeout>;

    socket.onopen = (e) => {
      socket.send("hellWord");
    };

    const clearDisable = (el: HTMLButtonElement) => (el.disabled = false);

    socket.onmessage = function (event) {
      // clearDisable - убирает свойство недоступности
      clearTimeout(cleanId);
      cleanId = setTimeout(clearDisable, sleepDelay, btnSumbit);
      btnSumbit.disabled = true;

      terminal.writeInTerminal(event.data);
    };

    socket.onerror = (e) => {
      console.log("err", e);
    };

    socket.onclose = (e) => {
      console.log("socket close", e);
    };
  }

  // слушатель ползунков
  rangesListener() {
    let rangesControl = new RangesControl(WebRanges);

    WebRanges.addEventListener(
      "input",
      rangesControl.changeTextByEvent.bind(rangesControl)
    );
  }

  // btnListener - слушатель кнопки
  btnListener() {
    let btnSubmitControl = new BtnSubmitControl(WebBtnSubmit);

    webForm.addEventListener(
      "submit",
      btnSubmitControl.onGenNumbSumbit.bind(btnSubmitControl)
    );
  }

  // run - запуск скрипта
  run() {
    this.connectSocket();
    this.rangesListener();
    this.btnListener();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let app = new App();
  app.run();
});
