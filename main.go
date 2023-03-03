package main

import (
	"flag"
	"fmt"
	"math/rand"
	"time"
)

// вывод среза
func printSlice(s *[]int) {
	fmt.Printf(" %v\n", *s)
}

// включает ли срез элимент
func contains(numbers []int, number int) bool {
	for _, v := range numbers {
		if v == number {
			return true
		}
	}
	return false
}

// генирим рандомное число
func getRandomNumber(c *chan int, minNumber *int, maxNumber *int) {
	// fmt.Println("init")
	// time.Sleep(1 * time.Second)
	number := rand.Intn(*maxNumber-*minNumber) + *minNumber
	*c <- number
}

func main() {

	// парсим флаги

	var countBlock = flag.Int("count", 3, "sets the count block for random func")
	var minNumber = flag.Int("min", 1, "sets the min number for random func")
	var maxNumber = flag.Int("max", 10, "sets the max number for random func")
	flag.Parse()

	// fmt.Println(*countBlock)

	// потоки с рандомными числами
	var channels []chan int
	rand.Seed(time.Now().UnixNano())
	for i := 0; i < *countBlock; i++ {
		fmt.Println("iiii")
		fmt.Println(i)
		c := make(chan int)
		channels = append(channels, c)
		go getRandomNumber(&channels[i], minNumber, maxNumber)
	}

	var outputNumber []int

	for _, c := range channels {
		number := <-c
		if !contains(outputNumber, number) {
			outputNumber = append(outputNumber, number)
		}
	}

	printSlice(&outputNumber)

}
