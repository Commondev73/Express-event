# Express-event

- [Next-event](https://github.com/Commondev73/Next-event) (Next.js)

## `Installation`

### Software required

1. node
2. nodemon

Download this project.

First step
```
$ npm install -g nodemon
```

Next step
```
$ npm install
$ npm start or npm run dev
```

## `API`
- POST   /api/auth/sign-in
- POST   /api/auth/sign-up
- POST   /api/auth/refresh-token
- GET    /api/auth/sign-up-auto

- GET    /api/event/list
- GET    /api/event/:id
- GET    /api/event/create-auto
- POST   /api/event/create

- GET    /api/user-event/list/:id
- POST   /api/user-event/create
- PUT    /api/user-event/update

## `ENV`

NODE_ENV = "development"
HOST= "0.0.0.0"
PORT= "8000"
DB_URL= "mongodb://localhost:27017/test_pisitchai"
SECRET_KEY= "H0noyg5sxGyNFmOYhQSN96UKroAWPaQLPD4vSxxtZYs"
TOKEN_EXPIRE= "15m"
REFRESH_TOKEN_EXPIRE= "30m"
