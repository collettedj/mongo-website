# mongo-website [![Build Status](https://travis-ci.org/collettedj/mongo-website.svg?branch=master)](https://travis-ci.org/collettedj/mongo-website)
This site is my attempt at creating a solid express website with a mongodb backend database.

### flow for recieving auth token
  - register a client with a post using basic authentication to the oath server {name:"test app", id:"test_app", secret:"test_app_secret"}
  - enter url in browser with correct client id http://localhost:3000/api/v1/oauth2/authorize?client_id=this_is_my_id&response_type=code&redirect_uri=http://localhost:3000. This will redirect to the redirect url with the auth code.
  - post to http://localhost:3000/api/v1/oauth2/token using basic authentication. { "code":"","grant_type":"authorization_code", "redirect_uri":""}
  - user bearer authentication with the access token endpoints


