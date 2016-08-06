# Level of Detail Client


## Description
Using the Autodesk Viewer API, cycles through different levels of detail of a model and shows the appropriate one. 


## Dependencies
Install Node.js on your machine and clone this repo. Download the project dependencies using npm before running the app by running 
the following command in the project root directory
```
npm install
```
on the node.js console. This will install the following node.js modules in the project:
- express
- request
- serve-favicon


## Setup/Usage Instructions
 
* Apply for your own credentials (API keys) from [http://developer.autodesk.com](http://developer.autodesk.com)
* From the sample root folder, rename or copy the ./credentials_.js file into ./credentials.js <br />
  * Windows <br />
    ```
    copy credentials_.js credentials.js 
	```
  * OSX/Linux <br />
    ```
    cp credentials_.js credentials.js  
	```
* Replace the placeholders with your own keys in credentials.js, line #23 and #24 <br />
  ```
  client_id: process.env.CONSUMERKEY || '<replace with your consumer key>';
  
  client_secret: process.env.CONSUMERSECRET || '<replace with your consumer secret>';
  ```
* Get the URN of one LOD by executing LOD_server (in a different [repository](https://git.autodesk.com/t-vaviv/LOD_server)) and put it in /www/index.js, "defaultUrn" variable. The remaining LODs are computed dynamically and the URNs of those models need not be provided. Instead, in www/Viewing.Extension.Workshop.js modify the variable "var LODs" with the versions you have translated (using LOD_server). 
* Run the server from the Node.js console, by running the following command: <br />
  ```
  node server.js
  ```
* Connect to your local server using a WebGL-compatible browser: [http://localhost:3000/](http://localhost:3000/)

* Interact with the model, and if the frame rate is greater than the "_maxFPS" parameter in www/Viewing.Extension.Workshop.js, a higher LOD will automatically be loaded and swapped in. 

## Written by 

Written by Vaibhav Vavilala  <br />
(Autodesk Intern Developer Evangelist, 2016)
