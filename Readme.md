## Node js Auth API.


# Install
```
$ git clone https://github.com/mayurkumarp/NodeJS.git
$ cd NodeJS
$ yarn
$ cp .env.example .env
```

## Environment Variables

To run this project, you will need to add the following environment variables to your.env file:

`DB_USER`

`DB_PASSWORD`

`ACCESS_TOKEN_SECRET`

change or add other environment variables if required.

# Database Changes
## Migrate
```
$ npx prisma migrate dev
```
## Database Schema Changes
```
$ npx prisma db push
```

# Run server
```
$ yarn start
```

# Run development server
```
$ yarn dev
```
# Swagger
```
{{baseUrl}}/help/api
```
