# URL Shortener

URL Shortener is a simple web application built with Bun and SQLite that allows you to shorten long URLs and retrieve them later using a unique short ID. It provides a RESTful API for adding, retrieving, and deleting shortened URLs.

## Features

- **Shorten URLs**: Provide a long URL, and the application will generate a unique short ID for it.
- **Retrieve URLs**: Enter the short ID, and the application will redirect you to the corresponding long URL.
- **List All URLs**: Retrieve a list of all shortened URLs stored in the database.
- **Delete URLs**: Remove a shortened URL from the database by providing its short ID.

## Installation

1. Make sure you have [Bun](https://bun.sh/) installed on your system.
2. Clone this repository: `git clone https://github.com/Rayauxey/url-shortener.git`
3. Navigate to the project directory: `cd url-shortener`
4. Install dependancies: `bun install`
5. Start the server: `bun start`

The server will start running on `http://localhost:42069`.

## API Endpoints

### `POST /add`

Add a new shortened URL to the database.

**Request Body:**

```json
{
  "url": "https://www.example.com/very/long/url"
}
```

**Response:**

- `200 OK`: `"Successfully added the link!"`
- `400 Bad Request`: `{ "error": "Invalid URL" }`

### `GET /links`

Retrieve a list of all shortened URLs in the database.

**Response:**

```json
[
  {
    "id": "abc123",
    "url": "https://www.example.com/very/long/url"
  },
  {
    "id": "def456",
    "url": "https://www.example.com/another/long/url"
  }
]
```

### `DELETE /delete?id=abc123`

Delete a shortened URL from the database by providing its short ID.

**Query Parameters:**

- `id`: The short ID of the URL to delete.

**Response:**

- `200 OK`: `"Successfully deleted the link!"`
- `400 Bad Request`: `{ "error": "No ID provided" }`

### `GET /:id`

Retrieve the long URL associated with a given short ID and redirect to it.

**Path Parameters:**

- `id`: The short ID of the URL to retrieve.

**Response:**

- `301 Moved Permanently`: Redirects to the long URL associated with the provided short ID.
- `404 Not Found`: If the provided short ID is not found in the database.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
