const db = require('../config/mysql');
const utils = require("../utils/index");

exports.SupportTickets = async(idUserToken) => {
    let user = await utils.userType(idUserToken);
    let result;

    switch(user){
        case 1:     //Admin, tem acesso a todos os Tickets que estejam com o estado 
            try{
                result = await db.support_ticket.findAll({
                    where:{
                        support_statesssid: 5,      //Verificar se esta de acordo com a bd
                    }
                });
            }catch(err){
                throw new Error(err);
            }
            break;
        case 2:     //Manager, tem acesso as tickets do seu museu
            try{
                let museum = await db.usermuseum.findOne({
                    where:{
                        useruid: idUserToken,
                    }
                });
                result = await db.support_ticket.findAll({
                    where:{
                        museummid: museum.museummid,
                    }
                });
            }catch(err){
                throw new Error(err);
            }
            break;
        case 3:     //User, tem acesso aos seus tickets
            try{
                result = await db.support_ticket.findAll({
                    where:{
                        useruid: idUserToken,
                    }
                });
            }catch(err){
                throw new Error(err);
            }
            break;
        default:
            throw new Error("Utilizador nao reconhecido!");            
    }
  
    let response = {
        success: 1,
        length: result.length,
        results: result.map((support_ticket) => {
            return {
                id: support_ticket.stid,
                description: support_ticket.Description,
                statessid: support_ticket.support_statesssid,
                museumid: support_ticket.museummid,
                userid: support_ticket.useruid,
                priority: support_ticket.priority,
                responsible: support_ticket.admin_useruid,
                deadline: support_ticket.deadline,
            };
        }),
    }

    return response;
}

exports.getSupportTicket = async(idUserToken, idTicket) => {
    let user = await utils.userType(idUserToken);
    let result;

    switch(user){
        case 1:     //Admin, tem acesso a todos os Tickets que estejam com o estado 
            try{
                result = await db.support_ticket.findOne({
                    where:{
                        stid: idTicket,
                        support_statesssid: 5,      //Verificar se esta de acordo com a bd
                    }
                });
            }catch(err){
                throw new Error(err);
            }
            break;
        case 2:     //Manager, tem acesso as tickets do seu museu
            try{
                let museum = await db.usermuseum.findOne({
                    where:{
                        useruid: idUserToken,
                    }
                });
                result = await db.support_ticket.findOne({
                    where:{
                        stid: idTicket,
                        museummid: museum.museummid,
                    }
                });
            }catch(err){
                throw new Error(err);
            }
            break;
        case 3:     //User, tem acesso aos seus tickets
            try{
                result = await db.support_ticket.findOne({
                    where:{
                        stid: idTicket,
                        useruid: idUserToken,
                    }
                });
            }catch(err){
                throw new Error(err);
            }
            break;
        default:
            throw new Error("Utilizador nao reconhecido!");            
    }
    
    let response;

    if(result){
        response = {
            success: 1,
            length: 1,
            results: [
                {
                    id: result.stid,
                    description: result.Description,
                    statessid: result.support_statesssid,
                    museumid: result.museummid,
                    userid: result.useruid,
                    priority: result.priority,
                    responsible: result.admin_useruid,
                    deadline: result.deadline,
                },
            ],
        };
    }else{
        response = {
            success: 0,
            length: 0,
        };
    }


    return response;
}

exports.addSupportTicket = async (description, museumId, idUserToken) => {
	try {
        console.log("teste")
        console.log(description)
        console.log(museumId)
        console.log(idUserToken)

        if(!description || !museumId || idUserToken){
            console.log("dentro do if")
            throw new Error("Dados em falta");
        }

		let museum = await db.museum.findByPk(museumId);

		if(!museum)
            throw new Error("Museu Inexistente!");

		let newSupport_Ticket = await db.support_ticket.create({
			Description: description,
			support_statesssid: 1,
			museummid: museumId,
			useruid: idUserToken,
		});

		let response = {
			success: 1,
			message: "Pedido de Suporte criado com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};



exports.editSupportTicket = async (description, idUserToken, id) =>{
	try{
		let ticket = await db.support_ticket.findByPk(id);

		if(!ticket) 
            throw new Error("Pedido de suporte inexistente");
		if(ticket.useruid != idUserToken)
            throw new Error("Não existem pedidos de suporte a si pertencentes");
		if(ticket.support_statesssid != 2)
            throw new Error("Sem permissão");

		ticket.Description = description;
		ticket.museummid = ticket.museummid;
		ticket.useruid = idUserToken;
		ticket.priority = 1;
		ticket.support_statesssid = 1;

		await ticket.save();

		let response = {
			success: 1,
			message: "Pedido editado com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};


exports.assignmentPriorityEstimatedDeadline = async (id, idUserToken,priority,deadline) => {
	try {
        let user = await utils.userType(idUserToken);
    
        switch(user){
            case 1:     //Admin, nao tem acesso a esta funçao 
                throw new Error("Sem permissao!");
            case 2:     //Manager, tem acesso as tickets do seu museu
                try{
                    if (!support_ticket) 
                        throw new Error("Ticket inexistente");
            
                    if (support_ticket.museummid !== manager.museummid)
                        throw new Error("Ticket não pertence ao seu museu");
            
                    if (support_ticket.priority != null)
                        throw new Error("Prioridade já atribuída");
            
                    if(support_ticket.deadline != null)
                        throw new Error("Data já atribuída");
            
                    support_ticket.priority = priority;
                    support_ticket.deadline = deadline;
                    support_ticket.support_statesssid = 4;
                    
                    await support_ticket.save();
                }catch(err){
                    throw new Error(err);
                }
                break;
            case 3:     //User, nao tem acesso a esta funçao 
                throw new Error("Sem permissao!");
            default:
                throw new Error("Utilizador nao reconhecido!");            
        }

		let response = {
			success: 1,
			message: "Prioridade e data atribuídas com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};



exports.removeSupportTicket = async (id, idUserToken) => {
	try {
        let user = await utils.userType(idUserToken);
    
        switch(user){
            case 1:     //Admin, nao tem acesso a esta funçao 
                throw new Error("Sem permissao!");
            case 2:     //Manager, tem acesso as tickets do seu museu
                try{
                    let ticket = await db.support_ticket.findByPk(id);

                    if (!ticket) 
                        throw new Error("Ticket inexistente");

                    let manager = await db.usermuseum.findOne({ where: { useruid: idUserToken } });

                    if (ticket.museummid !== manager.museummid) 
                        throw new Error("Ticket não pertence ao seu museu");

                    await ticket.destroy();
                }catch(err){
                    throw new Error(err);
                }
                break;
            case 3:     //User, nao tem acesso a esta funçao 
                throw new Error("Sem permissao!");
            default:
                throw new Error("Utilizador nao reconhecido!");            
        }

		

		let response = {
			success: 1,
			message: "Ticket removido com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

//---------------------------Mudar os controllers---------------------------
//Verificar codigo
exports.SupportTicketSolved = async (id, description,type,idUserToken) => {
	try {
		let user = await utils.userType(idUserToken);
    
        switch(user){
            case 1:     //Admin, nao tem acesso a esta funçao 
            try{
                let ticket = await db.support_ticket.findByPk(id);

                if (!ticket) 
                    throw new Error("Ticket inexistente");

                if(ticket.support_statesssid != 5)
                    throw new Error("Ticket não redireçionado");
                
                if (ticket.support_statesssid === 3) 
                    throw new Error("Ticket já finalizado");
                
                ticket.support_statesssid = 9;

                await notification.addNotifications(description, type, support_ticket.useruid);
        
                await ticket.save();
            }catch(err){
                throw new Error(err);
            }
            break;
            case 2:     //Manager, tem acesso as tickets do seu museu
            try{
                let ticket = await db.support_ticket.findByPk(id);

                if (!ticket) 
                    throw new Error("Ticket inexistente");

                let manager = await db.usermuseum.findOne({ where: { useruid: idUserToken } });

                if (ticket.museummid !== manager.museummid)
                    throw new Error("Ticket não pertence ao seu museu");
                
                if (ticket.support_statesssid === 3) 
                    throw new Error("Ticket já finalizado");
                
                ticket.support_statesssid = 9;

                await notification.addNotifications(description, type, support_ticket.useruid);
        
                await ticket.save();
            }catch(err){
                throw new Error(err);
            }
            break;
            case 3:     //User, nao tem acesso a esta funçao 
                throw new Error("Sem permissao!");
            default:
                throw new Error("Utilizador nao reconhecido!");            
        }

		let response = {
			success: 1,
			message: "Ticket finalizado com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};


//Ver funçao
exports.approveSupportTicket = async (id, idUserToken, description, type) => {
    try {
        let user = await utils.userType(idUserToken);
    
        switch(user){
            case 1:     //Admin, nao tem acesso a esta funçao 
                throw new Error("Sem permissao!");
            case 2:     //Manager, tem acesso as tickets do seu museu
            try{
                let support_ticket = await db.support_ticket.findByPk(id);

                if (!support_ticket) 
                    throw new Error("Ticket inexistente");

                let manager = await db.usermuseum.findOne({ where: { useruid: idUserToken } });

                if (support_ticket.museummid !== manager.museummid)
                    throw new Error("Ticket não pertence ao seu museu");
                
                if (support_ticket.support_statesssid != 1) 
                    throw new Error("Impossível aprovar ticket");
                
                support_ticket.support_statesssid = 3;

                await notification.addNotifications(description, type, support_ticket.useruid);

                await support_ticket.save();
            }catch(err){
                throw new Error(err);
            }
            break;
            case 3:     //User, nao tem acesso a esta funçao 
                throw new Error("Sem permissao!");
            default:
                throw new Error("Utilizador nao reconhecido!");            
        }

        let response = {
            success: 1,
            message: "Ticket aprovado com sucesso",
        };

        return response;
    } catch (err) {
        throw new Error(err);
    }
};


exports.sendNotifications = async (description, type, id, idUserToken) =>{
	try{
        let user = await utils.userType(idUserToken);
    
        switch(user){
            case 1:     //Admin, nao tem acesso a esta funçao 
                throw new Error("Sem permissao!");
            case 2:     //Manager, tem acesso as tickets do seu museu
            try{
                let support_ticket = await db.support_ticket.findByPk(id);

                if (!support_ticket)
                    throw new Error("Ticket inexistente");
        
                let manager = await db.usermuseum.findOne({ where: { useruid: idUserToken } });
        
                if (support_ticket.museummid !== manager.museummid)
                    throw new Error("Ticket não pertence ao seu museu");
        
                if(support_ticket.admin_useruid != idUserToken)
                    throw new Error("Apenas o responsável pelo ticket tem permissão");
        
                await notification.addNotifications(description, type, support_ticket.useruid);
            }catch(err){
                throw new Error(err);
            }
            break;
            case 3:     //User, nao tem acesso a esta funçao 
                throw new Error("Sem permissao!");
            default:
                throw new Error("Utilizador nao reconhecido!");            
        }

		let response = {
			success: 1,
			message: "Notificação enviada com sucesso",
		};

		return response;
	}catch(err){
		throw new Error(err);
	}
};


exports.informMissingData = async (description, type, id, idUserToken) =>{
	try{
        let user = await utils.userType(idUserToken);
    
        switch(user){
            case 1:     //Admin, nao tem acesso a esta funçao 
                throw new Error("Sem permissao!");
            case 2:     //Manager, tem acesso as tickets do seu museu
            try{
                let support_ticket = await db.support_ticket.findByPk(id);
 
                if (!support_ticket)
                    throw new Error("Ticket inexistente");
        
                let manager = await db.usermuseum.findOne({ where: { useruid: idUserToken } });
                
                if (support_ticket.museummid !== manager.museummid)
                    throw new Error("Ticket não pertence ao seu museu");
        
                if(support_ticket.admin_useruid != idUserToken)
                    throw new Error("Apenas o responsável pelo ticket tem permissão");
        
                await notification.addNotifications(description, type, support_ticket.useruid);
        
                support_ticket.support_statesssid = 2;
            }catch(err){
                throw new Error(err);
            }
            break;
            case 3:     //User, nao tem acesso a esta funçao 
                throw new Error("Sem permissao!");
            default:
                throw new Error("Utilizador nao reconhecido!");            
        }

		let response = {
			success: 1,
			message: "Notificação enviada com sucesso",
		};

		return response;
	}catch(err){
		throw new Error(err);
	}
};


//
exports.getSupportTicketsBySuportState = async (state, idUserToken, tickets) => {
	try {
        let user = await utils.userType(idUserToken);
    
        switch(user){
            case 1:     //Admin, nao tem acesso a esta funçao 
                throw new Error("Sem permissao!");
            case 2:     //Manager, tem acesso as tickets do seu museu
            try{
                let result = await db.support_state.findByPk(state);

                if(!result)
                    throw new Error("Não existe esse estado de pedido de suporte");
                
                let manager = await db.usermuseum.findOne({ where: { useruid: idUserToken }});
			    tickets = await db.support_ticket.findAll({ where: { museummid: manager.museummid, support_statesssid: state}});
            }catch(err){
                throw new Error(err);
            }
            break;
            case 3:     
            try{
                let result = await db.support_state.findByPk(state);

                if(!result)
                    throw new Error("Não existe esse estado de pedido de suporte");

                tickets = await db.support_ticket.findAll({ where: { useruid: idUserToken, support_statesssid: state}});
            }catch(err){
                throw new Error(err);
            }
            default:
                throw new Error("Utilizador nao reconhecido!");            
        }

		if (tickets.length === 0)
            throw new Error("Não existem pedidos de suporte");            

		let response = {
			success: 1,
			length: tickets.length,
			results: tickets.map((support_ticket) => {
				return {
					id: support_ticket.stid,
					description: support_ticket.Description,
					statessid: support_ticket.support_statesssid,
					museumid: support_ticket.museummid,
					userid: support_ticket.useruid,
					priority: support_ticket.priority,
					responsible: support_ticket.admin_useruid,
					deadline: support_ticket.deadline,
				};
			}),
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};


exports.redirectTicket = async (id, idUserToken) => {
	try {
        let user = await utils.userType(idUserToken);
    
        switch(user){
            case 1:     //Admin, nao tem acesso a esta funçao 
                throw new Error("Sem permissao!");
            case 2:     //Manager, tem acesso as tickets do seu museu
            try{
                let manager = await db.usermuseum.findOne({ where: { useruid: idUserToken } });
		
                let support_ticket = await db.support_ticket.findByPk(id);
        
                if (!support_ticket)
                    throw new Error("Ticket inexistente");
        
                if (support_ticket.museummid !== manager.museummid)
                    throw new Error("Ticket não pertence ao seu museu");
        
                support_ticket.support_statesssid = 5;
                
                await support_ticket.save();
            }catch(err){
                throw new Error(err);
            }
            break;
            case 3:     
                throw new Error("Sem permissao!");
            default:
                throw new Error("Utilizador nao reconhecido!");            
        }

		let response = {
			success: 1,
			message: "Ticket redirecionado com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};





//---------------------------Mudar os controllers---------------------------