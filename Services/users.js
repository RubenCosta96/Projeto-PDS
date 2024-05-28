const db = require("../config/mysql");
const utils = require("../utils/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (email, password) => {
    try {
        if (!email || !password) {
            throw new Error("Falha na autenticação!");
        }

        let user = await db.user.findOne({ where: { user_email: email } });

        if (!user) {
            throw new Error("Falha na autenticação!");
        }

        let isMatch = await bcrypt.compare(password, user.user_password);

        if (!isMatch) {
            throw new Error("Falha na autenticação!");
        }

        let token = jwt.sign(
            {
                id: user.uid,
            },
            "#^NJW5SKJ$Oke&Q=QJAR{hfAt9BH^e",
            {
                algorithm: "HS256",
                expiresIn: "1d",
            }
        );

        return {
            success: 1,
            message: "Autenticado com sucesso",
            token: token,
        };
    } catch (err) {
        throw new Error(err.message);
    }
};

exports.register = async (email, password, name) => {
    try {
        let existingUser = await db.user.findOne({
            where: { user_email: email },
        });

        if (existingUser) {
            throw new Error("Utilizador ja registado!");
        }

        if (email.length < 5) throw new Error("Email inválido!");
        if (password.length < 12)
            throw new Error("A palavra-passe tem de ter 12 ou mais caracteres");

        let hashedPassword = await bcrypt.hash(password, 10);

        let newUser = await db.user.create({
            user_email: email,
            user_password: hashedPassword,
            user_name: name,
            user_statusus_id: 1,
            user_typeutid: 3,
        });

        let response = {
            success: 1,
            message: "Utilizador registado com sucesso",
        };

        return response;
    } catch (err) {
        throw new Error(err);
    }
};

exports.registerAdmin = async (idUserToken, email, password, name) => {
    try {
        let user = await utils.userType(idUserToken);
        switch (user) {
            case 1: //Admin
                try {
                    let existingAdmin = await db.user.findOne({
                        where: { user_email: email },
                    });

                    if (existingAdmin) {
                        throw new Error("Admin já registado!");
                    }

                    if (email.length < 5) throw new Error("Email inválido!");
                    if (password.length < 12)
                        throw new Error(
                            "A palavra-passe tem de ter 12 ou mais caracteres"
                        );

                    let hashedPassword = await bcrypt.hash(password, 10);

                    let newAdmin = await db.user.create({
                        user_email: email,
                        user_password: hashedPassword,
                        user_name: name,
                        user_statusus_id: 1,
                        user_typeutid: 2,
                    });
                } catch (err) {
                    throw new Error(err);
                }
                break;
            case 2: //Manager
                throw new Error("Sem permissao!");
            case 3: //User
                throw new Error("Sem permissao!");
            default:
                throw new Error("Utilizador nao reconhecido!");
        }

        let response = {
            success: 1,
            message: "Admin registado com sucesso",
        };

        return response;
    } catch (err) {
        throw new Error(err);
    }
};

exports.getUsers = async (idUserToken) => {
    try {
        let user = await utils.userType(idUserToken);

        switch (user) {
            case 1: //Admin
                try {
                    let users = await db.user.findAll();

                    if (users.length === 0)
                        return res
                            .status(404)
                            .send({
                                success: 0,
                                message: "Não existem utilizadores",
                            });

                    let response = {
                        success: 1,
                        length: users.length,
                        results: users.map((user) => {
                            return {
                                id: user.uid,
                                email: user.user_email,
                                name: user.user_name,
                                status: user.user_statusus_id,
                                type: user.user_typeutid,
                            };
                        }),
                    };
                    return response;
                } catch (err) {
                    throw new Error(err);
                }
                break;
            case 2: //Manager
                throw new Error("Sem permissao!");
            case 3: //User
                throw new Error("Sem permissao!");
            default:
                throw new Error("Utilizador nao reconhecido!");
        }
    } catch (err) {
        throw new Error(err);
    }
};

exports.getUser = async (idUserToken, id) => {
    try {
        let user = await utils.userType(idUserToken);

        switch (user) {
            case 1: //Admin
                try {
                    let user = await db.user.findByPk(id);
                    if (!user)
                        return res
                            .status(404)
                            .send({
                                success: 0,
                                message: "Utilizador inexistente",
                            });

                    let response = {
                        success: 1,
                        length: 1,
                        results: [
                            {
                                id: user.uid,
                                email: user.user_email,
                                name: user.user_name,
                                status: user.user_statusus_id,
                                type: user.user_typeutid,
                            },
                        ],
                    };
                    return response;
                } catch (err) {
                    throw new Error(err);
                }
                break;
            case 2: //Manager
                throw new Error("Sem permissao!");
            case 3: //User
                throw new Error("Sem permissao!");
            default:
                throw new Error("Utilizador nao reconhecido!");
        }
    } catch (err) {
        throw new Error(err);
    }
};

exports.removeUser = async (idUserToken, id) => {
    try {
        let user = await utils.userType(idUserToken);

        switch (user) {
            case 1: //Admin
                try {
                    let user = await db.user.findByPk(id);
                    if (!user)
                        return res
                            .status(404)
                            .send({
                                success: 0,
                                message: "Utilizador inexistente",
                            });

                    await user.destroy();
                } catch (err) {
                    throw new Error(err);
                }
                break;
            case 2: //Manager
                throw new Error("Sem permissao!");
            case 3: //User
                throw new Error("Sem permissao!");
            default:
                throw new Error("Utilizador nao reconhecido!");
        }
        let response = {
            success: 1,
            message: "Utilizador removido com sucesso",
        };

        return response;
    } catch (err) {
        throw new Error(err);
    }
};

exports.tokenVerify = async (token) => {
    try {
        try {
            var decode = jwt.verify(token, "#^NJW5SKJ$Oke&Q=QJAR{hfAt9BH^e");
        } catch (err) {
            return res
                .status(401)
                .send({ success: 0, error: err, message: err.message });
        }

        let id = decode.id;

        let user = await db.user.findByPk(id);
        if (!user)
            return res
                .status(404)
                .send({ success: 0, message: "Utilizador inexistente" });

        let response = {
            success: 1,
            user: {
                id: user.uid,
                email: user.user_email,
                name: user.user_name,
                status: user.user_statusus_id,
            },
        };

        return response;
    } catch (err) {
        throw new Error(err);
    }
};

exports.changePassword = async (idUserToken, oldPassword, newPassword) => {
    try {
        let user = await db.user.findByPk(idUserToken);

        if (newPassword.length < 12)
            return res
                .status(411)
                .send({
                    success: 0,
                    message: "A palavra-passe tem de ter 12 ou mais caracteres",
                });

        if (bcrypt.compareSync(oldPassword, user.user_password)) {
            let hash = await bcrypt.hashSync(newPassword, 10);

            user.user_password = hash;
            await user.save();

            let response = {
                success: 1,
                message: "Palavra-passe alterada com sucesso",
            };

            return response;
        }

        return res.status(403).send({ message: "Palavra-passe incorreta" });
    } catch (err) {
        throw new Error(err);
    }
};

exports.suspendActivity = async (idUserToken, id) => {
    try {
        let user = await utils.userType(idUserToken);

        switch (user) {
            case 1: //Admin
                try {
                    let user = await db.user.findByPk(id);
                    if (!user)
                        return res
                            .status(404)
                            .send({
                                success: 0,
                                message: "Utilizador inexistente",
                            });

                    user.user_statusus_id = 2;
                    await user.save();
                } catch (err) {
                    throw new Error(err);
                }
                break;
            case 2: //Manager
                throw new Error("Sem permissao!");
            case 3: //User
                throw new Error("Sem permissao!");
            default:
                throw new Error("Utilizador nao reconhecido!");
        }
        let response = {
            success: 1,
            message: "Atividade suspensa com sucesso",
        };

        return response;
    } catch (err) {
        throw new Error(err);
    }
};

exports.changeUserType = async (idUserToken, id, type) => {
    try {
        let user = await utils.userType(idUserToken);

        switch (user) {
            case 1: //Admin
                try {
                    let user = await db.user.findByPk(id);
                    if (!user)
                        return res
                            .status(404)
                            .send({
                                success: 0,
                                message: "Utilizador inexistente",
                            });

                    user.user_typeutid = type;
                    await user.save();
                } catch (err) {
                    throw new Error(err);
                }
                break;
            case 2: //Manager
                throw new Error("Sem permissao!");
            case 3: //User
                throw new Error("Sem permissao!");
            default:
                throw new Error("Utilizador nao reconhecido!");
        }
        let response = {
            success: 1,
            message: "Tipo de utilizador alterado com sucesso",
        };

        return response;
    } catch (err) {
        throw new Error(err);
    }
};

exports.editUser = async (idUserToken, email, name) => {
    try {
        let user = await db.user.findByPk(idUserToken);
        if (!user) throw new Error("Usuário não encontrado!");

        if (email) {
            if (email.length < 5) throw new Error("Email Inválido!");
            user.user_email = email;
        }

        if (name) {
            user.user_name = name;
        }

        await user.save();

        let response = {
            success: 1,
            message: "Utilizador editado com sucesso",
        };

        return response;
    } catch (err) {
        return {
            success: 0,
            message: err.message,
        };
    }
};
