package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/sing3demons/blog/db"
	"github.com/sing3demons/blog/handler"
	"github.com/sing3demons/blog/middleware"
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

	authenticate := middleware.JwtVerify()

	users := api.Group("auth")
	userHandler := handler.NewUserHandler(db)
	{
		users.POST("register", userHandler.Register)
		users.POST("login", userHandler.Login)
		users.Use(authenticate)
		users.GET("profile", userHandler.Profile)
	}
}
