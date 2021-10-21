# weather-app

API key:
- Your API key is 03e5513e4e80850b12120552d229b374
- Within the next couple of hours, it will be activated and ready to use
- You can later create more API keys on your account page
- Please, always use your API key in each API call

Endpoint:
- Please, use the endpoint api.openweathermap.org for your API calls
- Example of API call:
api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=03e5513e4e80850b12120552d229b374

Useful links:
- API documentation https://openweathermap.org/api
- Details of your plan https://openweathermap.org/price
- Please, note that 16-days daily forecast and History API are not available for Free subscribers

For a 5-day weather forecast you need call /forecast instead of /weather endpoint.

Example:
https://api.openweathermap.org/data/2.5/forecast?q=New%20York&appid=<your-api-key>&cnt=5


## User stories

4. As a user with a selected city, I want the weather to be updated every 10 seconds
5. As a user with a selected city, I want to see the weather of the last selected city if I refresh the page
6. As a user, I want to see an error if the weather is not current weather is not available
7. Use a typeahead input of your choice

