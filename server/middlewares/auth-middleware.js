const ApiError = require('../exceptions/api-error')
const tokenService = require('../service/token-service')

module.exports = function(req, res, next){
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return next(ApiError.UnauthorisedError());
        }

        const accessToken = authHeader.split(' ')[1];
        if(!accessToken){
            return next(ApiError.UnauthorisedError());
        }
        const userData = tokenService.validateAccessToken(accessToken);

        if(!userData){
            return next(ApiError.UnauthorisedError());
        }
        req.user = userData;
        next();
    } catch(e) {
        next(ApiError.UnauthorisedError());
    }
}