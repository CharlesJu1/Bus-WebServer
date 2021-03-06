## How to access/download Applicationhost.config

* Login to the KUDU console for your Azure Web Site at `https://<sitename>.scm.azurewebsites.net/DebugConsole`

## Enable diagnostics logging for web apps in Azure App Service
 
* To enable diagnostics in the Azure Portal
     * go to the blade for your web app and click Settings > Diagnostics logs.
* Download logs
    * Go to the FTP site listed on the logs section of portal.azure.com using the FTP/deployment user name to download logs.
* Streaming with Azure Command-Line Interface
    * `azure site log tail webappname`

## To access node.js console.log
1. Add the following lines in IISNode.yml

        loggingEnabled: true
        logDirectory: iisnode

2. In your browser, access the Kudu debug console for your app, which is at `https://{appname}.scm.azurewebsites.net/DebugConsole`
    * `Logfiles/W3SVCxxx` folders are for failed reqeust traces 
    * `site\wwwroot\iisnode` has node.js console.log outputs. Or in the CMD console, cd to `D:\home\site\wwwroot\iisnode` 
3. To show node.js console.log
    * Go to `http://{appname}.azurewebsites.net/iisnode/`


## Debug your app with Node-Inspector
1. Add the following line in IISNode.yml

        debuggingEnabled: true

2. In your browser, go to `http://{appname}.azurewebsites.net/server.js/debug`

