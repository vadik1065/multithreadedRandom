package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/gorilla/websocket"

	generateNumber "multithreadedRandom/mymodule/generate_number"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}
var connSocket *websocket.Conn

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

	countBlock := myStoredVariable["countBlock"]
	countNumber := myStoredVariable["countNumber"]
	countSleepTime := myStoredVariable["countSleepTime"]

	generateNumber.NewGeneration(connSocket, countBlock, countNumber, countSleepTime)
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
