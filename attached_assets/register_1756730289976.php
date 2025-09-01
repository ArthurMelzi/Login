<?php
$arquivo = 'usuarios.json';

// Recebe dados do formulário
$usuario = $_POST['usuario'] ?? '';
$senha = $_POST['senha'] ?? '';

if (!$usuario || !$senha) {
    die("Preencha todos os campos.");
}

// Carrega usuários existentes
$usuarios = file_exists($arquivo) ? json_decode(file_get_contents($arquivo), true) : [];

// Verifica se o usuário já existe
if (isset($usuarios[$usuario])) {
    die("Usuário já existe.");
}

// Salva o usuário com senha criptografada
$usuarios[$usuario] = password_hash($senha, PASSWORD_DEFAULT);
file_put_contents($arquivo, json_encode($usuarios, JSON_PRETTY_PRINT));

echo "Cadastro realizado com sucesso!";
?>
