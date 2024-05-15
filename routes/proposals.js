const express = require("express");
const router = express.Router();

const ProposalController = require("../controllers/proposals");
const login = require("../middleware/login");

// list All porposals
router.get("/Proposal", ProposalController.getAllProposals);

// list All porposals by ad
router.get("/Proposal/ad/:id", ProposalController.getAllProposalsByAd);

// list All porposals by museum
router.get("/Proposal/museum/:id", ProposalController.getAllProposalsByMuseum);

// list certain evaluation
router.get("/Proposal/:id", ProposalController.getProposal);

// Add evaluations
router.post("/Proposal/add", login.required, ProposalController.addProposal);

// Remove evaluation
router.delete("/Proposal/remove/:id", login.required, ProposalController.removeProposal);
 
module.exports = router;