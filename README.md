# hexo-encore

Hexo support for [Webpack/Encore](http://symfony.com/doc/current/frontend.html) (by Symfony). Heavily inspired by [hexo-renderer-webpack](https://github.com/briangonzalez/hexo-renderer-webpack).

## Install

``` bash
$ npm install hexo-encore --save
```

## Options

You can configure this plugin in `_config.yml` and your theme's 
`_config.yml`. The "mode" setting refer's to Encore's environments, you 
can use "dev" or "production" here. "dev" currently emits inlined 
sourcemaps whereas "production" uglifies, mangles and won't emit any 
sourcemap.

``` yaml
webpack:
  mode: production
  entry: 'themes/my-theme/source/js/app.js'
```

or

``` yaml
webpack:
  entry:
    - 'themes/my-theme/source/js/app.js'
    - 'themes/my-theme/source/js/lib.js'
```

## Links

- Hexo: https://hexo.io/
- Webpack: http://webpack.github.io/
- Webpack Encore: http://symfony.com/doc/current/frontend.html
