package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

var outputNumber []int
var mutex sync.Mutex
var mutexSocket sync.Mutex
var stopGenerate bool
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}
var countBlock = 3
var countNumber = 10
var connSocket *websocket.Conn

// contains - включает ли срез элимент
func contains(numbers []int, number int) bool {
	for _, v := range numbers {
		if v == number {
			return true
		}
	}
	return false
}

// arrayToString - переводит массив в строку
func arrayToString(a []int, delim string) string {
	return "\n" + strings.Replace(fmt.Sprint(a), " ", delim, -1)
}

//writeNumberWS - запись числа в веб сокет
func writeNumberWS(number int) {
	mutexSocket.Lock()
	err := connSocket.WriteMessage(1, []byte(strconv.Itoa(number)))
	mutexSocket.Unlock()
	if err != nil {
		fmt.Println("Error during message writing:", err)
	}
}

//writeNumberWS - запись массива чисел в веб сокет
func writeNumbersWS(numbers []int) {
	stringNumbers := arrayToString(numbers, ", ")
	fmt.Println(stringNumbers)
	mutexSocket.Lock()
	err := connSocket.WriteMessage(1, []byte(stringNumbers))
	mutexSocket.Unlock()
	if err != nil {
		fmt.Println("Error during message writing:", err)
	}
}

// generateNumber - генерация чисел для потоков
func generateNumber(c chan int, minNumber int, maxNumber int) {

	number := rand.Intn(maxNumber-minNumber) + minNumber
	writeNumberWS(number)
	// time.Sleep(time.Duration(5) * time.Second)

	mutex.Lock()
	goGenerate := !stopGenerate
	if goGenerate {
		fmt.Printf("generate %d \n", number)
		c <- number
	}
	mutex.Unlock()
}

// проверяет количество цифр в массиве
func checkCountNumber(countNumber int, number int, goodChannel chan bool, badChannel chan bool) {

	if !contains(outputNumber, number) {
		outputNumber = append(outputNumber, number)
	}

	if len(outputNumber) == countNumber {

		mutex.Lock()
		stopGenerate = true
		mutex.Unlock()

		goodChannel <- true
	} else {
		badChannel <- true
	}
}

//newGeneration - новая генирация чисел
func newGeneration() {

	outputNumber = nil
	stopGenerate = false
	numbersChannel := make(chan int)
	isGenerateChannel := make(chan bool)
	isResultChannel := make(chan bool)

	var minNumber = 0
	var maxNumber = countNumber

	rand.Seed(time.Now().UnixNano())

	for i := 0; i < countBlock; i++ {
		go generateNumber(numbersChannel, minNumber, maxNumber)
	}

	go func() {
		for {
			select {
			case number := <-numbersChannel:
				go checkCountNumber(countNumber, number, isResultChannel, isGenerateChannel)
			case <-isGenerateChannel:
				go generateNumber(numbersChannel, minNumber, maxNumber)
			}
		}
	}()

	<-isResultChannel
	writeNumbersWS(outputNumber)
}

//startGenerateNumber - начинает генерацию чисел c параметрами полученными из фронта
func startGenerateNumber(w http.ResponseWriter, r *http.Request) {
	r.Header.Add("Content-Type", "application/json")
	body, err := ioutil.ReadAll(r.Body)

	if err != nil {
		fmt.Println(err)
		return
	}

	var myStoredVariable map[string]int
	err = json.Unmarshal(body, &myStoredVariable)

	if err != nil {
		fmt.Println(err)
		return
	}

	countBlock = myStoredVariable["countBlock"]
	countNumber = myStoredVariable["countNumber"]
	newGeneration()
}

// wsListenner - слушатель сокета
func wsListenner(w http.ResponseWriter, r *http.Request) {
	var err error
	connSocket, err = upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Print("Error during connection upgradation:", err)
		return
	}
	defer connSocket.Close()

	for {
		messageType, message, err := connSocket.ReadMessage()
		if err != nil {
			fmt.Println("Error during message reading:", err)
			break
		}
		fmt.Printf("Received: %d %s", messageType, message)
	}
}

// routing - маршрутизатор
func routing(mux *http.ServeMux) {
	mux.Handle("/", http.FileServer(http.Dir("./static/")))
	mux.HandleFunc("/api/start_number", startGenerateNumber)
}

func main() {
	muxBase := http.NewServeMux()
	muxForSocket := http.NewServeMux()

	go func() {
		muxForSocket.HandleFunc("/", wsListenner)
		err := http.ListenAndServe(":8080", muxForSocket)

		if errors.Is(err, http.ErrServerClosed) {
			fmt.Printf("socket closed\n")
		} else if err != nil {
			fmt.Printf("error starting socket: %s\n", err)
		}
	}()

	routing(muxBase)
	err := http.ListenAndServe(":80", muxBase)
	if errors.Is(err, http.ErrServerClosed) {
		fmt.Printf("server closed\n")
	} else if err != nil {
		fmt.Printf("error starting server: %s\n", err)
		os.Exit(1)
	}

}
