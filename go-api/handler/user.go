package handler

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sing3demons/blog/model"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

func (u *userHandler) collection() *mongo.Collection {
	return u.db.Collection("users")
}

type User struct {
	UserName string `json:"username"`
	Password string `json:"password"`
}

func (h *userHandler) Register(c *gin.Context) {
	var user model.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	bPass, err := bcrypt.GenerateFromPassword([]byte(user.Password), 14)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	user.Password = string(bPass)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := h.collection().InsertOne(ctx, user)
	if err != nil || result == nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	fmt.Println(result)

	c.JSON(http.StatusCreated, gin.H{"user": user})
}
