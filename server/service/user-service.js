const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt');
const { v4 } = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error')

class UserService {
    async registration(email, password) {
        const candidate = await UserModel.findOne({email})

        if(candidate) {
            throw ApiError.BadRequest('User with this email already exists')
        }

        const hashPassword = await bcrypt.hash(password, 3)
        const activationLink = v4();

        const user = await UserModel.create({email, password: hashPassword, activationLink})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)

        const userDto = new UserDto(user);
        const {accessToken, refreshToken} = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, refreshToken)

        return {
            accessToken,
            refreshToken,
            user: userDto,
        }
    }

    async activate(activationLink){
        const user = await UserModel.findOne({activationLink})
        if(!user){
            throw ApiError.BadRequest('Incorrect activation link')
        }
        user.isActivated = true;
        await user.save()
    }

    async login(email, password){
        const user = await UserModel.findOne({email})

        if(!user){
            throw ApiError.BadRequest('Incorrect email or password')
        }
        const isPassMatch = await bcrypt.compare(password, user.password)

        if(!isPassMatch){
            throw ApiError.BadRequest('Incorrect email or password')
        }

        const userDto = new UserDto(user);
        const {accessToken, refreshToken} = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, refreshToken)

        return {
            accessToken,
            refreshToken,
            user: userDto,
        }
    }

    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.UnauthorisedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb  = await tokenService.findToken(refreshToken)
        if(!tokenFromDb || !userData){
            throw ApiError.UnauthorisedError()
        }

        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: userDto
        }
    }

    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }
}

module.exports = new UserService()