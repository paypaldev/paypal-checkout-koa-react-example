import Staticache from 'koa-static-cache';
import bodyParser from 'koa-bodyparser';
import ReactView from 'koa-react-view';
import convert from 'koa-convert';
import webpackMiddleware from './webpack-middleware';
import addRoutes from './routing';

const middleware = (app, settings) => {

  app.use(bodyParser());

  const {
    viewPath, assetPath, config
  } = settings;

  // render jsx-based views
  ReactView(app, {
    views: viewPath,
    beautify: true,
    internals: true
  });

  // x-response-time
  app.use(async(ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', ms + 'ms');
  });

  // logger
  app.use(async(ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log('[%s] %s - (%sms)', ctx.method, ctx.url, ms);
  });

  // static file serving
  app.use(convert(Staticache(assetPath)));
  // webpack middleware in dev
  console.log('webpack time');
  //webpackMiddleware(app, settings);

  addRoutes(app);
};

export default middleware;
