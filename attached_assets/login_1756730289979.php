<?php
$arquivo = 'usuarios.json';

$usuario = $_POST['usuario'] ?? '';
$senha = $_POST['senha'] ?? '';

// Carrega usuários
$usuarios = file_exists($arquivo) ? json_decode(file_get_contents($arquivo), true) : [];

if (!isset($usuarios[$usuario])) {
    die("Usuário não encontrado.");
}

if (password_verify($senha, $usuarios[$usuario])) {
    echo "Login bem-sucedido! Bem-vindo, $usuario.";
} else {
    echo "Senha incorreta.";
}
?>