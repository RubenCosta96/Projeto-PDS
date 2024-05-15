const express = require("express");
const router = express.Router();

const ProposalController = require("../controllers/proposals");
const login = require("../middleware/login");

// list All porposals
router.get("/proposals", ProposalController.getAllProposals);

// list All porposals by ad
router.get("/proposals/ad/:id", ProposalController.getAllProposalsByAd);

// list All porposals by museum
router.get("/proposals/museum/:id", ProposalController.getAllProposalsByMuseum);

// list certain evaluation
router.get("/proposals/:id", ProposalController.getProposal);

// Add evaluations
router.post("/proposals/add", login.required, ProposalController.addProposal);

// Remove evaluation
router.delete("/proposals/remove/:id", login.required, ProposalController.removeProposal);
 
module.exports = router;