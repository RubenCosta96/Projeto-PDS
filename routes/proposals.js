const express = require("express");
const router = express.Router();

const ProposalController = require("../controllers/proposals");
const ProposalStatesController = require("../controllers/proposal_states");
const login = require("../middleware/login");

// list All porposals
router.get("/proposals",login.required, ProposalController.getAllProposals);

// list All porposals by ad
router.get("/proposals/ad/:id",login.required, ProposalController.getAllProposalsByAd);

// list All porposals by museum
router.get("/proposals/museum/:id",login.required, ProposalController.getAllProposalsByMuseum);

// list certain evaluation
router.get("/proposals/:id",login.required, ProposalController.getProposal);

// Add evaluations
router.post("/proposals/add", login.required, ProposalController.addProposal);

// Remove evaluation
router.delete("/proposals/remove/:id", login.required, ProposalController.removeProposal);

// Accept proposal
router.put("/proposals/accept/:id", login.required, ProposalController.acceptProposal);

// reject proposal
router.put("/proposals/reject/:id", login.required, ProposalController.rejectProposal);


// list All porposals States
router.get("/proposals/states",login.required, ProposalStatesController.getAllProposalStates);

// list All porposal state
router.get("/proposals/states/:id", login.required,ProposalStatesController.getProposalState);

// Add porposals State
router.post("/proposals/states/add", login.required, ProposalStatesController.addProposalStates);

// Remove porposals State
router.delete("/proposals/states/remove/:id", login.required, ProposalStatesController.removeProposalStates);



module.exports = router;