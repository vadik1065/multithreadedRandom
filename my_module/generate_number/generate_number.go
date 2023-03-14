package generate_number

import (
	"math/rand"
	customUtils "multithreadedRandom/my_module/custom_utils"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

type SCTinfoForGen struct {
	countBlock     int 
	countNumber    int
	countSleepTime int
	start          bool
	breakGenerate  bool
	connSocket     *websocket.Conn
}

var infoForGen = SCTinfoForGen{
	countBlock:     3,
	countNumber:    10,
	countSleepTime: 0,
	start:          false,
	connSocket:     nil,
	breakGenerate:  false,
}

var outputNumber []int
var mutex sync.Mutex
var mutexSocket sync.Mutex

func CheckStartGenerate() bool {
	return infoForGen.start
}

// SetCountParam - задаёт изменяемые параметры для Мапа
func SetCountParam(countBlock int, countNumber int, countSleepTime int) {
	infoForGen.countBlock = countBlock
	infoForGen.countNumber = countNumber
	infoForGen.countSleepTime = countSleepTime
}

// SetCountParam -  задаёт сокет для Мапа
func SetSocket(connSocket *websocket.Conn) {
	infoForGen.connSocket = connSocket
}

// StopGenerate - останавливает текущую генерацию и запускает новую
func StopGenerate() {
	infoForGen.breakGenerate = true
}

// generateNumber - генерация чисел для потоков
func generateNumber(c chan<- int, minNumber int, maxNumber int) {

	number := rand.Intn(maxNumber-minNumber) + minNumber
	customUtils.WriteNumberWS(infoForGen.connSocket, &mutexSocket, number)
	if infoForGen.countSleepTime != 0 {
		time.Sleep(time.Duration(infoForGen.countSleepTime) * time.Millisecond)
	}

	mutex.Lock()
	if infoForGen.start {
		// fmt.Printf("generate %d \n", number)
		c <- number
	}
	mutex.Unlock()
}

// проверяет количество цифр в массиве
func checkCountNumber(countNumber int, number int, goodChannel chan<- bool, badChannel chan<- bool) {

	if !customUtils.Contains(outputNumber, number) {
		outputNumber = append(outputNumber, number)
	}

	if len(outputNumber) == countNumber || infoForGen.breakGenerate {

		mutex.Lock()
		infoForGen.start = false
		mutex.Unlock()

		goodChannel <- true
	} else {
		badChannel <- true
	}
}

//newGeneration - новая генерация чисел
func NewGeneration() {

	outputNumber = nil
	infoForGen.start = true
	numbersChannel := make(chan int)
	isGenerateChannel := make(chan bool)
	isResultChannel := make(chan bool)
	infoForGen.breakGenerate = false

	var minNumber = 0
	var maxNumber = infoForGen.countNumber

	rand.Seed(time.Now().UnixNano())

	for i := 0; i < infoForGen.countBlock; i++ {
		go generateNumber(numbersChannel, minNumber, maxNumber)
	}

	go func() {
		for {
			select {
			case number := <-numbersChannel:
				go checkCountNumber(infoForGen.countNumber, number, isResultChannel, isGenerateChannel)
			case <-isGenerateChannel:
				go generateNumber(numbersChannel, minNumber, maxNumber)
			}
		}
	}()

	<-isResultChannel
	customUtils.WriteNumbersWS(infoForGen.connSocket, &mutexSocket, outputNumber)
}
