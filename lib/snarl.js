'use strict';

var request = require('request')
  , extend = require('node.extend')
  , clean
;

/**
 * Constructor.
 * @author Tomás Hernández <tomas.hernandez03@gmail.com>
 * @since  2015-02-21
 * @param  {Object}   options You can see the options to set in "defaultOptions"
 */
function Snarl(options){
  var self = this
    , name, server, port
  ;

  options = self.options = extend(true, {}, self.options, options);
  self.stack = [];

  server = options.server;
  port = options.port;
  self.messageOptions = options.messageOptions;
  self.iconPath = options.iconPath;
  self.name = name = options.name;
  if(port === 443){
    self.root  = 'https://' + server + ':' + port + '/';
  }else{
    self.root  = 'http://' + server + ':' + port + '/';
  }
  return self;
}

/**
 * Extending the prototype.
 * @author Tomás Hernández <tomas.hernandez03@gmail.com>
 * @since  2015-02-21
 */
extend(Snarl.prototype, {
  /**
   * Referencing to constructor.
   * @type {function}
   */
  constructor: Snarl
  /**
   * Function to destroy an instance of Snarl (TODO).
   * @author Tomás Hernández <tomas.hernandez03@gmail.com>
   * @since  2015-02-21
   * @return {undefined}
   */
, destroy: function(){
  }
  /**
   * Default parameters.
   * @type {Object}
   */
, options: {
    server: 'localhost'
  , port: '8080'
  , name: 'Snarl4'
  , iconPath: __dirname+'\\..\\icon'
  , messageOptions: {
      timeout: 3
    , title: 'Title'
    , text: 'Please specify "text" option'
    }
  }
  /**
   * Function to register messages on an app name.
   * @author Tomás Hernández <tomas.hernandez03@gmail.com>
   * @since  2015-02-21
   * @param  {String}   name Name of the app
   * @return {undefined}
   */
, register: function(name){
    var self = this
      , root = self.root
      , appName = name || self.name
      , url = root + 'register?app-sig='+appName+'&app-title='+appName
    ;
    self.name = appName;
    request(url);
  }
  /**
   * Function to unregister messages of an app name.
   * @author Tomás Hernández <tomas.hernandez03@gmail.com>
   * @since  2015-02-21
   * @param  {String}   name Name of a registered app
   * @return {undefined}
   */
, unregister: function(name){
    var self = this
      , root = self.root
      , appName = name || self.name
      , url = root + 'unregister?app-sig='+appName
    ;
    self.name = self.defaultOptions.name;
    request(url);
  }
  /**
   * Function to check if Snarl4 server is running or not.
   * NOTE: This code have a workaround because in some external plugins, like
   * grunt-notify, there are a sync implementation. So i had to do the same
   * thing until these plugins are updated.
   * @author Tomás Hernández <tomas.hernandez03@gmail.com>
   * @since  2015-03-27
   * @return {Boolean}
   */
, isAvailable: function(){
    var self = this
      , available
    ;
    request({
      url: self.root
    , timeout: self.messageOptions.timeout * 1000
    }, function(e){
      if(e){
        available = false;
      }else{
        available = true;
      }
    });
    while(available === undefined) {
      require('deasync').runLoopOnce();
    }
    return available;
  }
  /**
   * Function to create a notification and send it over a http request to snarl
   * server.
   * notification.
   * @author Tomás Hernández <tomas.hernandez03@gmail.com>
   * @since  2015-02-21
   * @param  {String}   name    Name of the app
   * @param  {Object}   options See available options in
   * {@link https://sites.google.com/site/snarlapp/developers/api-reference|API Reference}
   * @return {undefined}
   */
, notify: function(name, options){
    var self = this
      , root = self.root
      , appName = name
      , id = parseInt(new Date().toISOString().replace(/[\W\D]/g, ''))
      , url = root
      , params
    ;
    if(!name || typeof(name) === 'object'){
      options = name || {};
      appName = self.name;
    }
    options = extend(true, {}, self.messageOptions, options);
    options.text = clean(options.message || options.text);
    params = Object.keys(options);
    url += 'notify?id='+id+'&app-sig=' + appName;
    for(var x = 0, len = params.length; x < len; ++x){
      var param = params[x];
      url += '&'+param+'='+options[param];
    }
    request(url, function(e, res){
      if (!e && res.statusCode === 200) {
        self.stack.push(id);
        setTimeout(function(){
          self.stack.shift(0);
        }, options.timeout * 1000);
      }
    });
  }
  /**
   * Same as notify function but here is setted a default icon "done".
   * @author Tomás Hernández <tomas.hernandez03@gmail.com>
   * @since  2015-02-22
   * @param  {String}   name    Name of the app
   * @param  {Object}   options See available options in
   * {@link https://sites.google.com/site/snarlapp/developers/api-reference|API Reference}
   * @return {Function}
   */
, done: function(name, options){
    var self = this
      , appName = name
    ;
    if(!name || typeof(name) === 'object'){
      options = name || {};
      appName = self.name;
    }
    options = extend(true, {}, self.messageOptions, options);
    options.icon = self.iconPath + '\\done.png';
    self.notify(appName, options);
  }
  /**
   * Same as notify but here is setted a default icon "fail".
   * @author Tomás Hernández <tomas.hernandez03@gmail.com>
   * @since  2015-02-22
   * @param  {String}   name    Name of the app
   * @param  {Object}   options See available options in
   * {@link https://sites.google.com/site/snarlapp/developers/api-reference|API Reference}
   * @return {Function}
   */
, fail: function(name, options){
    var self = this
      , appName = name
    ;
    if(!name || typeof(name) === 'object'){
      options = name || {};
      appName = self.name;
    }
    options = extend(true, {}, self.messageOptions, options);
    options.icon = self.iconPath + '\\fail.png';
    self.notify(appName, options);
  }
  /**
   * Same as notify but here is setted a default icon "log".
   * @author Tomás Hernández <tomas.hernandez03@gmail.com>
   * @since  2015-02-22
   * @param  {String}   name    Name of the app
   * @param  {Object}   options See available options in
   * {@link https://sites.google.com/site/snarlapp/developers/api-reference|API Reference}
   * @return {Function}
   */
, log: function(name, options){
    var self = this
      , appName = name
    ;
    if(!name || typeof(name) === 'object'){
      options = name || {};
      appName = self.name;
    }
    options = extend(true, {}, self.messageOptions, options);
    options.icon = self.iconPath + '\\log.png';
    self.notify(appName, options);
  }
});

/**
 * Clean text before output
 * @author Tomás Hernández <tomas.hernandez03@gmail.com>
 * @since  2015-02-21
 * @private
 * @param  {String}   text Output text.
 * @return {String}
 */
clean = function(text){
  return text.replace(/\=/g, '\==').replace(/\\/g,'/').replace(/\n/gi,'\\n');
}

module.exports = function(options){
  return new Snarl(options);
};
