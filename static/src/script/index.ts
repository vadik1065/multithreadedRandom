const ranges = document.querySelector(".ranges");
const webTerminal = document.getElementById("web-terminal");

//onRange - изменение  ползунка в классе ranges
function onRangesRange(e: Event) {
  let inputRange = e.target as HTMLInputElement;
  let name = inputRange.name;

  let value = inputRange.value;
  let valueName = "#value-" + name;

  ranges.querySelector(valueName).textContent = value;
}
///api/start_number

//onGenNumbSumbit - отправка запроса на генерацию
function onGenNumbSumbit(e: Event) {
  e.preventDefault();

  let fieldNameToValue: { [key: string]: number } = {
    countBlock: 5,
    countNumber: 10,
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

function writeInTerminal(value: string) {
  webTerminal.textContent += value + " ";
  webTerminal.scrollTo(0, webTerminal.scrollHeight);
  // let child = document.createElement('p')
  // webTerminal.appendChild(child)
}
function clearTerminal() {
  webTerminal.textContent = "";
  // let childsP = webTerminal.querySelectorAll('p')
  // childsP.forEach(childs => {
  //   webTerminal.removeChild(childs)
  // })
}

(async () => {
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

  socket.onmessage = function (event) {
    let data = event.data;
    console.log(` ${data}`);
    writeInTerminal(data);
  };
})();
