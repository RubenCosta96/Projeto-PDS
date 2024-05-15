const jwt = require("jsonwebtoken");

exports.required = (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const decoded = jwt.verify(token, "#^NJW5SKJ$Oke&Q=QJAR{hfAt9BH^e");
    req.user = { id: decoded.id }; // Attach the ID directly
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).send({ message: "Falha na autenticação" });
  }
};

exports.optional = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, "#^NJW5SKJ$Oke&Q=QJAR{hfAt9BH^e");
    req.user = decode;
    next();
  } catch (error) {
    next();
  }
};
