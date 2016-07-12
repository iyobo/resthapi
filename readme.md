# RESTHAPI
A Rest API server built using hapiJS.
Features:
- Deep use of ES6 to yield all the things
- Tests with Mocha/Chai
- Realtime API SPEC using lout
- Hierarchial configs per environment

## Requirements
- Mocha (globally installed)
- NodeJS 5 (recommended)

##Getting Started
```
sh setup.sh
npm install
npm start (to run server)
```
To run tests instead of server, use `npm test`

## API Spec
Please visit /doc for API specs/documentation

## Authentication

This API uses HTTP basic auth.
Some default users are generated on startup, but you can create your own by posting to `POST /api/user` with payload `{username:'myusername',password:'mypassword'}`.
Please see API SPec doc for more details.

### Default Users
- hapiadmin /password1
- cedric / password2

## Notes
- In a production setting, HTTPS must be used as this API currently uses basic auth
- Proper API Design should involve proper seperation of concerns into Models, Controllers, and Services (pure business logic to keep controllers/routes light). I abstracted some functions into services, but not nearly enough as I would have liked given time.
