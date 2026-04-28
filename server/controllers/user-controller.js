const userService = require('../service/user-service');

class UserController {
    async registration(req, res, next){
        try {
            const user = req.body;
            const userData = await userService.registration(user.email, user.password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})

            return res.json(userData);
        }
        catch(e){
            console.log(e)
        }
    }

    async login(req, res){
        try{

        }
        catch(e){

        }
    }

    async logout(req, res){
        try {

        }
        catch(e){

        }
    }
    async refresh(req, res){
        try {

        }
        catch(e){

        }
    }

    async activate(req, res){
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);

            return res.redirect(process.env.CLIENT_URL)
        }
        catch(e){
            console.log(e)
        }
    }

    async getUsers(req, res){
        try {
            res.json(['123','456'])
        }
        catch(e){

        }
    }
}


module.exports = new UserController();