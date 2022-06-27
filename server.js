import { ApolloServer, gql } from "apollo-server";

let tweets = [
  {
    id: "1",
    text: "first one",
    userId: "2",
  },
  {
    id: "2",
    text: "second one",
    userId: "1",
  },
];

let users = [
  {
    id: "1",
    username: "first",
    firstname: "Wassup",
    lastname: "Man1",
  },
  {
    id: "2",
    username: "second",
    firstname: "Wassup",
    lastname: "Man2",
  },
];

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    firstname: String!
    lastname: String!
    """
    Is the sum of firstName + lastName as a String
    """
    fullname: String
  }
  """
  Tweet object represents a resource for a tweet
  """
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    """
    Selects All User Informations.
    """
    allUsers: [User!]!
    """
    Selects All Tweet Informations.
    """
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }
  type Mutation {
    """
    Inserts a Tweet
    """
    postTweet(text: String!, userId: ID!): Tweet!
    """
    Deletes a Tweet if found, else returns false
    """
    deleteTweet(id: ID!): Boolean!
    updateTweet(id: ID!, text: String!): Boolean!
  }
`;

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    allUsers() {
      return users;
    },
  },
  Mutation: {
    postTweet(root, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
    updateTweet(_, { id, text }) {
      const tmp = tweets.find((tweet) => tweet.id === id);
      if (!tmp) return false;
      tmp.text = text;
      console.log(tweets.findIndex((tweet) => tweet.id === id));
      return true;
    },
  },
  User: {
    firstname({ firstname }) {
      return firstname;
    },
    fullname({ firstname, lastname }) {
      return `${firstname} ${lastname}`;
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
