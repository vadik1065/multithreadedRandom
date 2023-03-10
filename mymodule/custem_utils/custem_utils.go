package custemutils

import (
	"fmt"
	"strconv"
	"strings"
	"sync"

	"github.com/gorilla/websocket"
)

// contains - включает ли срез элимент
func Contains(numbers []int, number int) bool {
	for _, v := range numbers {
		if v == number {
			return true
		}
	}
	return false
}

// arrayToString - переводит массив в строку
func ArrayToString(a []int, delim string) string {
	return "\n" + strings.Replace(fmt.Sprint(a), " ", delim, -1)
}

//writeNumberWS - запись числа в веб сокет
func WriteNumberWS(connSocket *websocket.Conn, mutexSocket *sync.Mutex, number int) {
	mutexSocket.Lock()
	err := connSocket.WriteMessage(1, []byte(strconv.Itoa(number)))
	mutexSocket.Unlock()
	if err != nil {
		fmt.Println("Error during message writing:", err)
	}
}

//writeNumberWS - запись массива чисел в веб сокет
func WriteNumbersWS(connSocket *websocket.Conn, mutexSocket *sync.Mutex, numbers []int) {
	stringNumbers := ArrayToString(numbers, ", ")
	fmt.Println(stringNumbers)
	mutexSocket.Lock()
	err := connSocket.WriteMessage(1, []byte(stringNumbers))
	mutexSocket.Unlock()
	if err != nil {
		fmt.Println("Error during message writing:", err)
	}
}
