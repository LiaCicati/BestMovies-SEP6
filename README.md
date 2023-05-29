# Best Movies SEP6 Project

- ### Link to the website :
<https://best-movies-sep-6.vercel.app/>

  - ### REST API :
<https://best-movies-sep6.azurewebsites.net/>

## Docker

1\. To run the project in a Docker container, open the terminal and navigate to the "BestMovies-SEP6" directory.

<pre>cd BestMovies-SEP6</pre>
2\. Run the following command in the terminal:

<pre>docker-compose up</pre>

After running docker-compose up in the terminal and if Docker Desktop is installed, it will create and start the containers defined in the Docker Compose YAML file.

3\.  Run the following command to stop the running containers:
<pre>docker-compose down</pre>

Alternatively, open Docker Desktop (if installed), locate the running containers and stop them from there.


---
##  API Routes and Methods
###  User collection [ /users ]

| Method | Endpoint       | Description          |
|--------|----------------|----------------------|
| POST   | `/signup`      | Register user        |
| POST   | `/signin`      | Login user           |
| GET    | `/me`          | Get user data        |
| PATCH  | `/me`          | Update user data     |

### Movie collection [ /movies ]

| Method | Endpoint       | Description          |
|--------|----------------|----------------------|
| POST   | `/`            | Add a favorite movie       |
| GET    | `/`            | Get all favorite movies|
| GET    | `/:movieId`    | Get a favorite movie by ID    |
| DELETE | `/:movieId`    | Delete a favorite movie       |

## Rating collection [ /ratings ]

| Method | Endpoint       | Description          |
|--------|----------------|----------------------|
| POST   | `/`            | Create a rating      |
| GET    | `/`            | Get all ratings      |
| GET    | `/:id`         | Get a rating by ID   |
| PATCH  | `/:id`         | Update a rating      |



------------------------------------------------------------------------------------------

## Contributors:

| Username       | Student              |
| ----------     | -------------------- |
| LiaCicati      | Lia Cicati           |
| LoredanaCicati | Loredana Cicati      |


---

