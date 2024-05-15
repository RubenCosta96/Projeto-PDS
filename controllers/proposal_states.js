const db = require('../config/mysql');
const utils = require("../utils/index");

exports.getAllProposalStates = async (req, res) =>{
    try{
        let idUserToken = req.user.id;

        let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin) return res.status(403).send({ success: 0, message: 'Sem permissão' });

        let states = await db.proposal_state.findAll();

        if (states.length === 0)
			return res.status(404).send({ success: 0, message: "Não existem estados de proposta" });

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

        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getProposalState = async (req, res) =>{
    try{
        let idUserToken = req.user.id;
        let id = req.params.id;

        let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin) return res.status(403).send({ success: 0, message: 'Sem permissão' });

        let state = await db.proposal_state.findByPk(id);

        if (!state)
			return res.status(404).send({ success: 0, message: "Estado inexistente" });

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

        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addProposalStates = async (req, res) =>{
    try{
        let idUserToken = req.user.id;
        let description = req.body.description;

        let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin) return res.status(403).send({ success: 0, message: 'Sem permissão' });

        let new_Proposal_state = await db.proposal_state.create({
            description: description,
		});
	
		let response = {
			success: 1,
			message: "Estado de proposta adicionado com sucesso",
		};

        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removeProposalStates = async (req, res) =>{
    try{
        let idUserToken = req.user.id;
        let id = req.params.id;

        let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin) return res.status(403).send({ success: 0, message: 'Sem permissão' });

        let state = await db.proposal_state.findByPk(id);

        if (!state) {
			return res.status(404).send({ success: 0, message: "Estado inexistente" });
		}

        await state.destroy();

		let response = {
			success: 1,
			message: "Proposta de estado removida com sucesso",
		};

        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.editProposalStates = async (req, res) =>{
    try{
        let id = req.params.id;
		let idUserToken = req.user.id;
        let description = req.body.description;

        let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin) return res.status(403).send({ success: 0, message: 'Sem permissão' });

        let state = await db.proposal_state.findByPk(id);
        if (!state) {
			return res.status(404).send({ success: 0, message: "Estado inexistente" });
		}

        state.description = description;

        await state.save();

		let response = {
			success: 1,
			message: "Proposta de estado removida com sucesso",
		};

        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};