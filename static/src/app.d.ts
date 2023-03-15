// информация о вебе
export interface IInfoForWeb {
  // webTerminal - элемент терминал
  webTerminal: HTMLDivElement
  // webForm - элемент форма
  webForm: HTMLFormElement
  // WebRanges - элемент блок с ползунками
  WebRanges: HTMLElement
  // btnSubmit - элемент кнопка отправки формы
  btnSubmit: HTMLButtonElement
  // addressForConnectSocket - адрес для подключения сокета
  addressForConnectSocket: string
  // prefixIDValue - префикс для ИД значений
  prefixIDValue: string
  // ClassRange - класс ползунка
  ClassRange: string
}

// TFieldNameToValue - имена и значение контроллеров ( ползунков )
export type TFieldNameToValue = { [key: string]: number }
