package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/sing3demons/blog/db"
	"github.com/sing3demons/blog/routes"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	db.ConnectMongoDB()
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{os.Getenv("ENV_URL")}
	corsConfig.AddAllowHeaders("Authorization")
	r := gin.Default()

	r.Use(cors.New(corsConfig))

	routes.Router(r)

	r.Run(":" + port)
}
