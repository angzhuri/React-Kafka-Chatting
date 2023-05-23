import { Response } from 'express';

interface IRespondSuccessOptions {
  statusCode: number;
  message?: string;
  data?: any;
  totalNum?: number;
}

interface IRespondErrorOptions {
  statusCode: number;
  errors: string[];
}

interface IRespondPartialErrorOptions {
  statusCode: number;
  errors: string[];
  data?: any;
}

interface IRespondDownloadOptions {
  statusCode: number;
  file: any;
}

export class ResponseUtils {
  static respondSuccess(res: Response, options: IRespondSuccessOptions) {
    return res.status(options.statusCode).json(options);
  }

  static respondError(res: Response, options: IRespondErrorOptions) {
    return res.status(options.statusCode).json(options);
  }

  static respondPartialError(res: Response, options: IRespondPartialErrorOptions) {
    return res.status(options.statusCode).json(options);
  }

  static respondDownload(res: Response, options: IRespondDownloadOptions) {
    return res.status(options.statusCode).download(options.file);
  }
}
