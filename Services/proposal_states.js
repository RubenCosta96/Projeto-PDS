const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getAllProposalStates = async () =>{
    try{
        let states = await db.proposal_state.findAll();

        if (states.length === 0)
			throw new Error("Não existem estados de propostas!");  

        let response = {
			success: 1,
			length: states.length,
			results: states.map((proposal_state) => {
				return {
                    id: proposal_state.psid,
                    description: proposal_state.description,
				};
			}),
		};

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.getProposalState = async (id) =>{
    try{

        let state = await db.proposal_state.findByPk(id);

        if (!state)
			throw new Error("Estado inexistente!"); 

        let response = {
            success: 1,
            length: 1,
            results: [
                {
                    id: state.psid,
                    description: state.description,
                },
            ],
        };

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.addProposalStates = async (idUserToken,description) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
                    let new_Proposal_state = await db.proposal_state.create({
                        description: description,
                    });
				} catch (err) {
					throw new Error(err);
				}
                break;
			case 2: //Manager
                throw new Error("Sem permissao!");
			case 3: //User, nao tem acesso a esta funçao
                throw new Error("Sem permissao!");
			default:
				throw new Error("Utilizador nao reconhecido!");
		}
        let response = {
			success: 1,
			message: "Estado de proposta adicionado com sucesso",
		};

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.removeProposalStates = async (idUserToken,id) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
                    let state = await db.proposal_state.findByPk(id);

                    if (!state) {
                        throw new Error("Estado inexistente!"); 
                    }

                    await state.destroy();
				} catch (err) {
					throw new Error(err);
				}
                break;
			case 2: //Manager
                throw new Error("Sem permissao!");
			case 3: //User, nao tem acesso a esta funçao
                throw new Error("Sem permissao!");
			default:
				throw new Error("Utilizador nao reconhecido!");
		}
        let response = {
			success: 1,
			message: "Proposta de estado removida com sucesso",
		};

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.editProposalStates = async (idUserToken,id,description) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
                    let state = await db.proposal_state.findByPk(id);
                    if (!state) {
                        throw new Error("Estado inexistente!"); 
                    }
            
                    state.description = description;
            
                    await state.save();
				} catch (err) {
					throw new Error(err);
				}
                break;
			case 2: //Manager
                throw new Error("Sem permissao!");
			case 3: //User, nao tem acesso a esta funçao
                throw new Error("Sem permissao!");
			default:
				throw new Error("Utilizador nao reconhecido!");
		}
        let response = {
			success: 1,
			message: "Proposta de estado removida com sucesso",
		};

        return response;
    }catch (err) {
        throw new Error(err);
    }
};