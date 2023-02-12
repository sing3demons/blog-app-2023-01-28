package handler

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/sing3demons/blog/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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

func (h *userHandler) Profile(c *gin.Context) {
	id, _ := c.Get("userId")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	user := model.User{}

	objectID, err := primitive.ObjectIDFromHex(string(id.(string)))
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	filter := bson.M{"_id": objectID}

	if err := h.collection().FindOne(ctx, filter).Decode(&user); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"userId":   user.ID,
		"username": user.UserName,
	})
}

func (h *userHandler) RefreshToken(c *gin.Context) {
	id, _ := c.Get("userId")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	user := model.User{}

	objectID, err := primitive.ObjectIDFromHex(string(id.(string)))
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	filter := bson.M{"_id": objectID}

	if err := h.collection().FindOne(ctx, filter).Decode(&user); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	accessToken, err := generateFromAccessToken(user)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	refreshToken, err := generateFromRefreshToken(user)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	})
}

func (h *userHandler) Login(c *gin.Context) {
	var user User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var u model.User

	singleResult := h.collection().FindOne(ctx, bson.M{"username": user.UserName}).Decode(&u)

	if singleResult != nil {
		c.JSON(400, gin.H{"error": "User not found"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(user.Password)); err != nil {
		c.JSON(400, gin.H{"error": "Invalid password"})
		return
	}

	accessToken, err := generateFromAccessToken(u)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	refreshToken, err := generateFromRefreshToken(u)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	})
}

func generateFromAccessToken(u model.User) (string, error) {
	claims := jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(1 * time.Hour)),
		Issuer:    "sing3demons",
		Subject:   u.ID.Hex(),
	}

	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return jwtToken.SignedString([]byte(os.Getenv("ACCESS_TOKEN_SECRET")))
}

func generateFromRefreshToken(u model.User) (string, error) {
	claims := jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		Issuer:    "sing3demons",
		Subject:   u.ID.Hex(),
	}

	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return jwtToken.SignedString([]byte(os.Getenv("REFRESH_TOKEN_SECRET")))
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
