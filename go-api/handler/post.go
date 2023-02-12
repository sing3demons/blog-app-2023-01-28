package handler

import (
	"bufio"
	"bytes"
	"context"
	"encoding/base64"
	"errors"
	"fmt"
	"image"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/disintegration/imaging"
	"github.com/gin-gonic/gin"
	"github.com/h2non/filetype"
	"github.com/sing3demons/blog/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func (tx *handler) collection() *mongo.Collection {
	return tx.db.Collection("posts")
}

func (h *handler) GetPosts(c *gin.Context) {
	posts := []model.Post{}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := h.collection().Find(ctx, bson.M{})

	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	if err := cursor.All(ctx, &posts); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"posts": posts})
}

func saveImage(imgStr string) (string, error) {
	dec, err := base64.StdEncoding.DecodeString(imgStr)
	if err != nil {
		return "", err
	}

	kind, err := filetype.Match(dec)
	if err != nil {
		return "", err
	}

	if kind == filetype.Unknown {
		return "", errors.New("unknown filetype")
	}

	s := strconv.FormatInt((time.Now().Unix() + time.Now().UnixMilli()), 12)

	filename := "uploads/" + "post" + "/" + "images" + "/" + strings.Replace(s, "-", "", -1)
	fileExt := kind.MIME.Subtype
	image := fmt.Sprintf("%s.%s", filename, fileExt)

	pwd, err := os.Getwd()
	if err != nil {
		return "", err
	}

	err = os.MkdirAll(pwd+"/uploads/post/images", 0755)
	if err != nil {
		return "", err
	}

	f, err := os.Create(image)
	if err != nil {
		return "", err
	}
	defer f.Close()

	if _, err := f.Write(dec); err != nil {
		return "", err
	}
	if err := f.Sync(); err != nil {
		return "", err
	}

	return image, nil
}

type Post struct {
	Title   string             `bson:"title" json:"title"`
	Summary string             `bson:"summary" json:"summary"`
	Content string             `bson:"content" json:"content"`
	Cover   string             `bson:"cover" json:"cover"`
	Author  primitive.ObjectID `bson:"author" json:"author"`
}

func (h *handler) CreatePost(c *gin.Context) {
	post := Post{}
	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	photoStr, err := ResizeImageFromBase64(post.Cover, 300)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	image, err := saveImage(photoStr)
	if image != "" && err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	document := Post{
		Title:   post.Title,
		Summary: post.Summary,
		Content: post.Content,
		Cover:   image,
		Author:  post.Author,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := h.collection().InsertOne(ctx, document)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"post": result})
}

func ResizeImageFromBase64(imgBase64 string, newHeight int) (string, error) {

	b64data := imgBase64[strings.IndexByte(imgBase64, ',')+1:]

	unBased, err := base64.StdEncoding.DecodeString(b64data)
	if err != nil {
		return "", fmt.Errorf("cannot decode base64 err=%v", err)
	}

	r := bytes.NewReader(unBased)
	// use library imaging
	// parse reader to image
	img, err := imaging.Decode(r)
	if err != nil {
		return "", err
	}

	// calculator new width of image
	newWidth := newHeight * img.Bounds().Max.X / img.Bounds().Max.Y

	// resize new image
	nrgba := imaging.Resize(img, newWidth, newHeight, imaging.Lanczos)

	return toBase64(nrgba)
}

func toBase64(dst *image.NRGBA) (string, error) {
	var b bytes.Buffer
	foo := bufio.NewWriter(&b)
	if err := imaging.Encode(foo, dst, imaging.JPEG); err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(b.Bytes()), nil
}
