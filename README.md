# node-snarl
Plugin for node to send notifications on Snarl4

## Basic Usage
```javascript
// Getting the plugin
var Snarl = require('node-snarl')();

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
These options must be used to set server params and set default message options
``` javascript
{
  server: 'localhost'
, port: '8080'
, name: 'Snarl4'
, iconPath: __dirname+'\\..\\icon'
, messageOptions: {
    timeout: 3
  , title: 'Custom default Title'
  , text: 'Custom default message'
  }
}
```
### Message Options
``` javascript
{
  title: 'Snarl - Title Example'
, text: 'This is message body'
, sound: 'path/to/sound'
, icon: 'path/to/image'
}
```
These options can be used in these functions:
- `Snarl.notify(mesageOptions)`
- `Snarl.done(mesageOptions)`
- `Snarl.fail(mesageOptions)`
- `Snarl.log(mesageOptions)`<br/><br/>
If you want to see all message options, please visit this link https://sites.google.com/site/snarlapp/developers/api-reference#TOC-notify

---

## Advanced Usage
If you have been registered a new Snarl app, you can ommit `name` parameter.<br/><br/>
Putting it all together.
```javascript
// Getting the plugin
var Snarl = require('node-snarl')({
    server: 'localhost'
  , port: '8080'
  , name: 'Snarl4'
  , iconPath: __dirname+'\\..\\icon'
  , messageOptions: {
      timeout: 3
    , title: 'Custom default Title'
    , text: 'Custom default message'
    }
  }
});

// Function to register messages on an app name.
Snarl.register(name);

// If you want to check if the server is available
if(Snarl.isAvailable()){
  // if its everything ok

  // Send many notifications as you want.
  Snarl.notify({
    title: 'No icon'
  , text: 'This is a notification with no icon'
  , sound: 'path/to/sound'
  , icon: 'path/to/image'
  });

  // Or send notifications with a default icon "done".
  Snarl.done({
    title: 'Done icon'
  , text: 'A done icon example'
  , sound: 'path/to/sound'
  , icon: 'path/to/image'
  });

  // Or send notifications with a default icon "fail".
  Snarl.fail({
    title: 'Snarl - Title Example'
  , text: 'A done fail example'
  , sound: 'path/to/sound'
  , icon: 'path/to/image'
  });

  // Or send notifications with a default icon "log".
  Snarl.log({
    title: 'Snarl - Title Example'
  , text: 'A done log example'
  , sound: 'path/to/sound'
  , icon: 'path/to/image'
  });
}
```


