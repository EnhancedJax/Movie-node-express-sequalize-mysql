# Movie Ticketing Full-Stack app

A full-stack movie ticketing app with CRUD functionality and relational database structure. Create movies, cinemas, theaters, then assign screenings to theaters. Register as a user to have a record of your bookings (tickets).

## Front end with Next.js, TailwindCSS, ShadCN

To run the front end, you need to have Node.js installed:

```
cd ui
npm i
npm run dev
```

## Back end with Node.js, Express, Sequalize, MySQL

To install MySQL and create the env file:

```
brew install mysql
mysql.server restart
mysql_secure_installation
mysql -u root -p
source create.sql
```

Create the .env file:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=<your root password>
DB_NAME=ticketing
PORT=8080
JWT_SECRET=secret
```

Run the back end:

```
cd api
npm i
npm run dev
```

## Stack

- Next.js
- TailwindCSS
- ShadCN
- React Hook Form
- Yup
- Axios

- Node.js
- Express
- Sequalize
- MySQL
