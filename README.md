# Mafia Engine

Welcome to my MafiaEngine project! The point of this project is to minimise all tedious parts of hosting (or eventually, playing) a game of Forum Mafia so that you can continue to enjoy the best game you can and removing all of the stresses that may occur in any game.

The main aim for this project is that there should be no necessary preparing in order to find use in this tool, although the more _planning_ you do will give more specialised results.

**Technology Stack:** ERN Stack (ExpressJS, ReactJS and NodeJS). I am also using SocketIO for allowing the client to receive regular progress updates, which is essential for good user experience as a large portion of this tool ends up having semi-long periods of process times.

**Status:** Beta V3

## What Is Forum Mafia?

If you are unaware of what Forum Mafia is, it's essentially an online game known as Mafia [(you may research here)](https://en.wikipedia.org/wiki/Mafia_%28party_game%29) played inside of online forums, my focus for this project is specifically [MafiaScum](https://mafiascum.net) but this will also work with most other phpbb based forums that use bbcode.

## Features

There's an assortment of different tools/functionality that this project is currently able to achieve and many more planned. Features that are currently available are:

-   Vote Counter
-   Replacement Form Generator
-   Role Card Formatting

The Replacement Form Generator and the Vote Counter all require information from the forums site, but since this is an external tool and most phpbb forum sites do not have an API to be used, a screen-scraper has been created to scrape relevant data and format it appropriately.

## Usage

You may access the latest release by visiting [Mafia Engine](http://mafiaengine.com) online, if you wish to run the development build you may access the development version at [Mafia Engine Staging](http://stage.mafiaengine.com)
