# Level of Detail Client


## Description
Using the Autodesk View & Data API, cycles through different levels of detail of a model and shows the appropriate one. 


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

This sample does not include the workflow of uploading models. on the server It depends on other workflow samples to upload models and 
get model URNs - as explained in the Setup/Usage Instructions.


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
* Get the URN from one of executing LOD_server and put it in /www/index.js, "defaultUrn". The remaining LODs are computed dynamically and the URNs of those models need not be provided. Instead, edit www/Viewing.Extension.Workshop.js and modify the variable "var LODs" with the versions you have translated (via LOD_server). 


* Run the server from the Node.js console, by running the following command: <br />
  ```
  node server.js
  ```
* Connect to you local server using a WebGL-compatible browser: [http://localhost:3000/](http://localhost:3000/)

* Interact with the model, and if the frame rate is good, a higher LOD will automatically be loaded and swapped in asynchronously. 

## Options

You can work with production or staging Autodesk View and Data environments. By default, the project is setup with the production server.

## License

That samples are licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.

## Written by 

Written by Vaibhav Vavilala  <br />
(Autodesk Intern Developer Evangelist, 2016)

