/**
 * @packageDocumentation
 * @module api.functional.token.refresh
 * @nestia Generated by Nestia - https://github.com/samchon/nestia 
 */
//================================================================
import { Fetcher } from "@nestia/fetcher";
import type { IConnection } from "@nestia/fetcher";

import type { AuthUsecase } from "./../../../interface/user/auth.usecase.interface";

/**
 * 인증 토큰 재발행 API
 * 
 * Authorization header로 refresh_token을 전달헤야 합니다.
 * 
 * @tag authentication
 * 
 * @controller AuthController.refreshToken()
 * @path GET /token/refresh
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export function refreshToken
    (
        connection: IConnection
    ): Promise<refreshToken.Output>
{
    return Fetcher.fetch
    (
        connection,
        refreshToken.ENCRYPTED,
        refreshToken.METHOD,
        refreshToken.path()
    );
}
export namespace refreshToken
{
    export type Output = AuthUsecase.RefreshResponse;

    export const METHOD = "GET" as const;
    export const PATH: string = "/token/refresh";
    export const ENCRYPTED: Fetcher.IEncrypted = {
        request: false,
        response: false,
    };

    export function path(): string
    {
        return `/token/refresh`;
    }
}