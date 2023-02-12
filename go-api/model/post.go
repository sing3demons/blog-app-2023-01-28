package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Post struct {
	ID      primitive.ObjectID `bson:"_id" json:"_id"`
	Title   string             `bson:"title" json:"title"`
	Summary string             `bson:"summary" json:"summary"`
	Content string             `bson:"content" json:"content"`
	Cover   string             `bson:"cover" json:"cover"`
	Author  primitive.ObjectID `bson:"author" json:"author"`
}
