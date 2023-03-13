import "../css/main.css";

const ranges = document.querySelector(".ranges");
const webTerminal = document.getElementById("web-terminal");
const btnSumbit = document.querySelector(".btn-gen-numb") as HTMLButtonElement;

//onRange - изменение  ползунка в классе ranges
function onRangesRange(e: Event) {
  let inputRange = e.target as HTMLInputElement;
  let name = inputRange.name;

  let value = inputRange.value;
  let valueName = "#value-" + name;

  ranges.querySelector(valueName).textContent = value;
}

//onGenNumbSumbit - отправка запроса на генерацию
function onGenNumbSumbit(e: Event) {
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

  let data: RequestInit = {
    body: JSON.stringify(fieldNameToValue),
    method: "POST",
  };
  clearTerminal();

  fetch("/api/start_number", data)
    .then((e) => console.log(e))
    .catch((e) => {
      writeInTerminal("Произошла ошибка");
    });
}

// writeInTerminal - пишет в терминал
function writeInTerminal(value: string) {
  webTerminal.textContent += value + " ";
  webTerminal.scrollTo(0, webTerminal.scrollHeight);
}

// clearTerminal - очищает терминал
function clearTerminal() {
  webTerminal.textContent = "";
}

(() => {
  // ranges.addEventListener('change' ,  onRangesRange)
  ranges.addEventListener("input", onRangesRange);
  document
    .querySelector("#form-gen-number")
    .addEventListener("submit", onGenNumbSumbit);

  let socket = new WebSocket("ws://127.0.0.1:8080/ws");

  socket.onopen = function (e) {
    console.log("openen");

    socket.send("hellWord");
    console.log(e);
  };

  const clearDisable = (el: HTMLButtonElement) => (el.disabled = false);

  let cleanId: ReturnType<typeof setTimeout>;

  // (btnSumbit as HTMLButtonElement).disabled = true;
  // console.log(btnSumbit);

  socket.onmessage = function (event) {
    clearTimeout(cleanId);
    cleanId = setTimeout(clearDisable, 40, btnSumbit);
    btnSumbit.disabled = true;

    writeInTerminal(event.data);
  };
})();
