## Blog App (Assignment)
/posts - get the posts
/posts/create - create a post
/likes/like - update the like
/likes/unlike - update the unlike
/comments/create - create a comment
/comments/uncreate - delete a comment

Post Model -> title: String, body: String, likes: [id, ref: Like], comments: [id, ref: Comment]
Like Model -> post: {id, ref: Post}, user: String
Comment Model -> post: {id, ref: Post}, body: String, user: String

- create/save method is used to create data in the db
- $push operator to create/update any entry in db
- $pull operator to delete any entry in db
- populate() is used to replace the id's saved inside the array with the original data of that id (comment/like object)
- exec() is used to execute the query

## Basics of Backend
- Client sends a request to `www.google.com` then the string is converted to ip address by `DNS Resolver` which does this job and then we get the ip address back then the `request` is made to the google server and we get back the `response` in the browser.

- `Express` is used for server and `MongoDB` is the database and `Mongoose` helps to connect the server and database as we can write queries in mongoose to do `CRUD operations` in database.

- `Port` refers to a number/address where communication of service/application happens as there can be multiple services/applications running on the same machine but they have different `Port Numbers`

- `Middleware` is a function that catches the incoming `HTTP requests` and can perform various actions by modifying the request/response objects and invokes the next middleware function when the task is done. Eg: Logging requests, Authentication, Parsing, Error handling and we can invoke middleware functions using `app.use()` method

- `Mounting` is the process of attaching routes to specific paths in express as this allows to create a clean and modular structure. Eg: ``` app.use("/users", userRouter)
app.use("/products", productRouter) ```

- `MVC` model stands for Model-View-Controller is a pattern used to separate the app's concerns into 3 interconnected components. `Models` contains the data we defined and structured, `Controllers` contains all the functionality/request handlers that handles all the requests/response and do operations accordingly, Views contains the UI of the application

## Authentication & Authorization
- Authentication is basically identity verification whether a user is registered/not so first he has to be registered then depending upon his permission and access rights he will be able to see things for different roles.

- Authorization is having permission / access rights to see things which are permitted for certain roles. Eg: normal user can see the dashboard but cannot visit course details, student or someone who bought the course can see the dashboard along with the course details, Admin can see the dashboard but different from what student sees as he can see every details of number of users, course bought, upload videos, video details and etc so different roles have different view of things.

## JSON Web Tokens (JWT)
- JWTs is used to securely authenticate users, verify their identity, and provide access to authorized resources.

- JWTs are composed of three parts: a header, a payload, and a signature. The header typically contains the type of the token (JWT), and the signing algorithm used. The payload contains the data being transmitted, such as the user's ID or email address. The signature is created by hashing the header and payload using a secret key, which can be used to verify the authenticity of the token.

- When a user logs into a web application, the server generates a JWT and sends it to the client as a response. The client can then include the JWT in the headers of subsequent requests to the server. The server can verify the authenticity of the token by checking the signature and decoding the payload.

- JWTs are commonly used in Single Sign-On (SSO) systems, where a user can authenticate once and access multiple web applications without having to re-enter their credentials. They are also used in token-based authentication systems, where the token is used instead of a username and password.

## Cookies
- Cookies are small text files that are stored on a user's computer when they visit a website. They are commonly used to store user preferences, shopping cart items, and session data. Cookies can also be used for authentication and authorization.

- When a user logs into a web application, the server can create a cookie that contains a unique identifier for the user's session. This cookie can then be sent to the client as a response. The client can include the cookie in subsequent requests to the server, allowing the server to identify the user and provide access to authorized resources.

- Cookies can be either session cookies or persistent cookies. Session cookies are stored in memory and are deleted when the user closes their browser. Persistent cookies are stored on the user's computer and are not deleted when the user closes their browser.

- Cookies have some disadvantages, including the fact that they can be easily tampered with and that they can be blocked by the user's browser. They also require additional server-side processing to store and retrieve the cookie data.

## Conclusion of JWT and cookies
JWT tokens and cookies are both popular methods of authentication and authorization in web development. JWTs are self-contained and can be easily transmitted between parties, while cookies are stored on the user's computer and require additional server-side processing. Both methods have their advantages and disadvantages, and developers should choose the method that best fits their application's security and performance needs.

## Signup process
1. Got the data from the client/user side in req.body
2. Validation of the data if the data is correct or not
3. Checking if email already registered/not by doing db call `findOne({email})`
4. If no email exists then encrypt the password using `bcrypt`
5. Using the Model we use `create/save` method to create the data inside the `Database`

## Login process
1. Get the data from req.body (email and password)
2. validation of the data if it is valid or not if it is valid then move on with the process else throw an error
3. check if the user is registered or not if yes then move on with the login process else throw an error
4. compare password if the password we are giving and the hashed password is same or not using `bcrypt.compare()` and if no then return error and if yes then
5. create jwt token using jwt.sign() and it returns a token and we will send the some of the user info (except the password) in response as we want to hide the password
6. we will send the user object in res.cookie() with cookie name, data and options and return status(200) and json with success, user obj, token and message

## Protected Routes and Authorization
A route where only the certain authorized role can visit that otherwise they are blocked by middlewares

- First we can do authorization middleware for the jwt verification where they have the correct credentials (token and secret key) so that we can get our payload (user object we passed to jwt to encrypt)

- We pass that user object (payload) inside req.user so that it can be accessed in the next middleware

- Once verified we can move to the next middlewares to check if the user is having the role (student/admin) and we can check the role of the user using the `req.user` we just used to pass the `payload` we got from `jwt`

Ways to fetch token
---------------------
- req.cookies => To fetch the token from cookies `[Not Secure]`
- req.body => To fetch the token from request body `[Not Secure]`
- req.header => To fetch the token from the header as it is the most secure way of doing it `req.header("Authorization").replace("Bearer ","")` as the implementation is `Authorization : Bearer <token>`

## File uploading
We are gonna use express-fileupload to store the files into the server only and we are gonna use cloudinary to store the files on their media server and here in our server store that file inside a temporary folder and once the file is uploaded in the cloudinary, the file stored inside the temp folder will be deleted.

Routes for File uploading
-------------------------
- /ImageUpload => Upload to cloudinary and make an entry into DB (jpg,jpeg,png)
- /VideoUpload => Upload to cloudinary and make an entry into DB (mp4,mov)
- /ImageSizeReducer => Upload to cloudinary (Limit < 2MB size>) and make an entry into DB
- /LocalFileUpload => Store the file inside server

## Cloudinary and File Upload
- Cloudinary is a Media Server where files (Images,videos,etc) are stored in that server and we can just use those files in our project

- `fileupload()` is a middleware used to handle file uploads in an Express application. It parses the HTTP request containing the file and stores it on the server's file system or memory as per the configuration. This middleware can be used to handle files of various formats like images, videos, audio, etc.

- The main difference between `fileupload()` and `cloudinary.uploader.upload()` is the location where the file is uploaded. With `fileupload()`, the file is uploaded to the server's file system or memory, whereas with `cloudinary.uploader.upload()`, the file is uploaded directly to the cloud.

## Uploading the Image/Video in cloudinary
- Fetch the files from `req.body` (name, email, tags, file)
- Validate if the data sent from the user is valid or not
- Receive the file in `req.files.file_name_we_used_to_pass` and now extract the file name using `file.name` and get the extension of the file using `path.extname(file.name).toLowerCase()`
- Now check if the extension of the file user provided matches the set of extensions we want to set as constraints and if it doesn't matches throw an error otherwise proceed.
- Now we can successfully upload the file inside cloudinary using `cloudinary.uploader.upload(file.tempFilePath, options)` and inside the options we can specify our folder inside cloudinary and also the `resource_type` as you can set it to `auto`
- Then we create our entry for db with the data we got from req.body and adding `response.secure_url` that we got from our response from cloudinary as we uploaded that file successfully

## Upload the Reducer Image quality and height in cloudinary
- Now when while we are uploading the file inside cloudinary using `cloudinary.uploader.upload(file.tempFilePath, options)` and inside the options we can specify the quality and height as well on conditions such as '''if(quality && height) options.quality = quality; options.height = height'''

## Things to study
- SMTP Article
- AWS Service - SQS and SNS

## StudyNotion Project Flow

### Flow for Student
- For login -> email and password
- For signup -> firstname, lastname, email, phone, create password, confirm password
- For password reset -> email as input then link set to email and we can now choose new password

## Models
1. User Model -> firstname, lastname, email, password, confirmpass, accounttype, additionalDetails: ref Profile, Courses: [ref Course], image, courseProgress : [ref CourseProgress]
2. Profile Model -> gender, dob, about, phone no
3. CourseProgress Model -> Course Id, CompletedVideos: [{ref: SubSection}]
4. SubSection Model -> title, time duration, description, videoUrl, additionalUrl
5. Course Model -> course name, course description, whatyouwilllearn, course content: [{ref: Section}],  instructor: ref: User, price, thumbnail, rating and reviews: [{ref: rating and reviews}], tags: {ref: tag}, students enrolled: [{ref: User}]
6. Rating and Reviews Model -> user ref: User, rating, review
7. Tags Model -> name, description, course: ref Courses
8. Section Model -> section name, SubSection: [{ref: SubSection}]
9. OTP Model -> email, createdAt, otp

## Sending Email Before Signup
Before the data for signup is sent to the DB, the OTP verification should be done. First the otp is sent to the following email provided for signup then we put the otp to verify the email and if verified then just verify the email and move to login page

- Before the data is sent to the signup go to the OTP model and using the `pre hook` send the otp to the email for email verification

## Controllers

### SendOtp Controller
- get the email from the request body
- check if the user with that email already exists in the db or not
- if no user exists then generate an otp
- check if the otp is unique or not and if not then keep finding the unique otp
- create an entry for otp in db and sending the successful message

### Signup Controller
- get the data from request body
- validate the data
- check if the password and confirm password matches or not
- check if the user already exists in the db or not
- find the recent most OTP from db
- validate OTP to see OTP present or not / Invalid OTP
- Hash the password before storing into the db
- create an entry for the profile model and set all the values to null
- create an entry in the db with the signup data
- return the response

### Login Controller
- get the data from request body
- validate the data
- check if the user already exists in the db or not
- match the password and generate a JWT token
- send the token in the form of cookie to the user

## Middlewares

### Auth
- Extracting token from cookies/body/header
- Validate the token
- Decode the token using jwt.verify() and if decoded then send the decoded value inside req.user
- Move to next() middleware

### 