import authService from "../services/auth.service.js";
import bcrypt from "bcrypt";
import userRepositories from "../repositories/user.repositories.js";


async function createUserService({
    name,
    username,
    email,
    password,
    avatar,
    background,
}) {
    if (!username || !name || !email || !password || !avatar || !background)
        throw new Error("Envie todos os campos para cadastro");
    const foundUser = await useRepositories.findByEmailUserRepository(email);

    if (foundUser) throw new Error("O usuario ja existe");

    const user = await userRepositories.createUserRepository({
        name,
        username,
        email,
        password,
        avatar,
        background,

    });
    if (!user) throw new Error("Error ao criar usuario");
    const token = authService.generateToken(user.id);
    return token;

}

async function findAllUserService() {
    const users = await userRepositories.findAllUserRepository();

    if (users.length == 0) throw new Error("Nao ha usuarios cadastrados");
    return users;
}

async function findUserByIdService(userIdParam, userIdLogged) {
    let idParam;
    if (!userIdParam) {
        userIdParam = userIdLogged;
        idParam = userIdParam
    } else {
        idParam = userIdParam;
    }
    if (!idParam)
        throw new Error("Envie um id nos parametros para procurar o usuario");
    const user = await useRepositories.findAllUserRepository(idParam);

    if (!user) throw new Error("Usuario nao encontrado");
    return user;
}

async function updateUserService({ name, username, email, password, avatar, background },
    userId,
    userIdLogged
) {
    if (!name && !username && !email && !password && !avatar && !background)
        throw new Error("Envie pelo menos um campo para atualizar o usuario");
    const user = await userRepositories.findByIdUserRepository(userId);

    if (user._id != userIdLogged) throw new Error("Voce nao pode atualizar este usuario");

    if (password) password = await bcrypt.hash(password, 10);

    await userRepositories.updateUserRepository(
        userId,
        name,
        username,
        email,
        password,
        avatar,
        background
    );
    return { message: "Usuario atualizado com sucesso!" };
}

export default {
    createUserService,
    findAllUserService,
    findUserByIdService,
    updateUserService,
};