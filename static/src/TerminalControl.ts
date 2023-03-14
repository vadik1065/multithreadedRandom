// TerminalControl - управление терминалом
export class TerminalControl {
  // елемент терминал
  terminal: HTMLElement;

  constructor(terminal: HTMLElement) {
    this.terminal = terminal;
  }

  // writeInTerminal - пишет в терминал
  writeInTerminal(value: string): void {
    this.terminal.textContent += value + " ";
    this.terminal.scrollTo(0, this.terminal.scrollHeight);
  }

  // clearTerminal - очищает терминал
  clearTerminal(): void {
    this.terminal.textContent = "";
  }
}
