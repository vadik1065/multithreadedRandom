package main

import (
	"flag"
	"fmt"
	"math/rand"
	"time"
)

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
	// number := rand.Int()
	fmt.Printf("generate %d \n", number)
	// time.Sleep(time.Duration(5) * time.Second)
	c <- number

}

// проверияет колличество цифр в массиве
func checkCountNumber(countNumber int, number int, goodChannel chan bool, badChannel chan bool) {

	if !contains(outputNumber, number) {
		outputNumber = append(outputNumber, number)
	}

	if len(outputNumber) == countNumber {
		goodChannel <- true
	} else {
		badChannel <- true
	}
}

var outputNumber []int

func main() {
	numbersChannel := make(chan int)
	isGenerateChannel := make(chan bool)
	isResultChannel := make(chan bool)

	// парсим флаги

	var countBlock = flag.Int("blocks", 3, "sets the count block for random func")
	var countNumber = flag.Int("numbers", 10, "sets the count number for random func")
	flag.Parse()
	var minNumber = 0
	var maxNumber = *countNumber

	rand.Seed(time.Now().UnixNano())

	for i := 0; i < *countBlock; i++ {
		go generateNumber(numbersChannel, minNumber, maxNumber)
	}

	go func() {
		for {
			select {
			case number := <-numbersChannel:
				go checkCountNumber(*countNumber, number, isResultChannel, isGenerateChannel)
			case <-isGenerateChannel:
				go generateNumber(numbersChannel, minNumber, maxNumber)
			}
		}
	}()

	<-isResultChannel
	printSlice(&outputNumber)

}
