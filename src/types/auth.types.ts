import { JwtPayload } from "jsonwebtoken";

export type CustomJwtPayload = JwtPayload | (JwtPayload & { id: string });
