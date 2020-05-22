/*
    Author: Jessmer John Palanca
    Section: CSC337 Web Programming SPRING2019, Homework 10
    Filename: mymdb_service.js
    Description: The web service for the mymdb.js
*/
const express = require("express");
const app = express();
const mysql = require('mysql');
app.use(express.static('public'));

// use to request data from the imdb database
let con = mysql.createConnection({
    host: "mysql.allisonobourn.com",
    database: "csc337imdb",
    user: "csc337homer",
    password: "d0ughnut",
    debug: "true"
});

// making a connection to the database
con.connect(function(err){
    if (err){
        res.status(500);
        res.send(err);
    }
    console.log("CONNECTED");
});

// main function to fetch the data from the database
app.get('/', function(req, res){
    res.header("Access-Control-Allow-Origin", "*");
    // query variables from the client
    let mode = req.query.mode;
    let firstName = req.query.firstname;
    let lastName = req.query.lastname;

    // sql code to query from the database to get the actor's id
    let getID = "SELECT a.id " +
                "FROM actors a " +
                "WHERE a.first_name LIKE '" +
                firstName + "%' and a.last_name = '" + lastName +
                "' ORDER BY a.film_count DESC, a.id ASC LIMIT 1";

    // start querying for the actor's id
    con.query(getID, function(err, result, fields){
        if (err || result[0] == undefined) {
            // sends an empty object if the actor is not in the database
            res.send(JSON.stringify({}));
            return null;
        }
        // actor's id variable
        let id = result[0].id;

        // querying for the actor's movies from the database
        if (mode == "ActorMovies"){
            // sql code to query from the database to get the actor's movies
            let getMovies = "SELECT DISTINCT name, year " +
                            "FROM roles r " +
                            "JOIN movies m ON m.id = r.movie_id " +
                            "WHERE r.actor_id = '" + id +
                            "' ORDER BY year DESC, name ASC";
            // start querying for the actor's movies
            con.query(getMovies, function(err, result2, fields){
                if (err){
                     res.send(null);
                }
                res.send(result2);
            });
        }
        // querying for the actor's movies with Kevin Bacon from the database
        else{
            // sql code to query from the database to get the actor's movies
            // with Kevin Bacon
            let getMoviesWithKB = "SELECT DISTINCT name, year " +
                                "FROM movies m " +
                                "JOIN roles r ON r.movie_id = m.id " +
                                "JOIN actors a ON r.actor_id = '" + id + "' " +
                                "JOIN roles r2 ON r2.movie_id = m.id "+
                                "JOIN actors k ON r2.actor_id = k.id "+
                                "WHERE k.first_name = 'Kevin' and k.last_name = 'Bacon' " +
                                "ORDER BY year DESC, name ASC";
            // start querying for the actor's movies with Kevin Bacon
            con.query(getMoviesWithKB, function(err, result3, fields){
                if (err){
                    res.send(null);
                }
                res.send(result3);
            });
        }

    });
});
app.listen(3000);
