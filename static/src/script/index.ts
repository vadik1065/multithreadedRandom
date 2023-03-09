const ranges = document.querySelector(".ranges");

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
  fetch("/api/start_number", data)
    .then((e) => console.log("succ", e))
    .catch((e) => console.log("catch", e));
}

(() => {
  // ranges.addEventListener('change' ,  onRangesRange)
  ranges.addEventListener("input", onRangesRange);
  document
    .querySelector("#form-gen-number")
    .addEventListener("submit", onGenNumbSumbit);
})();
