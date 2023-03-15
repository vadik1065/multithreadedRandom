import { IInfoForWeb, TFieldNameToValue } from "./app.d";
import { TerminalControl } from "./terminalControl/TerminalControl";

export class App {
  // задержка перед каждой генерацией
  delayGeneration: number;
  terminal: TerminalControl;
  infoWeb: IInfoForWeb;

  constructor(infoWeb: IInfoForWeb) {
    this.delayGeneration = 0;
    this.infoWeb = infoWeb;
    this.terminal = new TerminalControl(infoWeb.webTerminal);
  }

  // подключение по сокету
  private connectSocket(): void {
    const socket: WebSocket = new WebSocket(this.infoWeb.addressForConnectSocket);
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
      cleanId = setTimeout(clearDisable, this.delayGeneration, this.infoWeb.btnSubmit);
      this.infoWeb.btnSubmit.disabled = true;

      this.terminal.writeInTerminal(event.data);
    }.bind(this);

    // onerror - пришла ошибка
    socket.onerror = (): void => this.terminal.writeInTerminal(`произошла ошибка`);

    // onclose - соединение закрылось
    socket.onclose = (): void => this.terminal.writeInTerminal(`соединение закрылось`);
  }

  // changeTextByEvent - меняем текст нужного елемента по событию
  private changeTextByEvent(e: Event): void {
    const inputRange: HTMLInputElement = e.target as HTMLInputElement;
    if (!inputRange) return;
    const name: string = inputRange.name;
    const value: string = inputRange.value;
    const valueName: string = this.infoWeb.prefixIDValue + name;

    const spanForValue: HTMLElement = this.infoWeb.WebRanges?.querySelector(valueName);
    if (spanForValue) spanForValue.textContent = value;
  }

  // onGenNumbSubmit - отправка запроса на генерацию
  private onGenNumbSubmit(e: Event): void {
    e.preventDefault();

    // fieldNameToValue - объект с дефолтными значениями
    const fieldNameToValue: TFieldNameToValue = {
      countBlock: 5,
      countNumber: 10,
      countSleepTime: 0
    };

    const form: HTMLFormElement = e.target as HTMLFormElement;
    const ranges: NodeListOf<Element> = form.querySelectorAll(this.infoWeb.ClassRange);

    ranges?.forEach((rangeEL: Element): void => {
      const range: HTMLInputElement = rangeEL as HTMLInputElement;
      if (range) fieldNameToValue[range.name] = +range.value;
    });

    this.delayGeneration = fieldNameToValue.countSleepTime + 50;

    const data: RequestInit = {
      body: JSON.stringify(fieldNameToValue),
      method: "POST"
    };

    this.terminal.clearTerminal();

    fetch("/api/start_number", data).catch((evtErr: Error): void =>
      this.terminal.writeInTerminal(`Произошла ошибка: ${evtErr}`)
    );
  }

  // run - запуск скрипта
  public run(): void {
    this.connectSocket();
    this.infoWeb.webForm?.addEventListener("submit", this.onGenNumbSubmit.bind(this));
    this.infoWeb.WebRanges?.addEventListener("input", this.changeTextByEvent.bind(this));
  }
}
