import type { Request, Response, NextFunction } from "express";
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}
export declare const authenticateToken: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=auth.d.ts.map