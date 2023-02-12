package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/sing3demons/blog/db"
	"github.com/sing3demons/blog/handler"
)

func Router(r *gin.Engine) {
	db := db.ConnectMongoDB()

	postHandler := handler.NewHandler(db)

	api := r.Group("/api")

	posts := api.Group("post")
	{
		posts.GET("/", postHandler.GetPosts)
		posts.POST("/", postHandler.CreatePost)
	}

	users := api.Group("auth")
	userHandler := handler.NewUserHandler(db)
	{
		users.POST("register", userHandler.Register)
	}
}
