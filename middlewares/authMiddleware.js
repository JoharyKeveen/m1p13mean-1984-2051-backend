function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        message: "Utilisateur non authentifié",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Vous n'avez pas les droits nécessaires",
      });
    }

    next();
  };
}

module.exports = authorizeRoles;