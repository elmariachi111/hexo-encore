# hexo-encore

Hexo support for [Webpack/Encore](http://symfony.com/doc/current/frontend.html) (by Symfony). Heavily inspired by [hexo-renderer-webpack](https://github.com/briangonzalez/hexo-renderer-webpack).

## Install

``` bash
$ npm install hexo-encore --save
```

## Options

You can configure this plugin in `_config.yml` or your theme's `_config.yml`.

``` yaml
webpack:
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