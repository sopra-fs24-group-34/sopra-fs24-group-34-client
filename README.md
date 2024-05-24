<p>
  <img src="public/favicon.ico" alt="Guess Who Logo" width="216" height="40">
</p>

# SoPra FS24 group 34 Client - Guess Who?

## Introduction

Does the person have brown eyes? No! Did you forget this game? "Guess Who" is back. We implemented the traditional tabletop game where users have to guess characters by asking yes or no questions.
The rules are simple:

1. **Setup**: Each player selects a character card without revealing it to their opponent. This card represents the character the opponent must guess.
2. **Taking Turns**: Players take turns asking yes or no questions about the opponent's character in order to narrow down the possibilities.
3. **Elimination**: Based on the answers to the questions, players can start eliminating characters that do not fit the description until they are confident enough to make a guess.
4. **Winning**: The first player to correctly guess their opponent's character wins the game!

## Table of Contents

1. [Introduction](#introduction)
2. [Technologies](#technologies)
3. [High-level Components](#HLC)
4. [Launch & Deployment](#LD)
5. [Interface User Flow](#IUF)
6. [Roadmap](#roadmap)
7. [Authors and Acknowledgment](#AAA)
8. [Licencse](#licence)
9. [Further Material](#FM)
   1. [UML Diagram](#uml)
   2. [Component Diagram](#component)
   3. [Activity Diagram](#activity)
   4. [Figma Mockups](#figma)

## Technologies

For the frontend we used TypeScript and React. For styling we used SCSS.

To establish a connection between the front- and backend REST is used. When creating a lobby and eventually playing a game a stomp websocket connection gets established.

## High-level Components

The [Menu](https://github.com/sopra-fs24-group-34/sopra-fs24-group-34-client/blob/main/src/components/views/Menu.tsx) screen is the first entry point of a newly registered or logged-in user. Here, a user can switch between different content via the navbar, create a new lobby, or join an already existing lobby using the lobby code.

The [Lobby](https://github.com/sopra-fs24-group-34/sopra-fs24-group-34-client/blob/main/src/components/views/Lobby.tsx) view is used to gather all the relevant information to create a game. The lobby host can choose the number of strikes in the game, invite his/her friends, and start the game. Starting the game sends a message to the backend via a stomp websocket connection to create the game with its configurations, redirects the host to the pregame and further notifies the joinee to also navigate to the pregame. 

The [CharacterGrid](https://github.com/sopra-fs24-group-34/sopra-fs24-group-34-client/blob/main/src/components/views/Game-components/CharacterGrid.tsx) component is the main component of the frontend. It handles the logic of the game, like picking and guessing a character, as well as switching turns between the users.

The [ChatLog](https://github.com/sopra-fs24-group-34/sopra-fs24-group-34-client/blob/main/src/components/views/Game-components/ChatLog.tsx) component contains the logic of sending, receiving, and displaying messages. Furthermore, it also handles the logic of switching turns between the users.

The Lobby, CharacterGrid, and ChatLog all use the [WebSocketService](https://github.com/sopra-fs24-group-34/sopra-fs24-group-34-client/blob/main/src/components/views/WebSocketService.tsx) using a stomp WebSocket. It establishes the connection to the server, subscribes to the correct endpoint, and disconnects the WebSocket. 

## Launch & Deployment

- npm run dev
  Runs the app in the development mode. Open http://localhost:3000 to view it in the browser. The page will reload if you make edits. You will also see any lint errors in the console.

- npm run build
  Builds the app for production to the build folder. It correctly bundles React in production mode and optimizes the build for the best performance.

  The build is minified and the filenames include the hashes. Your app is ready to be deployed!

## Interface User Flow

### Menu

The first screen a logged-in / registered user sees is the "Menu" screen. Here, the user can view the global leaderboard, his friends and pending friend requests, and view his/her profile and lobby invitations from his/her friends. Further, the user can click on "Create new Lobby" to host a lobby or "join lobby" to join an existing one.

![Menu](img_README/Menu.png)

### Lobby

After hosting / joining a lobby, the user can:

- specify the number of strikes in the game,
- click and read the game explanation,
- view the current user(s) in the lobby,
- ready-up or start the game,
- and invite his/he friends that are online (only usable by the host).

![Lobby](img_README/Lobby.png)

### Pregame

After starting the game, the host is able to replace images that are not suited or disliked. By hovering over one of the characters, an overlay displays with a "replace" button.
Whenever the host is satisfied with the characters and their images, he/she can click on "accept characters" to finally start the game.

![Pregame](img_README/Pregame.png)

### Game

In game, the users have a variety of options:
 - First, both users need to pick characters for their opponent to guess.
 - After that, they take turns by:
    - either making a guess and potentially winning the game,
    - or asking a yes-no-question to reduce the pool of possible characters.
- Current instructions are provided to help users understand what to do.
- If needed, a user can click on the "help" button to get additional information displayed.

![Game](img_README/Game.png)

### Endscreen

![Endscreen](img_README/Endscreen.png)

## Roadmap

### 3D animations 
- Create 3D animations for folding respectively unfolding the characters during the game.

### Individual profile picture
- Allow users to upload individual profile pictures.

### Extending the game
- Allow users to select what type of category the images in game should be. 
- For example, a user could select "cats" as category and then play "Guess Who?" with cats instead of people.


## Authors and Acknowledgment

- [Smail Alijagic](https://www.github.com/smailalijagic)
- [Dario Giuliani](https://github.com/DarioTheCoder)
- [Nedim Jukic](https://github.com/nedim-j)
- [Liam Kontopulos](https://github.com/LiamK21)
- [Till Sollberger](https://github.com/Tillsollberger)

We want to express our sincere gratitude to [Marco Leder](https://www.github.com/marcoleder) for his outstanding expertise and support throughout the development of our project.

## Licencse

[MIT license](https://github.com/sopra-fs24-group-34/sopra-fs24-group-34-client/blob/main/LICENSE)

## Appendix

- [UML Diagram](https://lucid.app/lucidchart/bdc43c7c-3a02-4163-9724-150a430a899a/edit?invitationId=inv_7c71d23b-ad34-4ca4-b878-67235064b5df&page=0_0#)
- [Component Diagram](https://lucid.app/lucidchart/49acbc96-3e66-4064-99c4-4174bcf3b833/edit?invitationId=inv_56df17db-d1b8-4ae0-b4c8-e27462ec2213&page=0_0#)
- [Activity Diagram](https://lucid.app/lucidchart/e5d280ab-f80c-4e6c-8c0b-7544ba9b8936/edit?invitationId=inv_10376661-1660-47e2-b32b-fbf7d82989de&page=0_0#)
- [Figma Mockups](https://www.figma.com/file/b6orEYoJfIJ8n25mSPVsY7/Untitled?type=design&node-id=0-1&mode=design&t=ch054pYdPzTn8U1s-0)
