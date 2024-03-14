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

Authentication & Authorization
-------------------------------
- Authentication is basically identity verification whether a user is registered/not so first he has to be registered then depending upon his permission and access rights he will be able to see things for different roles.

- Authorization is having permission / access rights to see things which are permitted for certain roles. Eg: normal user can see the dashboard but cannot visit course details, student or someone who bought the course can see the dashboard along with the course details, Admin can see the dashboard but different from what student sees as he can see every details of number of users, course bought, upload videos, video details and etc so different roles have different view of things.

JSON Web Tokens (JWT)
---------------------
- JWTs is used to securely authenticate users, verify their identity, and provide access to authorized resources.

- JWTs are composed of three parts: a header, a payload, and a signature. The header typically contains the type of the token (JWT), and the signing algorithm used. The payload contains the data being transmitted, such as the user's ID or email address. The signature is created by hashing the header and payload using a secret key, which can be used to verify the authenticity of the token.

- When a user logs into a web application, the server generates a JWT and sends it to the client as a response. The client can then include the JWT in the headers of subsequent requests to the server. The server can verify the authenticity of the token by checking the signature and decoding the payload.

- JWTs are commonly used in Single Sign-On (SSO) systems, where a user can authenticate once and access multiple web applications without having to re-enter their credentials. They are also used in token-based authentication systems, where the token is used instead of a username and password.

Cookies
-------
- Cookies are small text files that are stored on a user's computer when they visit a website. They are commonly used to store user preferences, shopping cart items, and session data. Cookies can also be used for authentication and authorization.

- When a user logs into a web application, the server can create a cookie that contains a unique identifier for the user's session. This cookie can then be sent to the client as a response. The client can include the cookie in subsequent requests to the server, allowing the server to identify the user and provide access to authorized resources.

- Cookies can be either session cookies or persistent cookies. Session cookies are stored in memory and are deleted when the user closes their browser. Persistent cookies are stored on the user's computer and are not deleted when the user closes their browser.

- Cookies have some disadvantages, including the fact that they can be easily tampered with and that they can be blocked by the user's browser. They also require additional server-side processing to store and retrieve the cookie data.

Conclusion of JWT and cookies
------------------------------
JWT tokens and cookies are both popular methods of authentication and authorization in web development. JWTs are self-contained and can be easily transmitted between parties, while cookies are stored on the user's computer and require additional server-side processing. Both methods have their advantages and disadvantages, and developers should choose the method that best fits their application's security and performance needs.

Signup process
--------------
- Got the data from the client/user side in req.body
- Validation of the data if the data is correct or not
- Checking if email already registered/not by doing db call `findOne({email})`
- If no email exists then encrypt the password using `bcrypt`
- Using the Model we use `create/save` method to create the data inside the `Database`

Login process
-------------
