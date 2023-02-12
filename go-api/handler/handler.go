package handler

import (
	"go.mongodb.org/mongo-driver/mongo"
)

type handler struct {
	db *mongo.Database
}

func NewHandler(db *mongo.Database) *handler {
	return &handler{db: db}
}

type userHandler struct {
	db *mongo.Database
}

func NewUserHandler(db *mongo.Database) *userHandler {
	return &userHandler{db: db}
}
