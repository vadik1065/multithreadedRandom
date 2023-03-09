package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"math/rand"
	"net/http"
	"os"
	"sync"
	"time"
)

var outputNumber []int
var mutex sync.Mutex
var stopGenerate bool
var isGeneration bool
var countBlock = 3
var countNumber = 10

//printSlice - вывод среза
func printSlice(s *[]int) {
	fmt.Printf(" %v\n", *s)
}

// contains - включает ли срез элимент
func contains(numbers []int, number int) bool {
	for _, v := range numbers {
		if v == number {
			return true
		}
	}
	return false
}

// generateNumber - генерация чисел для потоков
func generateNumber(c chan int, minNumber int, maxNumber int) {

	number := rand.Intn(maxNumber-minNumber) + minNumber
	// time.Sleep(time.Duration(5) * time.Second)
	mutex.Lock()
	goGenerate := !stopGenerate
	if goGenerate {
		fmt.Printf("generate %d \n", number)
		c <- number
	}
	mutex.Unlock()

}

// проверияет колличество цифр в массиве
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
	printSlice(&outputNumber)
}

//startGenerateNumber - начинает генирацию чисел
func startGenerateNumber(w http.ResponseWriter, r *http.Request) {
	// http.ServeFile(w, r, "./html/index.html")
	r.Header.Add("Content-Type", "application/json")
	isGeneration = true

	body, err := ioutil.ReadAll(r.Body)

	if err != nil {
		return
	}

	var myStoredVariable map[string]int
	err = json.Unmarshal(body, &myStoredVariable)

	if err != nil {
		return
	}

	countBlock = myStoredVariable["countBlock"]
	countNumber = myStoredVariable["countNumber"]

	newGeneration()
}

func main() {

	http.Handle("/", http.FileServer(http.Dir("./static/")))
	http.HandleFunc("/api/start_number", startGenerateNumber)

	err := http.ListenAndServe(":80", nil)
	if errors.Is(err, http.ErrServerClosed) {
		fmt.Printf("server closed\n")
	} else if err != nil {
		fmt.Printf("error starting server: %s\n", err)
		os.Exit(1)
	}

}
