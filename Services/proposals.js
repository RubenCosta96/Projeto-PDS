const { where } = require("sequelize");
const db = require("../config/mysql");
const utils = require("../utils/index");
const user = require("../models/user");
const museum = require("../models/museum");

exports.getAllProposals = async (idUserToken) => {
  try {
    let user = await utils.userType(idUserToken);
    let result;
    
    switch(user){
        case 1:     //Admin, nao tem acesso a esta funçao 
          result = await db.proposal.findAll();

          if (result.length === 0)
            throw new Error("Não existem propostas!");

          break;
        case 2:     //Manager, tem acesso as tickets do seu museu
          let museum = await db.usermuseum.findOne({
            where:{
              useruid: idUserToken,
            }
          });
          result = await db.proposal.findAll({
            where:{
              museummid: museum.museummid
            }
          });

          if (result.length === 0)
            throw new Error("Não existem propostas para o seu museu!");

          break;
        case 3: 
          result = await db.proposal.findAll({
            include:[{
              model: db.ad,
              as: 'adad',
              attributes: ['useruid']
            }],
            where: {
              '$adad.useruid$': idUserToken, // Condição global usando includes
              // Adicione outras condições gerais aqui se necessário
            }
          });
          
          if(result.length === 0) {
            throw new Error("Não existem propostas!");
          }
          break;
        default:
            throw new Error("Utilizador nao reconhecido!");            
    }

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

  return response;
} catch (err) {
  throw new Error(err);
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

    const result = await db.proposal.findByPk(id,{
      include:[{
        model: db.ad,
        as: "adad",
        attributes: ["adid"]
      }]
    });

    if (!result) {
      return res
        .status(404)
        .send({ success: 0, message: "proposta inexistente" });
    }

    const ad = await db.ad.findByPk(result.adad.adid);

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
    return res.status(500).send({ error: err, message: err.message });
  }
};


//testar no fim 
exports.rejectProposal = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    const result = await db.proposal.findByPk(id,{
      include:[{
        model: db.ad,
        as: "adad",
        attributes: ["adid"]
      }]
    });

    if (!result) {
      return res
        .status(404)
        .send({ success: 0, message: "proposta inexistente" });
    }

    const ad = await db.ad.findByPk(result.adad.adid);

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