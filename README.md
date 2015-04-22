# node-snarl
Plugin for node to send notifications on Snarl4

## Basic Usage
```javascript
// Getting the plugin
var Snarl = require('node-snarl');

// Function to register messages on an app name.
Snarl.register(name);

// If you want to check if the server is available
if(Snarl.isAvailable()){
  // if its everything ok
  
  // Send many notifications as you want.
  Snarl.notify(name, options);
  // Or send notifications with a default icon "done".
  Snarl.done(name, options);
  // Or send notifications with a default icon "fail".
  Snarl.fail(name, options);
  // Or send notifications with a default icon "log".
  Snarl.log(name, options);
}
```
### Options
Every options must be written as javascript object syntax.<br/><br/>
If you want to see all message options, please visit this link https://sites.google.com/site/snarlapp/developers/api-reference#TOC-notify
``` javascript
{
  title: 'Snarl - Title Example'
, text: 'This is message body'
, sound: 'path/to/sound'
, icon: 'path/to/image'
}
```
<hr/>
## Advanced Usage
If you have been registered a new Snarl app, you can ommit `name` parameter. Using the same example above.
```javascript
// Getting the plugin
var Snarl = require('node-snarl');

// Function to register messages on an app name.
Snarl.register(name);

// If you want to check if the server is available
if(Snarl.isAvailable()){
  // if its everything ok
  
  // Send many notifications as you want.
  Snarl.notify(options);
  // Or send notifications with a default icon "done".
  Snarl.done(options);
  // Or send notifications with a default icon "fail".
  Snarl.fail(options);
  // Or send notifications with a default icon "log".
  Snarl.log(options);
}
```


