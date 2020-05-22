/*
    Author: Jessmer John Palanca
    Section: CSC337 Web Programming SPRING2019, Homework 10
    Filename: mymdb.js
    Description: The json file for the mymdb.html
*/

'use strict';

(function() {
    // global variable that stores the mode, actor's first and last name values
    let mode = "";
    let firstName = "";
    let lastName = "";

    window.onload = function(){
        document.getElementById("result").style.display = "none";
        document.getElementById("firstBtn").onclick = firstButton;
        document.getElementById("secondBtn").onclick = secondButton;
    };

    /** This function grabs the first input values when the user clicks the first
      * button. Sets these values to the corresponding global variables.
    */
    function firstButton(){
        let id = document.getElementById("firstBtn");
        mode = id.getAttribute("name");
        firstName = document.getElementById("AMFirstName").value;
        lastName = document.getElementById("AMLastName").value;
        // clearing the input box after the button is clicked
        document.getElementById("AMFirstName").value = "";
        document.getElementById("AMLastName").value = "";
        // calling the fetch function
        fetchMovies();
    }

    /** This function grabs the second input values when the user clicks the second
      * button. Sets these values to the corresponding global variables.
    */
    function secondButton(){
        let id = document.getElementById("secondBtn");
        mode = id.getAttribute("name");
        firstName = document.getElementById("AMKBFirstName").value;
        lastName = document.getElementById("AMKBLastName").value;
        // clearing the input box after the button is clicked
        document.getElementById("AMKBFirstName").value = "";
        document.getElementById("AMKBLastName").value = "";
        // calling the fetch function
        fetchMovies();
    }

    /** This is the main function for fetching the json data passed by the
      * service.
    */
    function fetchMovies(){
        // display the result div
        document.getElementById("result").style.display = "block";
        // hide the intro div
        let intro = document.getElementById("intro");
        intro.innerHTML = "";
        // url for fetching the data from the service
        let url = "http://localhost:3000/?mode=" + mode + "&firstname=" +
                firstName + "&lastname=" + lastName;
        // fetching
        fetch(url)
            .then(checkStatus)
            .then(function(responseText){
                // converting the data into a json object
                let json = JSON.parse(responseText);
                // the data that is fetched is empty
                if(Object.keys(json).length == 0){
                    displayError();
                }
                else if(json.length > 0){
                    displayTable(json);
                }

            })
            // catches any error and display the error in the error div
            .catch(function(error){
                let errorMsg = document.getElementById("error");
                errorMsg.innerHTML = error;
            });
    }

    /** This function takes the json data and add it into a table. The table will
      * be displayed in the result div.
    */
    function displayTable(json){
        // displays the table
        document.getElementById("table").style.display = "table";
        // hide the error div
        document.getElementById("error").style.display = "none";
        // displays the subtitle of the table
        displaySubtitle();
        // resets the table
        let table = document.getElementById("table");
        table.innerHTML = "";
        // setting up the table header
        let header = document.createElement("tr");
        let num = document.createElement("th");
        let _title = document.createElement("th");
        let yr = document.createElement("th");
        _title.innerHTML = "Title";
        num.innerHTML = "#";
        yr.innerHTML = "Year";
        header.appendChild(num);
        header.appendChild(_title);
        header.appendChild(yr);
        table.appendChild(header);
        // setting up the table data
        for(let i = 0; i < json.length; i++){
            let newRow = document.createElement("tr");
            let number = document.createElement("td");
            let title = document.createElement("td");
            let year = document.createElement("td");
            number.innerHTML = i+1;
            title.innerHTML = json[i].name;
            year.innerHTML = json[i].year;
            newRow.appendChild(number);
            newRow.appendChild(title);
            newRow.appendChild(year);
            table.appendChild(newRow);
        }
    }

    /** This function displays the table's subtitle.
    */
    function displaySubtitle(){
        let intro = document.getElementById("intro");
        let newH1 = document.createElement("h1");
        let newP = document.createElement("p");
        newP.className = "subtitle";
        newH1.innerHTML = "Results for " + firstName + " " + lastName;
        intro.appendChild(newH1);
        // subtitle for the actor's movies
        if (mode == "ActorMovies"){
            newP.innerHTML = "All films";
            intro.appendChild(newP);
        }
        // subtitle for actor's movies with Kevin Bacon
        else{
            newP.innerHTML = "Films with " + firstName + " " + lastName +
                            " and Kevin Bacon";
            intro.appendChild(newP);
        }
    }

    /** This function displays the error message in the error div
    */
    function displayError(){
        document.getElementById("table").style.display = "none";
        document.getElementById("error").style.display = "block";
        // actor is not found in the database
        if (mode == "ActorMovies"){
            let errorMsg = document.getElementById("error");
            errorMsg.innerHTML = "Actor " + firstName + " " + lastName + " " + "not found.";
        }
        // actor does not appear in any movies with Kevin Bacon
        else{
            let errorMsg = document.getElementById("error");
            errorMsg.innerHTML = firstName + " " + lastName + " " +
                                "wasn't in any films with Kevin Bacon.";
        }
    }

    /** This function checks and catches errors when the file is being fetched
    */
    function checkStatus(response) {
        if(response.status >= 200 && response.status < 300){
            return response.text();
        }
        else if(response.status === 400){
            return Promise.reject(new Error("Missing a mode parameter."));
        }
        else{
            return Promise.reject(new Error(response.status+": "+response.statusText));
        }
    }



})();
