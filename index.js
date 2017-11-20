const _ = require('lodash');
const Encore = require('@symfony/webpack-encore');
const webpack = require('webpack');

const extend = require('util')._extend;
const os = require('os');
const path = require('path');
const MemoryFS = require('memory-fs');
const fs = new MemoryFS();

const renderer = (data, options, callback) => {

  const userConfig = extend(
    hexo.theme.config.webpack || {},
    hexo.config.webpack || {}
  );

  const cwd = process.cwd();
  const tmpPath = os.tmpdir();
  const filename = path.basename(data.path);
  const mode = userConfig.mode || 'production';

  Encore.configureRuntimeEnvironment(mode);
  
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
  
  Encore.setOutputPath(tmpPath)
        .setManifestKeyPrefix(hexo.config.root)
        .setPublicPath(hexo.config.root)
        .enableSourceMaps( mode != 'production')
  ;

  const config = Encore.getWebpackConfig();
  const compiler = webpack(config);
  compiler.outputFileSystem = fs;
  compiler.run( (err, stats) => {
    
    let _stats = stats.toJson();
    if (err || stats.hasErrors()) {
        hexo.log.log(stats.toString());
        return callback(_stats.errors, 'Webpack Error.');
    }
    
    const output = compiler.options.output;
    const outputPath = path.join(output.path, filename);    
    const contents = fs.readFileSync(outputPath).toString();

    return callback(null, contents);
  });
}

hexo.extend.renderer.register('js', 'js', renderer);
