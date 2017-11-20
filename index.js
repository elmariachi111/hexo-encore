var _ = require('lodash');
var Encore = require('@symfony/webpack-encore');
var webpack = require('webpack');

var extend = require('util')._extend;
var os = require('os');
var path = require('path');
var MemoryFS = require('memory-fs');
var fs = new MemoryFS();

var renderer = function(data, options, callback) {

  var userConfig = extend(
    hexo.theme.config.webpack || {},
    hexo.config.webpack || {}
  );

  var cwd = process.cwd();
  var tmpPath = os.tmpdir();

  // Convert config of the entry to object.
  Encore.configureRuntimeEnvironment('production');
  

  var entry = (function(entry) {
    if (_.isString(entry)) {
        entry = [entry];
    } 
    if (_.isArray(entry)) {
        entry = entry.map(function(x) {
            Encore.addEntry(path.basename(x, path.extname(x)), path.join(cwd, x));
            return path.join(cwd, x);
        })
      
        return _.zipObject(entry.map(function(x){
            return path.basename(x, path.extname(x));
        }), entry);
    }
    return _.mapValues(entry, function(x){ return path.join(cwd, x); });
  })(userConfig.entry);

  // If this file is not a webpack entry simply return the file.
  if (!_.includes(entry, data.path)) {
    return callback(null, data.text);
  }
  
  
  Encore.setManifestKeyPrefix(hexo.config.root)
        .setOutputPath(tmpPath)
        .setPublicPath(hexo.config.root)
  ;

  var config = Encore.getWebpackConfig();
  var filename = path.basename(data.path);

  var compiler = webpack(config);
  compiler.outputFileSystem = fs;
  
  compiler.run(function(err, stats) {
    
    let _stats = stats.toJson();
    if (err || stats.hasErrors()) {
        hexo.log.log(stats.toString());
        return callback(_stats.errors, 'Webpack Error.');
    }
    
    var output = compiler.options.output;
    var outputPath = path.join(output.path, filename);    
    var contents = fs.readFileSync(outputPath).toString();

    return callback(null, contents);
  });
}
hexo.extend.renderer.register('js', 'js', renderer);
