import "./main.less"
import { IInfoForWeb } from "./src/app.d"
import { App } from "./src/app"

const prefixIDValue: string = "#value-"

// ID
const IDwebTerminal: string = "web-terminal"
const IDForm: string = "form-gen-number"

// Классы
const ClassRange: string = ".range_input"
const ClassRanges: string = ".form-generation_ranges"
const ClassBtnSubmit: string = ".form-generation_btn"

const addressForConnectSocket: string = "ws://127.0.0.1:8080/ws"

// dgID - сокращение document.getElementById с нужным типом
function dgID<T = HTMLElement>(name: string): T {
  return document.getElementById(name) as unknown as T
}

// dq - сокращение document.querySelector с нужным типом
function dq<T = HTMLElement>(name: string): T {
  return document.querySelector(name) as unknown as T
}

document.addEventListener("DOMContentLoaded", (): void => {
  // элементы
  const webTerminal: HTMLDivElement = dgID<HTMLDivElement>(IDwebTerminal)
  const webForm: HTMLFormElement = dgID<HTMLFormElement>(IDForm)
  const WebRanges: HTMLElement = dq<HTMLElement>(ClassRanges)
  const btnSubmit: HTMLButtonElement = dq<HTMLButtonElement>(ClassBtnSubmit)

  const infoForWeb: IInfoForWeb = {
    webTerminal: webTerminal,
    webForm: webForm,
    WebRanges: WebRanges,
    btnSubmit: btnSubmit,
    addressForConnectSocket: addressForConnectSocket,
    prefixIDValue: prefixIDValue,
    ClassRange: ClassRange
  }

  const app: App = new App(infoForWeb)
  app.run()
})
