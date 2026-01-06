import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './types';
export declare const authenticateBasic: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const errorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=middleware.d.ts.map