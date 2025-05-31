require('dotenv').config();

function verifyRoleCode(tipoUsuario, codigo) {
  if (tipoUsuario === 'Tecnico' && codigo !== process.env.CODIGO_TECNICO) return false;
  if (tipoUsuario === 'Delegado' && codigo !== process.env.CODIGO_DELEGADO) return false;
  return true;
}

module.exports = verifyRoleCode;
