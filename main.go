package main

import (
	"flag"
	"fmt"
	"math/rand"
	"sync"
	"time"
)

var wg sync.WaitGroup

// printSlice - вывод среза
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

// addToArrayRandomNumber - генирим рандомное число
func addToArrayRandomNumber(randomNumbers *[]int, minNumber int, maxNumber int, endGeneration *int) {
	number := rand.Intn(maxNumber-minNumber) + minNumber
	// time.Sleep(1 * time.Second)
	time.Sleep(time.Duration(number) * time.Second)
	fmt.Printf("сгенерировано число %d \n", number)

	if !contains(*randomNumbers, number) {
		*randomNumbers = append(*randomNumbers, number)
	}
	*endGeneration++
}

// awaitGetAllNumber - дожидается получения всех чисел
func awaitGetAllNumber(countNumber int, countBlock int) {
	minNumber := 0
	maxNumber := countNumber

	var randomNumbers []int
	countAvailableGorutine := countBlock
	// endGeneration := 0

	// выполняется пока нет нужного количества чисел
	for len(randomNumbers) != countNumber {
		rand.Seed(time.Now().UnixNano())
		if countAvailableGorutine > 0 {
			countAvailableGorutine--
			// потоки с раномными числами
			go addToArrayRandomNumber(&randomNumbers, minNumber, maxNumber, &countAvailableGorutine)
		}
		// else if endGeneration != 0 {
		// 	countAvailableGorutine += endGeneration
		// 	endGeneration = 0
		// }

	}

	defer wg.Done()
	printSlice(&randomNumbers)

}

func main() {

	// парсим флаги
	var countBlock = flag.Int("blocks", 3, "sets the count block for random func")
	var countNumber = flag.Int("numbers", 10, "sets the count block for random func")
	// var minNumber = flag.Int("min", 1, "sets the min number for random func")
	// var maxNumber = flag.Int("max", 10, "sets the max number for random func")
	flag.Parse()

	wg.Add(1)
	go awaitGetAllNumber(*countNumber, *countBlock)

	wg.Wait()

}
