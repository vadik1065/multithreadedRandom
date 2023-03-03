package main

import (
	"flag"
	"fmt"
	"math/rand"
	"sync"
	"time"
)

var wg sync.WaitGroup

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
func addToArrayRandomNumber(randomNumbers *[]int, minNumber *int, maxNumber *int) {
	fmt.Println("init")

	// time.Sleep(1 * time.Second)
	number := rand.Intn(*maxNumber-*minNumber) + *minNumber
	fmt.Println(number)
	if !contains(*randomNumbers, number) {
		*randomNumbers = append(*randomNumbers, number)
	}
	defer wg.Done()
}

func main() {
	var randomNumbers []int

	// парсим флаги

	var countBlock = flag.Int("count", 3, "sets the count block for random func")
	var minNumber = flag.Int("min", 1, "sets the min number for random func")
	var maxNumber = flag.Int("max", 10, "sets the max number for random func")
	flag.Parse()

	// fmt.Println(*countBlock)

	// потоки с раномными числами
	rand.Seed(time.Now().UnixNano())
	for i := 1; i <= *countBlock; i++ {
		wg.Add(1)
		go addToArrayRandomNumber(&randomNumbers, minNumber, maxNumber)
	}
	wg.Wait()

	printSlice(&randomNumbers)

}
