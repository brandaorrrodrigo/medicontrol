-- Script para criar o banco de dados MedicControl
-- Execute este script como usuário postgres

-- Criar banco de dados mediccontrol
CREATE DATABASE mediccontrol;

-- Conectar ao banco (você precisará fazer isso manualmente)
\c mediccontrol;

-- Criar extensão para UUIDs (necessário para o Prisma)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
