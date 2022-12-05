# Connect Four
## How to get it going for ya
* First you gotta start XAMPP, and make sure the Apache and MySQL servers are both running for their respective servers
* Then copy the entire `connectFour/` folder into the base of Apache's configured host location
* From there just create a file named `credDB.ini` at `connectFour/PHP/` which should have the following:
    ```
    # The username and password section must be changed to accommodate your database credentials
    # The default MySQL port is 3306, but this part can depend on each person's systems, so be cautious
    server=localhost
    username=<your-db-username>
    password=<your-db-password>
    dbname=connectfour
    port=3306
    ```
* Then just go to `localhost/connectFour` in your browser (it can be on any kind, personally I use FireFox)
* From there, all of the databases should be created (if they don't already exist) upon registering, logging, or visiting the 'Leaderboards' page.