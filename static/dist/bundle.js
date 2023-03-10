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
/***/ (function() {

eval("var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nconst ranges = document.querySelector(\".ranges\");\r\nconst webTerminal = document.getElementById(\"web-terminal\");\r\n//onRange - изменение  ползунка в классе ranges\r\nfunction onRangesRange(e) {\r\n    let inputRange = e.target;\r\n    let name = inputRange.name;\r\n    let value = inputRange.value;\r\n    let valueName = \"#value-\" + name;\r\n    ranges.querySelector(valueName).textContent = value;\r\n}\r\n///api/start_number\r\n//onGenNumbSumbit - отправка запроса на генерацию\r\nfunction onGenNumbSumbit(e) {\r\n    e.preventDefault();\r\n    let fieldNameToValue = {\r\n        countBlock: 5,\r\n        countNumber: 10,\r\n    };\r\n    let form = e.target;\r\n    let ranges = form.querySelectorAll('input[type=\"range\"]');\r\n    ranges.forEach((rangeEL) => {\r\n        let range = rangeEL;\r\n        fieldNameToValue[range.name] = +range.value;\r\n    });\r\n    let data = {\r\n        body: JSON.stringify(fieldNameToValue),\r\n        method: \"POST\",\r\n    };\r\n    clearTerminal();\r\n    fetch(\"/api/start_number\", data)\r\n        .then((e) => console.log(e))\r\n        .catch((e) => {\r\n        writeInTerminal(\"Произошла ошибка\");\r\n    });\r\n}\r\nfunction writeInTerminal(value) {\r\n    webTerminal.textContent += value + \" \";\r\n    webTerminal.scrollTo(0, webTerminal.scrollHeight);\r\n    // let child = document.createElement('p')\r\n    // webTerminal.appendChild(child)\r\n}\r\nfunction clearTerminal() {\r\n    webTerminal.textContent = \"\";\r\n    // let childsP = webTerminal.querySelectorAll('p')\r\n    // childsP.forEach(childs => {\r\n    //   webTerminal.removeChild(childs)\r\n    // })\r\n}\r\n(() => __awaiter(this, void 0, void 0, function* () {\r\n    // ranges.addEventListener('change' ,  onRangesRange)\r\n    ranges.addEventListener(\"input\", onRangesRange);\r\n    document\r\n        .querySelector(\"#form-gen-number\")\r\n        .addEventListener(\"submit\", onGenNumbSumbit);\r\n    let socket = new WebSocket(\"ws://127.0.0.1:8080/ws\");\r\n    socket.onopen = function (e) {\r\n        console.log(\"openen\");\r\n        socket.send(\"hellWord\");\r\n        console.log(e);\r\n    };\r\n    socket.onmessage = function (event) {\r\n        let data = event.data;\r\n        console.log(` ${data}`);\r\n        writeInTerminal(data);\r\n    };\r\n}))();\r\n\n\n//# sourceURL=webpack://static/./src/script/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/script/index.ts"]();
/******/ 	
/******/ })()
;