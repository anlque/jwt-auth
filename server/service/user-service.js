const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt');
const { v4 } = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');

class UserService {
    async registration(email, password) {
        const candidate = await UserModel.findOne({email})

        if(candidate) {
            throw new Error('User with this email already exists')
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
            throw new Error('Incorrect activation link')
        }
        user.isActivated = true;
        await user.save()
    }
}

module.exports = new UserService()