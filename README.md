To use this make sure to 
- create the appropriate database in your PostgreSQL database (make sure it is running)
- create your own Google credentials 
	- https://console.developers.google.com/apis/credentials
		- Add origin of http://127.0.0.1:1337
		- Add redirect of http://127.0.0.1:1337/login/verify
	- Update the credentials in `auth.js` under `new GoogleStrategy`

Now you should be able to run `npm start` and have a VERY simple OAuth example :D