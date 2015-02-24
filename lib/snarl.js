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
    , options = extend(true, {}, self.defaultOptions, options)
    , server = options.server
    , port = options.port
  ;
  self.options = options;
  self.stack = [];

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
, defaultOptions: {
    server: 'localhost'
  , port: '8080'
  , name: 'Snarl4'
  , path: {
      icon: __dirname+'\\..\\icon'
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
      , appName = name || self.options.name
      , url = root + 'register?app-sig='+appName+'&app-title='+appName
    ;
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
      , appName = name || self.options.name
      , url = root + 'unregister?app-sig='+appName
    ;
    request(url);
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
      , id = parseInt(new Date().toISOString().replace(/[\W\D]/g, ''))
      , url = root
      , params
    ;
    options = options || {};
    name = name || self.options.name;
    options.title = options.title || 'title';
    options.text = clean(options.text || 'text');
    options.timeout = options.timeout || 3;
    params = Object.keys(options);
    url += 'notify?id='+id+'&app-sig='+name;
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
    var self = this;
    options.icon = self.options.path.icon + '\\done.png';
    self.notify(name, options);
  }
  /**
   * Same as notify but here is setted a default icon "error".
   * @author Tomás Hernández <tomas.hernandez03@gmail.com>
   * @since  2015-02-22
   * @param  {String}   name    Name of the app
   * @param  {Object}   options See available options in
   * {@link https://sites.google.com/site/snarlapp/developers/api-reference|API Reference}
   * @return {Function}
   */
, error: function(name, options){
    var self = this;
    options.icon = self.options.path.icon + '\\error.png';
    self.notify(name, options);
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
    var self = this;
    options.icon = self.options.path.icon + '\\log.png';
    self.notify(name, options);
  }
});

/**
 * Clean text before output
 * @author Tomás Hernández <tomas.hernandez03@gmail.com>
 * @since  2015-02-21
 * @private
 * @param  {String}   text Output message.
 * @return {String}
 */
clean = function(text){
  return text.replace(/\=/g, '\==').replace(/\\/g,'/').replace(/\n/gi,'\\n');
}

module.exports = new Snarl();
