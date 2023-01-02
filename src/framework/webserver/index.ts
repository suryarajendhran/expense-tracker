import express from 'express';
import Sentry from '@sentry/node';
import morgan from 'morgan';
import next from 'next';

const PRODUCTION_LOG_FORMAT = 'request_id=:req[x-request-id] remote_addr=:remote-addr method=:method url=:url status=:status accept=:req[accept] bytes=:res[content-length] response_ms=:response-time[0] user_agent=":req[user-agent]"';
const DEVELOPMENT_LOG_FORMAT = ':method :url :status :response-time[0] ms';

const Webserver = ({ protocol, useDevNext }) => {
    const expressApp = express();

    expressApp.use(Sentry.Handlers.requestHandler());

    if (!process.env.CI && process.env.NODE_ENV === 'production') {
        expressApp.use(
          morgan(
            PRODUCTION_LOG_FORMAT
          )
        );
      } else if (!process.env.CI && process.env.NODE_ENV !== 'production') {
        expressApp.use(morgan(DEVELOPMENT_LOG_FORMAT));
      } else {
        console.warn('Access log format not configured');
      }
    
    
      expressApp.use(
        express.json({
          limit: '1mb',
        })
      );
      expressApp.use(express.urlencoded({ extended: false }));

      const nextApp = next({
        dev: useDevNext,
        dir: 'src/presentation-layer/next-app'
      });

      return {
        ...expressApp,

        addPage: ({ url, file, handler }: { url: string; file: string; handler: (req: Express.Request, res: Express.Response) => any }) => {

        }
      }
}