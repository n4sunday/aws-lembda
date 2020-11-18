// index.js

const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const AWS = require("aws-sdk");

const USERS_TABLE = process.env.USERS_TABLE;
const POST_TABLE = process.env.POST_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.json({ strict: false }));

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.get("/users/:userId", function (req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  };

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: "Could not get user" });
    }
    if (result.Item) {
      const { userId, name } = result.Item;
      res.json({ userId, name });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});

app.get("/users", function (req, res) {
  const params = {
    TableName: USERS_TABLE,
  };

  dynamoDb.scan(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: "Could not get user" });
    }
    if (result.Items) {
      res.json({ data: result.Items });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});

app.post("/users", function (req, res) {
  const { userId, name } = req.body;
  if (typeof userId !== "string") {
    res.status(400).json({ error: '"userId" must be a string' });
  } else if (typeof name !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: userId,
      name: name,
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: "Could not create user" });
    }
    res.json({ userId, name });
  });
});

app.post("/post", function (req, res) {
  const { post_id, title, message } = req.body;
  if (typeof post_id !== "string") {
    res.status(400).json({ error: '"post_id" must be a string' });
  } else if (typeof title !== "string") {
    res.status(400).json({ error: '"title" must be a string' });
  } else if (typeof message !== "string") {
    res.status(400).json({ error: '"message" must be a string' });
  }

  const params = {
    TableName: POST_TABLE,
    Item: {
      post_id: post_id,
      title: title,
      message: message,
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: "Could not create user" });
    }
    res.json({ post_id, title, message });
  });
});

app.get("/post", function (req, res) {
  const params = {
    TableName: POST_TABLE,
  };

  dynamoDb.scan(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: "Could not get user" });
    }
    if (result.Items) {
      res.json({ data: result.Items });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});

module.exports.handler = serverless(app);
