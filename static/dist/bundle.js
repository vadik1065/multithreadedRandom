/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/script/index.ts":
/*!*****************************!*\
  !*** ./src/script/index.ts ***!
  \*****************************/
/***/ (() => {

eval("const ranges = document.querySelector(\".ranges\");\r\n//onRange - изменение  ползунка в классе ranges\r\nfunction onRangesRange(e) {\r\n    let inputRange = e.target;\r\n    let name = inputRange.name;\r\n    let value = inputRange.value;\r\n    let valueName = \"#value-\" + name;\r\n    ranges.querySelector(valueName).textContent = value;\r\n}\r\n///api/start_number\r\n//onGenNumbSumbit - отправка запроса на генерацию\r\nfunction onGenNumbSumbit(e) {\r\n    e.preventDefault();\r\n    let fieldNameToValue = {\r\n        countBlock: 5,\r\n        countNumber: 10,\r\n    };\r\n    let form = e.target;\r\n    let ranges = form.querySelectorAll('input[type=\"range\"]');\r\n    ranges.forEach((rangeEL) => {\r\n        let range = rangeEL;\r\n        fieldNameToValue[range.name] = +range.value;\r\n    });\r\n    let data = {\r\n        body: JSON.stringify(fieldNameToValue),\r\n        method: \"POST\",\r\n    };\r\n    fetch(\"/api/start_number\", data)\r\n        .then((e) => console.log(\"succ\", e))\r\n        .catch((e) => console.log(\"catch\", e));\r\n}\r\n(() => {\r\n    // ranges.addEventListener('change' ,  onRangesRange)\r\n    ranges.addEventListener(\"input\", onRangesRange);\r\n    document\r\n        .querySelector(\"#form-gen-number\")\r\n        .addEventListener(\"submit\", onGenNumbSumbit);\r\n})();\r\n\n\n//# sourceURL=webpack://static/./src/script/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/script/index.ts"]();
/******/ 	
/******/ })()
;