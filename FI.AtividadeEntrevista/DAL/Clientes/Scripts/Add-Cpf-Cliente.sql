ALTER TABLE CLIENTES ADD CPF VARCHAR(11) NOT NULL;
CREATE UNIQUE INDEX UQ_CPF ON CLIENTES (CPF);