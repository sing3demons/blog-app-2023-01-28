package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	UserName string             `bson:"username" json:"username"`
	Password string             `bson:"password" json:"password"`
}
