export default interface TokenResponse {

    access_token: string,
    expires_in: number,
    issued_token_type: string,
    token_type: string,
    error?: string,
    error_description?: string

}
