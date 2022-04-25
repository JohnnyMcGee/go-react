# Go - World's Oldest Strategy Game
## Overview
Web-app adaptation of Go - a strategic game similar to chess, but much older.  
The game board and pieces are react components, enabling fast, responsive, in-browser gameplay.  
For more information about the rules and history of Go: 
https://en.wikipedia.org/wiki/Go_(game)  
For those interested, **a demo of the app is hosted here:**
http://ec2-3-128-231-227.us-east-2.compute.amazonaws.com

NOTE: go-react is only a front end UI. It depends on a backend service to provide the game engine.
See [go-api](https://github.com/JohnnyMcGee/go-api), a REST api game engine written in the Go language.

### Under Construction!
In its current form, the app is just a game board. Anyone can view and play moves on the board.
Features currently under development include:
* Link sharing - Invite a friend to play by sending a link to a specific game session
* AI Opponent - Players can pit their skills against a community trained [neural net player](https://katagotraining.org/)
* Advanced settings - Allow users to choose board size, game rules, AI player configuration, etc.  

---
## Setup & Run *go-react* App
There are two ways to run this app on your machine.
* Using **create-react-app**
  * requires [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
  * requires [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app)
* Using **docker**
  * requires [docker](https://docs.docker.com/engine/install/)

### **Basic Setup**
1. Clone this repository
2. Run backend service (see setup instructions for [go-api](https://github.com/JohnnyMcGee/go-api).) Make a note of the address/url, you will use this in the next step. By default, go-api runs on 0.0.0.0:8080/
3. Create *config.js* inside of *go-react/client/src*: the app checks this file for its backend url. For example:
```js
    // replace localhost:8080 with your backend service address/url
    export const address = "http://localhost:8080"; 
```
4. Start the server using [create-react-app](#using-create-react-app) or [docker](#using-docker)
### Using **create-react-app**
1. Install express server. Inside go-react/server, run:  
```npm install express```
2. Install client dependencies. In go-react/client, run:  
```npm install```
3. Build app and run express server, or run react dev server:  
```npm run build && node ./server/server.js```  
OR  
```npm run start```

NOTE: By default, react apps run on port 3000. Using an Nginx server is one way to proxy traffic from port 80, the default for http.

### Using **docker**
1. Build. Inside go-react, run:  
   ```docker build -t go-react:some-tag .```
2. Run on port 80 (default for http)  
   ```docker run -t -d -p 80:3000 go-react:some-tag```

