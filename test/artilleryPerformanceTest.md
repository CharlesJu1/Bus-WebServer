How to use Artillery to do performance test for Bus-WebServer
=============================================================
Artillery is a simple load-generator, we use this tool for performance test. This artical will show you how to use it and how to write simple test cases.
Artillery can help to do realistic load test. It simulate **virtual users**, each user picks and run one of the pre-defined **scenarios**(a sequence of HTTP requests and WebSocket messages).

## Install Artillery
Artillery is also written in Node.js and is distributed via npm. To install it, run:
`npm install -g artillery`

## Run test case
Artillery test case is written in JSON format. To run a test case named "test.json"
`artillery run test.json`

## Artillery Test Case
Artillery test case is made up of *config* and *scenarios* sections.
User define scenarios by a sequence of HTTP requests and WebSocket messages in *scenarios* section. *config* section contains information of how to run the test case.
Here is an example:
```
{
  "config": {
      "target": "http://localhost:3000",
      "phases": [
          {"duration": 10, "arrivalRate": 1},
          {"duration": 10, "arrivalRate": 1, "rampTo": 5},
          {"duration": 10, "arrivalRate": 5}
      ],
      "payload": {
          "path": "position.csv",
          "fields": ["lat","long","heading","speed"],
          "order": "sequence"
      }
  },
  "scenarios": [
      {
          "name": "upload position",
          "flow": [
              {"post": {
                  "url": "/api/bus/position",
                  "json": {"coords": {"lat": "{{ lat }}", "long": "{{ long }}"}, "heading": "{{ heading }}", "speed": "{{ speed }}"}
              }},
              {"think": 1}
          ]
      },
      {
          "name": "upload route",
          "flow": [
              {"post": {
                  "url": "/api/bus/route",
                  "json": {"rtDirection": {"fStop": "stop A", "tStop": "stop B"}, "stops": [], "path": []}
              }},
              {"think": 1}
          ]
      }
  ]
}
```
This test case simulate "upload position" and "upload route" scenarioes of the bus drivers. Details will be intruduced in the following sections.
### config section
```
{
  "config": {
      "target": "http://localhost:3000",
      "phases": [
          ......
      ],
      "payload": {
          ......
      }
  },
  ......
}
```

* **target** - base URL for all requests in this script. Example: http://localhost:3000
* **phases** - specify the duration of the test and frequency of requests.
    * *duration* : this phase last for how many seconds.
    * *arrivalRate* : specify the arrival rate of virtual users for a duration of time. A linear "ramp" in arrival can be also be created with the *rampTo* option.
* **payload** - sometimes it is useful to be able to inject data from external files into your test scenarios. Artillery can load test data from a CSV file.
    * *path* : CSV file path.
    * *fields* : columns in CSV needed in this test case.
    * *order* : this is optional, without this option, rows from CSV file are picked at random. "sequence" value will make Artillery start from the beginning and get rows one by one.
    in scenarios section, use `{{ field name }}` to reference the data.
    Here is an example of the position.csv file:
    ```
    lat,long,heading,speed
    12,18,30,5
    12,19,25,5
    11,20,20,5
    ```

For the full option list, please check https://artillery.io/docs/script-reference.html

### scenarios section
Artillery supports HTTP and WebSocket. The above example is HTTP only. **scenarios** is an array. Each scenario is a sequence of steps that run sequentially.
```
{
  ......
  "scenarios": [
      {
          "name": "......",
          "flow": [
              ......
              {"think": 1}
          ]
      },
      {
          "name": "upload route",
          "flow": [
              ......
              {"think": 1}
          ]
      }
  ]
}
```

* **name** - User can give a name to a scenario.
* **flow** - an array of HTTP or WebSocket requests.
* **think** - pause some time(seconds).

#### HTTP request
Each object in the flow array contains one key representing the HTTP method (get, put, post and delete are supported).
```
{
	"post": {
        "url": "/api/bus/route",
        "json": {"rtDirection": {"fStop": "stop A", "tStop": "stop B"}, "stops": [], "path": []}
    }
},
```

* **url** - the request URL; it will be appended to the target but can be fully qualified also
* **json** - a JSON object to be sent in the request body

#### WebSocket request
Here is an example of using *socket.io* message to *register position update/unregister position update/disconnect*.
But of course we can mix HTTP and WebSocket request in one flow.
```
{
  "config": {
      "target": "http://localhost:3000/passenger",
      "phases": [
        {"duration": 10, "arrivalRate": 1}
      ]
  },
  "scenarios": [
    {
      "engine": "socketio",
      "flow": [
        {"emit": { "channel": "register positionUpdate", "data": {"city":"zhuhai","line":"K4"}}},
        {"think": 5},
        {"emit": { "channel": "unregister positionUpdate", "data": {"city":"zhuhai","line":"K4"}}},
        {"think": 5},
        {"emit": { "channel": "disconnect", "data": {}}}
      ]
    }
  ]
}
```

* **engine** - WebSocket engine type.
* **emit** - send an event to the far end
    * *channel* : the event name
    * *data* : the event data, it's a piece of JSON 

## Generate report
When using `artillery run xxx.json` command to run test case, Artillery will generate a log file which looks like `artillery_report_20160614_112549.json`. 
User can use command `artillery report artillery_report_20160614_112549.json` to generate an readable HTML report

## Other useful features:
* Artillery can verify the response of HTTP/WebSocket request.
* If a test case includes multiple scenarios, user can give a weight to each scenario, so that we can control the probability of occurrence.

Please find the detail in https://artillery.io/docs/
github link: https://github.com/shoreditch-ops/artillery
