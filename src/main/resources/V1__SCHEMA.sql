CREATE TABLE TPS_FAMILIA (
    id_familia SERIAL PRIMARY KEY,
    nome_representante VARCHAR(255) NOT NULL,
    idade INT,
    cpf_rg VARCHAR(20),
    telefone VARCHAR(20),
    endereco TEXT,
    qtd_pessoas_residencia INT,
    qtd_pessoas_empregadas INT,
    criancas_frequentam_escola BOOLEAN,
    membro_com_problema_saude BOOLEAN,
    ja_recebeu_ajuda BOOLEAN,
    deseja_participar_cursos BOOLEAN,
    observacao TEXT,
    data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE TPS_DIFICULDADE (
    id_dificuldade SERIAL PRIMARY KEY,
    descricao VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE TPS_FAMILIA_DIFICULDADE (
    id_familia INT NOT NULL,
    id_dificuldade INT NOT NULL,
    descricao_outros TEXT,

    CONSTRAINT pk_familia_dificuldade PRIMARY KEY (id_familia, id_dificuldade),
    CONSTRAINT fk_familia FOREIGN KEY (id_familia) REFERENCES TPS_FAMILIA (id_familia),
    CONSTRAINT fk_dificuldade FOREIGN KEY (id_dificuldade) REFERENCES TPS_DIFICULDADE (id_dificuldade)
);

CREATE TABLE TPS_TIPO_AJUDA (
    id_tipo_ajuda SERIAL PRIMARY KEY,
    tipo_descricao VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE TPS_AJUDA_RECEBIDA (
    id_ajuda_recebida SERIAL PRIMARY KEY,
    id_familia INT NOT NULL,
    id_tipo_ajuda INT NOT NULL,
    data_entrega TIMESTAMP WITH TIME ZONE DEFAULT now(),
    observacao TEXT,
    envolveu_autoridade BOOLEAN DEFAULT FALSE,
    autoridade_nome VARCHAR(255) NULL,

    CONSTRAINT fk_familia FOREIGN KEY (id_familia) REFERENCES TPS_FAMILIA (id_familia),
    CONSTRAINT fk_tipo_ajuda FOREIGN KEY (id_tipo_ajuda) REFERENCES TPS_TIPO_AJUDA (id_tipo_ajuda)
);

CREATE TABLE TPS_UNIDADE_MEDIDA (
    id SERIAL PRIMARY KEY,
    und_medidas VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE TPS_LOCALIZACAO_ESTOQUE (
    id_localizacao SERIAL PRIMARY KEY,
    localizacao_desc VARCHAR(2) NOT NULL UNIQUE
);

CREATE TABLE TPS_ITEM_PRODUTO (
    id_produto SERIAL PRIMARY KEY,
    item_produto_desc VARCHAR(20) NOT NULL UNIQUE
);


CREATE TABLE TPS_ESTOQUE_ALIMENTOS (
    id_alimento SERIAL PRIMARY KEY,
    id_item_produto INT NOT NULL,
    validade DATE NOT NULL,
    id_localizacao INT NOT NULL,
    id_und_medida INT NOT NULL,
    data_entrada DATE NOT NULL,
    data_saida DATE NULL,


    CONSTRAINT fk_id_localizacao FOREIGN KEY (id_localizacao) REFERENCES TPS_LOCALIZACAO_ESTOQUE (id_localizacao),
    CONSTRAINT fk_id_item_produto FOREIGN KEY (id_item_produto) REFERENCES TPS_ITEM_PRODUTO (id_produto),
    CONSTRAINT fk_id_und_medida FOREIGN KEY (id_und_medida) REFERENCES TPS_UNIDADE_MEDIDA (id)
);

CREATE TABLE TPS_STATUS_CESTA (
    id_status_cesta SERIAL PRIMARY KEY,
    status_cesta VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE TPS_TEMPLATE (
    id_template SERIAL PRIMARY KEY,
    template_desc VARCHAR(255) NOT NULL
);

CREATE TABLE TPS_CESTA_GERADA (
    id_cesta SERIAL PRIMARY KEY,
    id_template INT NOT NULL,
    id_familia INT NULL,
    data_criacao TIMESTAMP WITH TIME ZONE NOT NULL,
    id_status INT NOT NULL,

    CONSTRAINT fk_id_status FOREIGN KEY (id_status) REFERENCES TPS_STATUS_CESTA (id_status_cesta),
    CONSTRAINT fk_id_template FOREIGN KEY (id_template) REFERENCES TPS_TEMPLATE (id_template),
    CONSTRAINT fk_id_familia FOREIGN KEY (id_familia) REFERENCES TPS_FAMILIA (id_familia)
);

CREATE TABLE TPS_CESTA_TEMPLATE (
    id_cesta_template SERIAL PRIMARY KEY,
    id_item_produto INT NOT NULL,
    id_template INT NOT NULL,
    quantidade INT NOT NULL,

    CONSTRAINT fk_id_template FOREIGN KEY (id_template) REFERENCES TPS_TEMPLATE (id_template),
    CONSTRAINT fk_id_item_produto FOREIGN KEY (id_item_produto) REFERENCES TPS_ITEM_PRODUTO (id_produto)
);

CREATE TABLE TPS_ITEM_TEMPLATE (
    id_cesta_item SERIAL PRIMARY KEY,
    id_cesta_template INT NOT NULL,
    id_alimento INT NOT NULL,

    CONSTRAINT fk_id_cesta_template FOREIGN KEY (id_cesta_template) REFERENCES TPS_CESTA_TEMPLATE (id_cesta_template),
    CONSTRAINT fk_id_alimento FOREIGN KEY (id_alimento) REFERENCES TPS_ESTOQUE_ALIMENTOS (id_alimento)
);

INSERT INTO TPS_TIPO_AJUDA (tipo_descricao) VALUES
('Cesta Básica'),
('Remédio'),
('Gás de Cozinha'),
('Encaminhamento Social'),
('Outros');

INSERT INTO TPS_UNIDADE_MEDIDA (und_medidas) VALUES
('UND'),
('G'),
('KG'),
('L'),
('MG');

INSERT INTO TPS_STATUS_CESTA (status_cesta) VALUES
('CRIADA'),
('ENTREGUE'),
('CANCELADA');

INSERT INTO TPS_LOCALIZACAO_ESTOQUE (localizacao_desc) VALUES
('1A'),
('2B'),
('3C'),
('4D'),
('5E');

INSERT INTO TPS_ITEM_PRODUTO (item_produto_desc) VALUES
('feijao'),
('arroz'),
('oleo'),
('acucar'),
('macarrao'),
('cafe'),
('leite'),
('farinha'),
('fuba');

INSERT INTO TPS_DIFICULDADE (descricao) VALUES
('Alimentação'),
('Desemprego'),
('Moradia'),
('Saúde'),
('Educação'),
('Outros');