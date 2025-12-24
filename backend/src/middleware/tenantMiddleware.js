export function tenantIsolation(req, res, next) {
  const user = req.user;

  // super_admin can access everything
  if (user.role === 'super_admin') {
    return next();
  }

  // tenant users must have tenantId
  if (!user.tenantId) {
    return res.status(403).json({
      success: false,
      message: 'Tenant context missing'
    });
  }

  // Attach tenantId to request for queries
  req.tenantId = user.tenantId;
  next();
}
