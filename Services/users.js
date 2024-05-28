const db = require("../config/mysql");
const utils = require("../utils/index");

exports.login = async (email, password) =>{
    try{
        if(email == NULL || password == NULL) return res.status(401).send({ success: 0, message: 'Falha na autenticação' });

		let user = await db.user.findOne({ where: { user_email: email } });

		if (!user) {
			return res.status(401).send({ success: 0, message: 'Falha na autenticação' });
		}
		if (bcrypt.compareSync(password, user.user_password)) {
			let token = jwt.sign(
				{
					id: user.uid,
				},
				'#^NJW5SKJ$Oke&Q=QJAR{hfAt9BH^e',
				{
					algorithm: 'HS256',
					expiresIn: '1d',
				}
			);

			return res.status(200).send({
				success: 1,
				message: 'Autenticado com sucesso',
				token: token,
			});
		}

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.register = async (email, password) =>{
    try{
        let existingUser = await db.user.findOne({ where: { user_email: email } });

		if (existingUser) {
			return res.status(409).send({ success: 0, message: 'Utilizador já registado' });
		}

		if (email.length < 5) return res.status(406).send({ success: 0, message: 'Email inválido' });
		if (password.length < 12) return res.status(411).send({ success: 0, message: 'A palavra-passe tem de ter 12 ou mais caracteres' });

		let hashedPassword = await bcrypt.hash(password, 10);

		let newUser = await db.user.create({
			user_email: email,
			user_password: hashedPassword,
			user_name: name,
			user_statusus_id: 1,
			user_typeutid: 3
		});

		let response = {
			success: 1,
			message: 'Utilizador registado com sucesso',
		};

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.registerAdmin = async (idUserToken,email,password,name) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
					let existingAdmin = await db.user.findOne({ where: { user_email: email } });

                    if (existingAdmin) {
                        return res.status(409).send({ success: 0, message: 'Admin já registado' });
                    }

                    if (email.length < 5) return res.status(406).send({ success: 0, message: 'Email inválido' });
                    if (password.length < 12) return res.status(411).send({ success: 0, message: 'A palavra-passe tem de ter 12 ou mais caracteres' });

                    let hashedPassword = await bcrypt.hash(password, 10);

                    let newAdmin = await db.user.create({
                        user_email: email,
                        user_password: hashedPassword,
                        user_name: name,
                        user_statusus_id: 1,
                        user_typeutid: 1
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
			message: 'Admin registado com sucesso',
		};

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.getUsers = async (idUserToken) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
					let users = await db.user.findAll();

                    if (users.length === 0) return res.status(404).send({ success: 0, message: 'Não existem utilizadores' });

                    let response = {
                        success: 1,
                        length: users.length,
                        results: users.map((user) => {
                             return {
                                id: user.uid,
                                 email: user.user_email,
                                name: user.user_name,
                                status: user.user_statusus_id,
                                type: user.user_typeutid
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

        
    }catch (err) {
        throw new Error(err);
    }
};

exports.getUser = async (idUserToken,id) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
					let user = await db.user.findByPk(id);
                    if (!user) return res.status(404).send({ success: 0, message: 'Utilizador inexistente' });

                    let response = {
                        success: 1,
                        length: 1,
                        results: [{
                            id: user.uid,
                            email: user.user_email,
                            name: user.user_name,
                            status: user.user_statusus_id,
                            type: user.user_typeutid
                        }],
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

        
    }catch (err) {
        throw new Error(err);
    }
};

exports.removeUser = async (idUserToken,id) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
					let user = await db.user.findByPk(id);
                    if (!user) return res.status(404).send({ success: 0, message: 'Utilizador inexistente' });

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
			message: 'Utilizador removido com sucesso',
		};

        return response;
    }catch (err) {
        throw new Error(err);
    }
};