export function realizarSorteio(participantes: string[]): Map<string, string> | null {
  if (participantes.length < 2) return null;

  const tentativasMaximas = 100;
  
  for (let tentativa = 0; tentativa < tentativasMaximas; tentativa++) {
    const sorteados = [...participantes];
    const resultado = new Map();
    
    for (let i = sorteados.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [sorteados[i], sorteados[j]] = [sorteados[j], sorteados[i]];
    }
    
    let valido = true;
    for (let i = 0; i < participantes.length; i++) {
      if (participantes[i] === sorteados[i]) {
        valido = false;
        break;
      }
      resultado.set(participantes[i], sorteados[i]);
    }
    
    if (valido) return resultado;
  }
  
  return null;
}

export function gerarCodigo(): string {
  const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let codigo = '';
  for (let i = 0; i < 6; i++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return codigo;
}