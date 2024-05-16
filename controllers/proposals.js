const { where } = require("sequelize");
const db = require("../config/mysql");
const utils = require("../utils/index");
const user = require("../models/user");

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
    let idUserToken = req.user.id;

    let isManager = await utils.isManager(idUserToken);

    if (!isManager) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    let manager = await db.usermuseum.findOne({ where: { useruid: idUserToken } });
    //Verificaçao para entradas repetidas nas BD

    let newProposal = await db.proposal.create({
        price: price,
        adadid: adId,
        museummid: manager.museummid,
        proposal_statepsid: 1,
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


exports.acceptProposal = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    const result = await db.proposal.findByPk(id);

    if (!result) {
      return res
        .status(404)
        .send({ success: 0, message: "proposta inexistente" });
    }

    const ad = await db.ad.findOne({
      where:{
        useruid: idUserToken,
      }
    });

    if(!ad){
      return res
      .status(403)
      .send({ success: 0, message: "Sem premissao" });
    }

    ad.ad_stateadstid = 2;
    result.proposal_statepsid = 2;

    await ad.save();
    await result.save();

    let response = {
      success: 1,
      message: "Proposta aceite",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error accepting proposal:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};


//testar no fim 
exports.rejectProposal = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    const result = await db.proposal.findByPk(id);

    if (!result) {
      return res
        .status(404)
        .send({ success: 0, message: "proposta inexistente" });
    }

    const ad = await db.ad.findOne({
      where:{
        useruid: idUserToken,
      }
    });

    if(!ad){
      return res
      .status(403)
      .send({ success: 0, message: "Sem premissao" });
    }

    ad.ad_stateadstid = 1;
    result.proposal_statepsid = 3;

    await ad.save();
    await result.save();

    let response = {
      success: 1,
      message: "Proposta recusada",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error recusing proposal:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};



exports.confirmProposal = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    let isManager = utils.isManager(id);

    if(!isManager){
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    let museum = await db.usermuseum.findOne({
      where:{
        useruid: idUserToken,
      }
    });

    const result = await db.proposal.findOne({
      where:{
        proposalid: id,
        museummid: museum.museummid,
      }
    });

    if (!result) {
      return res
        .status(404)
        .send({ success: 0, message: "proposta inexistente" });
    }

    if(result.proposal_statepsid != 2){
      return res.status(404).send({ success: 0, message: "proposta Nao esta disponivel para confirmaçao" });
    }

    result.proposal_statepsid = 4;

    await result.save();

    let response = {
      success: 1,
      message: "Proposta aceite",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error accepting proposal:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

//testar no fim 
exports.cancelProposal = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    let isManager = utils.isManager(id);

    if(!isManager){
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    let museum = await db.usermuseum.findOne({
      where:{
        useruid: idUserToken,
      }
    });

    const result = await db.proposal.findOne({
      where:{
        proposalid: id,
        museummid: museum.museummid,
      }
    });

    if (!result) {
      return res
        .status(404)
        .send({ success: 0, message: "proposta inexistente" });
    }

    if(result.proposal_statepsid != 2){
      return res.status(404).send({ success: 0, message: "proposta Nao esta disponivel para confirmaçao" });
    }

    let ad = await db.ad.findByPk(result.adadid);

    result.proposal_statepsid = 5;
    ad.ad_stateadstid = 1;

    await result.save();
    await ad.save();

    let response = {
      success: 1,
      message: "Proposta cancelada",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error cancel proposal:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};