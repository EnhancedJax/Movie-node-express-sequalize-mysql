# Ticketing backend

```
brew install mysql
mysql.server restart
mysql_secure_installation
mysql -u root -p
source create.sql
npm i
npm run dev
```

# Ticketing Backend API Documentation

## Base URL

The base URL for all API endpoints is: `/api`

## Authentication

Most endpoints require authentication. To authenticate, include a Bearer token in the Authorization header:

`Authorization: Bearer <your_token_here>`

To obtain a token, use the login endpoint.

## Endpoints

### Users

#### Register a new user

- **URL**: `/users/register`
- **Method**: POST
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: 201 Created
- **Error Response**: 400 Bad Request

#### Login

- **URL**: `/users/login`
- **Method**: POST
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: 200 OK
- **Error Response**: 401 Unauthorized

#### Get User Profile

- **URL**: `/users/profile`
- **Method**: GET
- **Authentication**: Required
- **Success Response**: 200 OK
- **Error Response**: 401 Unauthorized

#### Update User Email

- **URL**: `/users/update-email`
- **Method**: PUT
- **Authentication**: Required
- **Body**:
  ```json
  {
    "email": "newemail@example.com"
  }
  ```
- **Success Response**: 200 OK
- **Error Response**: 400 Bad Request, 401 Unauthorized

#### Update User Password

- **URL**: `/users/update-password`
- **Method**: PUT
- **Authentication**: Required
- **Body**:
  ```json
  {
    "oldPassword": "oldpassword123",
    "newPassword": "newpassword123"
  }
  ```
- **Success Response**: 200 OK
- **Error Response**: 400 Bad Request, 401 Unauthorized

### Movies

#### Get All Movies

- **URL**: `/movies`
- **Method**: GET
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Number of items per page (default: 10)
- **Success Response**: 200 OK
- **Error Response**: 500 Internal Server Error

#### Get Movie by ID

- **URL**: `/movies/:id`
- **Method**: GET
- **Success Response**: 200 OK
- **Error Response**: 404 Not Found

#### Create Movie

- **URL**: `/movies`
- **Method**: POST
- **Body**:
  ```json
  {
    "title": "Movie Title",
    "description": "Movie Description",
    "duration": 120,
    "releaseDate": "2023-05-01"
  }
  ```
- **Success Response**: 201 Created
- **Error Response**: 400 Bad Request

#### Update Movie

- **URL**: `/movies/:id`
- **Method**: PUT
- **Body**:
  ```json
  {
    "title": "Updated Movie Title",
    "description": "Updated Movie Description",
    "duration": 130,
    "releaseDate": "2023-05-02"
  }
  ```
- **Success Response**: 200 OK
- **Error Response**: 404 Not Found

#### Delete Movie

- **URL**: `/movies/:id`
- **Method**: DELETE
- **Success Response**: 204 No Content
- **Error Response**: 404 Not Found

#### Get Movie with Screenings

- **URL**: `/movies/:id/screening`
- **Method**: GET
- **Query Parameters**:
  - `daysFromNow`: Number of days to fetch screenings for (default: 3)
- **Success Response**: 200 OK
- **Error Response**: 404 Not Found

### Cinemas

#### Get All Cinemas

- **URL**: `/cinemas`
- **Method**: GET
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Number of items per page (default: 10)
- **Success Response**: 200 OK
- **Error Response**: 500 Internal Server Error

#### Get Cinema by ID

- **URL**: `/cinemas/:id`
- **Method**: GET
- **Success Response**: 200 OK
- **Error Response**: 404 Not Found

#### Create Cinema

- **URL**: `/cinemas`
- **Method**: POST
- **Body**:
  ```json
  {
    "name": "Cinema Name",
    "location": "Cinema Location",
    "lat": 12.345678,
    "lng": 98.765432
  }
  ```
- **Success Response**: 201 Created
- **Error Response**: 400 Bad Request

#### Update Cinema

- **URL**: `/cinemas/:id`
- **Method**: PUT
- **Body**:
  ```json
  {
    "name": "Updated Cinema Name",
    "location": "Updated Cinema Location",
    "lat": 12.345678,
    "lng": 98.765432
  }
  ```
- **Success Response**: 200 OK
- **Error Response**: 404 Not Found

#### Delete Cinema

- **URL**: `/cinemas/:id`
- **Method**: DELETE
- **Success Response**: 204 No Content
- **Error Response**: 404 Not Found

### Theaters

#### Get All Theaters

- **URL**: `/theaters`
- **Method**: GET
- **Success Response**: 200 OK
- **Error Response**: 500 Internal Server Error

#### Get Theater by ID

- **URL**: `/theaters/:id`
- **Method**: GET
- **Success Response**: 200 OK
- **Error Response**: 404 Not Found

#### Create Theater

- **URL**: `/theaters`
- **Method**: POST
- **Body**:
  ```json
  {
    "name": "Theater Name",
    "cinemaId": 1,
    "screenDistance": 10,
    "seatLayout": [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1]
    ]
  }
  ```
- **Success Response**: 201 Created
- **Error Response**: 400 Bad Request

#### Update Theater

- **URL**: `/theaters/:id`
- **Method**: PUT
- **Body**:
  ```json
  {
    "name": "Updated Theater Name",
    "cinemaId": 1,
    "screenDistance": 12,
    "seatLayout": [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1]
    ]
  }
  ```
- **Success Response**: 200 OK
- **Error Response**: 404 Not Found

#### Delete Theater

- **URL**: `/theaters/:id`
- **Method**: DELETE
- **Success Response**: 200 OK
- **Error Response**: 404 Not Found

### Screenings

#### Get All Screenings

- **URL**: `/screenings`
- **Method**: GET
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Number of items per page (default: 10)
- **Success Response**: 200 OK
- **Error Response**: 500 Internal Server Error

#### Get Screening by ID

- **URL**: `/screenings/:id`
- **Method**: GET
- **Success Response**: 200 OK
- **Error Response**: 404 Not Found

#### Create Screening

- **URL**: `/screenings`
- **Method**: POST
- **Body**:
  ```json
  {
    "movieId": 1,
    "theaterId": 1,
    "startTime": "2023-05-01T18:00:00Z",
    "price": 1000
  }
  ```
- **Success Response**: 201 Created
- **Error Response**: 400 Bad Request

#### Update Screening

- **URL**: `/screenings/:id`
- **Method**: PUT
- **Body**:
  ```json
  {
    "movieId": 1,
    "theaterId": 1,
    "startTime": "2023-05-01T19:00:00Z",
    "price": 1200
  }
  ```
- **Success Response**: 200 OK
- **Error Response**: 404 Not Found

#### Delete Screening

- **URL**: `/screenings/:id`
- **Method**: DELETE
- **Success Response**: 204 No Content
- **Error Response**: 404 Not Found

### Bookings

#### Create Booking

- **URL**: `/bookings`
- **Method**: POST
- **Authentication**: Required
- **Body**:
  ```json
  {
    "screeningId": 1,
    "seats": ["A1", "A2", "A3"]
  }
  ```
- **Success Response**: 201 Created
- **Error Response**: 400 Bad Request, 401 Unauthorized

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests. In case of an error, the response will include a JSON object with a `message` field describing the error.

Example error response:

```json
{
  "message": "Invalid email or password"
}
```

## Rate Limiting

Currently, there is no rate limiting implemented in the API.

## Pagination

Endpoints that return lists of items (e.g., movies, cinemas, screenings) support pagination. Use the `page` and `limit` query parameters to control the pagination.

Example response for paginated endpoints:

```json
{
"items": [...],
"currentPage": 1,
"totalPages": 5,
"totalItems": 50,
"itemsPerPage": 10,
"nextPage": 2,
"prevPage": null
}
```
