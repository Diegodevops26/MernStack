const userService = require('../services/user.service');

async function createUserController(req, res) {

    const { name, username, email, password, avatar, background } = req.body;

    try {
        const token = await userService.createUserService({
            name,
            username,
            email,
            password,
            avatar,
            background,
        });
        res.status(201).send(e.message);
    } catch (e) {
        return res.status(400).send(e.message);
    }
}

async function findAllUserController(req, res) {

    try {
        const users = await userService.findAllUserController();
        return res.send(users);

    } catch (e) {
        return res.send(404).send(e.message);
    }
}

async function findUserByIdController(req, res) {
    try {
        const user = await userService.findAllUserController(
            req.params.id,
            req.useId
        );
        return res.send(user);
    } catch (e) {
        return res.status(400).send(e.message);
    }
}

async function updateUserController(req, res) {
    try {
        const { name, username, email, password, avatar, background } = req.body;
        const { id: userId } = req.params;
        const userIdLogged = req.useId;

        const response = await userService.updateUserController({ name, username, email, password, avatar, background }, useId, userIdLogged);
        return res.send(response);
    } catch (e) {
        res.status(400).send(e.message);
    }
}

export default {
    createUserController,
    findAllUserController,
    findUserByIdController,
    updateUserController,
};