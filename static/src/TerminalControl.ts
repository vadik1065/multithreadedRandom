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

export default TerminalControl;
