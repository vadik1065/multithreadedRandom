package main

import (
	"flag"
	"fmt"
	"math/rand"
	"sync"
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

// getRandomNumber - генирим рандомное число
func getRandomNumber(c *chan int, minNumber int, maxNumber int, res *bool) {

	for {

		mutex.Lock()
		resValue := *res
		mutex.Unlock()

		if !resValue {
			number := rand.Intn(maxNumber-minNumber) + minNumber
			*c <- number // если буфер не пуст то останавливается
			fmt.Printf("generate %d \n", number)
			// time.Sleep(time.Duration(number) * time.Second)
		}
	}
}

// awaitFillArrayNumbers - ждёт заполнение массива различными числами
func awaitFillArrayNumbers(channels *[]chan int, countNumber int, resChannel *chan bool) {
	var outputNumber []int

	for len(outputNumber) != countNumber {
		// time.Sleep(time.Duration(2) * time.Second)
		for _, c := range *channels {
			number := <-c
			if !contains(outputNumber, number) {
				outputNumber = append(outputNumber, number)
			}
		}
	}

	printSlice(&outputNumber)
	mutex.Lock()
	res = true
	mutex.Unlock()
	*resChannel <- true
}

var mutex sync.Mutex
var res bool

func main() {
	resChannel := make(chan bool)

	// парсим флаги

	var countBlock = flag.Int("blocks", 3, "sets the count block for random func")
	var countNumber = flag.Int("numbers", 10, "sets the count number for random func")
	flag.Parse()
	var minNumber = 0
	var maxNumber = *countNumber

	// fmt.Println(*countBlock)

	// потоки с рандомными числами
	var channels []chan int
	rand.Seed(time.Now().UnixNano())
	for i := 0; i < *countBlock; i++ {
		fmt.Println(i)
		c := make(chan int, 1)
		channels = append(channels, c)
		go getRandomNumber(&channels[i], minNumber, maxNumber, &res)
	}

	go awaitFillArrayNumbers(&channels, *countNumber, &resChannel)
	<-resChannel
}
