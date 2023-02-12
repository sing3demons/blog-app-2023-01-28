package main

import (
	"os"

	"github.com/gin-gonic/gin"
	"github.com/sing3demons/blog/db"
	"github.com/sing3demons/blog/routes"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	db.ConnectMongoDB()

	r := gin.Default()

	routes.Router(r)

	r.Run(":" + port)
}
