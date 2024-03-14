Blog App (Assignment)
---------------------
/posts - get the posts
/posts/create - create a post
/likes/like - update the like
/likes/unlike - update the unlike
/comments - get the comments
/comments/create - create a comment

Post Model -> title: String, body: String, likes: [id, ref: Like], comments: [id, ref: Comment]
Like Model -> post: {id, ref: Post}, user: String
Comment Model -> post: {id, ref: Post}, body: String, user: String

- $push operator to create/update any entry in db
- $pull operator to delete any entry in db
- populate() is used to replace the id's saved inside the array with the original data of that id (comment/like object)
- exec() is used to execute the query

Basics of Backend
-----------------
- Client sends a request to `www.google.com` then the string is converted to ip address by `DNS Resolver` which does this job and then we get the ip address back then the `request` is made to the google server and we get back the `response` in the browser.

- `Express` is used for server and `MongoDB` is the database and `Mongoose` helps to connect the server and database as we can write queries in mongoose to do `CRUD operations` in database.

- `Port` refers to a number/address where communication of service/application happens as there can be multiple services/applications running on the same machine but they have different `Port Numbers`

- `Middleware` is a function that catches the incoming `HTTP requests` and can perform various actions by modifying the request/response objects and invokes the next middleware function when the task is done. Eg: Logging requests, Authentication, Parsing, Error handling and we can invoke middleware functions using `app.use()` method

- `Mounting` is the process of attaching routes to specific paths in express as this allows to create a clean and modular structure. Eg: ``` app.use("/users", userRouter)
app.use("/products", productRouter) ```

- `MVC` model stands for Model-View-Controller is a pattern used to separate the app's concerns into 3 interconnected components. `Models` contains the data we defined and structured, `Controllers` contains all the functionality/request handlers that handles all the requests/response and do operations accordingly, Views contains the UI of the application

