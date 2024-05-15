const { where } = require("sequelize");
const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getAllProposals = async (req, res) => {
  try {
    let result = await db.proposal.findAll();

    if (result.length === 0)
      return res
        .status(404)
        .send({ success: 0, message: "Não existem propostas" });

    let response = {
      success: 1,
      length: result.length,
      results: result.map((proposal) => {
        return {
            proposalid: proposal.proposalid,
            price: proposal.price,
            adId: proposal.adadid,
            museumId: proposal.museummid,
        };
      }),
    };
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getAllProposalsByMuseum = async (req, res) => {
    try {
        let id = req.params.id;

        let museum = await db.museum.findByPk(id);

        if(!museum){
            return res
            .status(404)
            .send({ success: 0, message: "O museu indicado nao existe" });
        }

        let result = await db.proposal.findAll({
            where:{
                museummid: id,
            }
        });
  
        if (result.length === 0)
        return res
          .status(404)
          .send({ success: 0, message: "Não existem propostas relativas ao museu indicado" });
  
        let response = {
            success: 1,
            length: result.length,
            results: result.map((proposal) => {
            return {
                proposalid: proposal.proposalid,
                price: proposal.price,
                adId: proposal.adadid,
                museumId: proposal.museummid,
            };
            }),
        };
        return res.status(200).send(response);
        } catch (err) {
        return res.status(500).send({ error: err, message: err.message });
        }
};

exports.getAllProposalsByAd = async (req, res) => {
    try {
        let id = req.params.id;

        let museum = await db.ad.findByPk(id);

        if(!museum){
            return res
            .status(404)
            .send({ success: 0, message: "O anuncio indicado nao existe" });
        }

        let result = await db.proposal.findAll({
            where:{
                adadid: id,
            }
        });
  
        if (result.length === 0)
        return res
          .status(404)
          .send({ success: 0, message: "Não existem propostas relativas ao anuncio indicado" });
  
        let response = {
            success: 1,
            length: result.length,
            results: result.map((proposal) => {
            return {
                proposalid: proposal.proposalid,
                price: proposal.price,
                adId: proposal.adadid,
                museumId: proposal.museummid,
            };
            }),
        };
        return res.status(200).send(response);
        } catch (err) {
        return res.status(500).send({ error: err, message: err.message });
        }
  };
  
exports.getProposal = async (req, res) => {
  try {
    let id = req.params.id;

    let result = await db.proposal.findByPk(id);

    if (!result) {
      return res
        .status(404)
        .send({ success: 0, message: "Proposta inexistente" });
    }

    let response = {
      success: 1,
      results: {
        proposalid: result.proposalid,
        price: result.price,
        adId: result.adadid,
        museumId: result.museummid,
      },
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addProposal = async (req, res) => {
  try {
    let price = req.body.price;
    let adId = req.body.adId;
    let museumId = req.body.museumId;
    let idUserToken = req.user.id;

    let isManager = await utils.isManager(idUserToken); //Verificar, pode ser assim mas acho que fazia sentido ver se o utilizador esta ligado ao museu em questao
    let isAdmin = await utils.isAdmin(idUserToken);

    if (!isManager && !isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    let user = await db.user.findByPk(idUserToken);
    if (!user) {
      return res
        .status(404)
        .send({ success: 0, message: "Utilizador inexistente" });
    }

    //Verificaçao para entradas repetidas nas BD

    let newProposal = await db.proposal.create({
        price: price,
        adadid: adId,
        museummid: museumId,
    });

    let response = {
      success: 1,
      message: "Proposta criada com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding proposal:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeProposal = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    const result = await db.proposal.findByPk(id);

    if (!result) {
      return res
        .status(404)
        .send({ success: 0, message: "proposta inexistente" });
    }

    //let idOwner = artist.id_user; //ver se faz sentido

    let isAdmin = await utils.isAdmin(idUserToken); //Verificar

    if (!isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    await result.destroy();

    let response = {
      success: 1,
      message: "Proposta removida com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing proposal:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
