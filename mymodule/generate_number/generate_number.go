package generatenumber

import (
	"fmt"
	"math/rand"
	custemUtils "multithreadedRandom/mymodule/custem_utils"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

var outputNumber []int
var mutex sync.Mutex
var mutexSocket sync.Mutex
var stopGenerate bool
var countBlock = 3
var countNumber = 10
var countSleepTime = 0
var connSocket *websocket.Conn

// generateNumber - генерация чисел для потоков
func generateNumber(c chan int, minNumber int, maxNumber int) {

	number := rand.Intn(maxNumber-minNumber) + minNumber
	custemUtils.WriteNumberWS(connSocket, &mutexSocket, number)
	if countSleepTime != 0 {
		time.Sleep(time.Duration(countSleepTime) * time.Millisecond)
	}

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

	if !custemUtils.Contains(outputNumber, number) {
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
func NewGeneration(connSocketVal *websocket.Conn, countBlockVal int, countNumberVal int, countSleepTimeVal int) {

	countBlock = countBlockVal
	countNumber = countNumberVal
	connSocket = connSocketVal
	countSleepTime = countSleepTimeVal
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
	custemUtils.WriteNumbersWS(connSocket, &mutexSocket, outputNumber)
}
