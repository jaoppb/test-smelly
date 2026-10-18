const { UserService } = require('../src/userService');

const dadosUsuarioPadrao = {
  nome: 'Fulano de Tal',
  email: 'fulano@teste.com',
  idade: 25,
};

describe('UserService - Suíte de Testes Limpos (AAA)', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  test('deve criar um usuário válido com status ativo e ID gerado', () => {
    // Arrange
    const { nome, email, idade } = dadosUsuarioPadrao;

    // Act
    const usuarioCriado = userService.createUser(nome, email, idade);

    // Assert
    expect(usuarioCriado.id).toBeDefined();
    expect(usuarioCriado.nome).toBe(nome);
    expect(usuarioCriado.email).toBe(email);
    expect(usuarioCriado.idade).toBe(idade);
    expect(usuarioCriado.isAdmin).toBe(false);
    expect(usuarioCriado.status).toBe('ativo');
    expect(usuarioCriado.createdAt).toBeInstanceOf(Date);
  });

  test('deve buscar um usuário existente pelo ID corretamente', () => {
    // Arrange
    const usuarioCriado = userService.createUser(
      dadosUsuarioPadrao.nome,
      dadosUsuarioPadrao.email,
      dadosUsuarioPadrao.idade
    );

    // Act
    const usuarioBuscado = userService.getUserById(usuarioCriado.id);

    // Assert
    expect(usuarioBuscado).toEqual(usuarioCriado);
  });

  test('deve retornar null ao buscar um usuário com ID inexistente', () => {
    // Arrange
    const idInexistente = 'id-nao-cadastrado';

    // Act
    const resultado = userService.getUserById(idInexistente);

    // Assert
    expect(resultado).toBeNull();
  });

  test('deve lançar erro ao tentar criar usuário sem campos obrigatórios', () => {
    // Arrange
    const nomeVazio = '';
    const email = 'semnome@teste.com';
    const idade = 25;

    // Act & Assert
    expect(() => {
      userService.createUser(nomeVazio, email, idade);
    }).toThrow('Nome, email e idade são obrigatórios.');
  });

  test('deve lançar erro ao tentar criar usuário menor de idade', () => {
    // Arrange
    const nome = 'Menor';
    const email = 'menor@email.com';
    const idadeMenor = 17;

    // Act & Assert
    expect(() => {
      userService.createUser(nome, email, idadeMenor);
    }).toThrow('O usuário deve ser maior de idade.');
  });

  test('deve desativar um usuário comum com sucesso', () => {
    // Arrange
    const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30, false);

    // Act
    const resultado = userService.deactivateUser(usuarioComum.id);
    const usuarioAtualizado = userService.getUserById(usuarioComum.id);

    // Assert
    expect(resultado).toBe(true);
    expect(usuarioAtualizado.status).toBe('inativo');
  });

  test('não deve desativar um usuário administrador', () => {
    // Arrange
    const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

    // Act
    const resultado = userService.deactivateUser(usuarioAdmin.id);
    const usuarioAtualizado = userService.getUserById(usuarioAdmin.id);

    // Assert
    expect(resultado).toBe(false);
    expect(usuarioAtualizado.status).toBe('ativo');
  });

  test('deve retornar false ao tentar desativar um usuário inexistente', () => {
    // Arrange
    const idInexistente = 'id-inexistente';

    // Act
    const resultado = userService.deactivateUser(idInexistente);

    // Assert
    expect(resultado).toBe(false);
  });

  test('deve incluir os dados essenciais de cada usuário no relatório gerado', () => {
    // Arrange
    const usuario1 = userService.createUser('Alice', 'alice@email.com', 28);
    const usuario2 = userService.createUser('Bob', 'bob@email.com', 32);

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain(usuario1.id);
    expect(relatorio).toContain('Alice');
    expect(relatorio).toContain(usuario2.id);
    expect(relatorio).toContain('Bob');
    expect(relatorio).toContain('ativo');
  });

  test('deve informar que não há usuários cadastrados ao gerar relatório com banco vazio', () => {
    // Arrange — banco já limpo no beforeEach

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('Nenhum usuário cadastrado.');
  });
});
